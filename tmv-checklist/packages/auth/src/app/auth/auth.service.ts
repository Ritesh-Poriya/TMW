import { Inject, Injectable } from '@nestjs/common';
import { IUser, UserRole } from '../users/@types/users';
import { ISignedTokens } from './@types';
import { AuthorizeResType, ITokenPayload } from './@types/payload';
import { JwtService } from '../jwt/jwt.service';
import { UserService } from '../users/user.service';
import { RegisterAPIResponse } from '../rest/dto/response';
import { CryptoService } from '../crypt/crypto.service';
import { ErrorCode } from '../exceptions/error-codes';
import { CaptchaService } from '../captcha/captcha.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEventType } from '../events/@types';
import { ReCaptchaActionType } from '../captcha/@types';
import { NATS_CLIENT } from '../nats/constants';
import { SuperAdminVerifiedPublisher } from './publishers/superadmin-verified.publisher';
import { Stan } from 'node-nats-streaming';
import { PasswordResetTokenService } from '../user-tokens/password-reset-token.service';
import { CustomExceptionFactory } from '../exceptions/custom-exception.factory';
import { AdminVerifiedPublisher } from './publishers/admin-verified.event.publisher';
import { logAround } from '../logger/decorator/log-around';
import { UserInviteTokenService } from '../user-tokens/user-token.service';
import { CustomException } from '../exceptions/custom-exception';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService<ITokenPayload>,
    private userService: UserService,
    private cryptoService: CryptoService,
    private recaptchaService: CaptchaService,
    private eventEmitter: EventEmitter2,
    private passwordResetTokenService: PasswordResetTokenService,
    private userTokenService: UserInviteTokenService,
    @Inject(NATS_CLIENT) private natsClient: Stan,
  ) {}

  @logAround()
  public async signUp(
    email: string,
    password: string,
    recaptchaToken: string,
    role: UserRole,
    baseUrl: string,
    successRedirectUrl: string,
  ): Promise<RegisterAPIResponse> {
    const isValid = await this.recaptchaService.validateTokenForAction(
      recaptchaToken,
      ReCaptchaActionType.REGISTER_USER,
    );
    if (!isValid) {
      throw CustomExceptionFactory.create(
        ErrorCode.CAPTCHA_TOKEN_VERIFICATION_FAILED,
      );
    }
    const decryptedPassword = this.cryptoService.asymmetricDecrypt(password);
    const hashedPassword = await this.cryptoService.hash(decryptedPassword);
    const newUser = await this.userService.register(
      email,
      hashedPassword,
      role,
    );
    const tokens = this.signUserIn(newUser);
    this.eventEmitter.emit(UserEventType.USER_REGISTERED, {
      user: newUser,
      baseUrl,
      successRedirectUrl,
    });
    return {
      ...tokens,
      emailVerified: false,
    };
  }

  @logAround()
  public async login(
    email: string,
    password: string,
    allowedRoles: UserRole[],
  ) {
    const user = await this.userService.findUserByEmailAndRole(
      email,
      allowedRoles,
    );

    console.log(JSON.stringify(user));

    if (!user) {
      throw CustomExceptionFactory.create(ErrorCode.WRONG_CREDENTIALS);
    }

    const decryptedPassword = this.cryptoService.asymmetricDecrypt(password);
    if (!user.password) {
      throw CustomExceptionFactory.create(ErrorCode.WRONG_CREDENTIALS);
    }
    const isPasswordCorrect = await this.cryptoService.compareHash(
      user.password,
      decryptedPassword,
    );

    if (!isPasswordCorrect) {
      throw CustomExceptionFactory.create(ErrorCode.WRONG_CREDENTIALS);
    }

    const tokens = this.signUserIn(user);

    return {
      ...tokens,
      emailVerified: user.isVerified,
      role: user.role,
    };
  }

  @logAround()
  private signUserIn(newUser: IUser): ISignedTokens {
    const accessToken = this.jwtService.signAccessToken({
      userId: newUser.userId,
      email: newUser.email,
    });
    const refreshToken = this.jwtService.signRefreshToken({
      userId: newUser.userId,
      email: newUser.email,
    });
    return {
      accessToken,
      accessTokenExpireIn: this.jwtService.accessTokenExpireIn,
      refreshToken,
      refreshTokenExpireIn: this.jwtService.refreshTokenExpireIn,
    };
  }

  @logAround()
  async forgotPassword(
    email: string,
    recaptchaToken: string,
    allowedRoles: UserRole[],
    passwordResetUrl: string,
  ) {
    const isValid = await this.recaptchaService.validateTokenForAction(
      recaptchaToken,
      ReCaptchaActionType.USER_FORGOT_PASSWORD,
    );
    if (!isValid) {
      throw CustomExceptionFactory.create(
        ErrorCode.CAPTCHA_TOKEN_VERIFICATION_FAILED,
      );
    }
    const user = await this.userService.findUserByEmailAndRole(
      email,
      allowedRoles,
    );
    if (user) {
      this.eventEmitter.emit(UserEventType.USER_FORGOT_PASSWORD, {
        user,
        passwordResetUrl,
      });
    } else {
      throw CustomExceptionFactory.create(ErrorCode.USER_NOT_FOUND);
    }
  }

  @logAround()
  public getPasswordResetLinkForUser(userId: string, passwordResetUrl: string) {
    const resetPasswordToken =
      this.passwordResetTokenService.generateToken(userId);
    return `${passwordResetUrl}?resetPasswordToken=${resetPasswordToken}`;
  }

  @logAround()
  public async getUserInviteLink(userId: string, inviteUrl: string) {
    const inviteToken = await this.userTokenService.getToken(userId);
    return `${inviteUrl}?inviteToken=${inviteToken}`;
  }

  async validateCredentialsAndEditUser(
    credentials: { email: string; password: string; role: UserRole },
    userData: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    },
  ) {
    try {
      await this.login(credentials.email, credentials.password, [
        credentials.role,
      ]);
    } catch (e) {
      if (e instanceof CustomException) {
        if (e.code === ErrorCode.WRONG_CREDENTIALS) {
          throw CustomExceptionFactory.create(
            ErrorCode.WRONG_PASSWORD_FOR_EDIT_USER,
          );
        }
      }
      throw e;
    }
    const decryptedPassword = this.cryptoService.asymmetricDecrypt(
      userData.password,
    );
    const hashedPassword = await this.cryptoService.hash(decryptedPassword);
    await this.userService.updateUserWithPassword(
      userData.id,
      userData.firstName,
      userData.lastName,
      userData.email,
      hashedPassword,
    );
    return {
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
    };
  }

  @logAround()
  async resetPassword(password: string, resetToken: string) {
    const userId =
      this.passwordResetTokenService.getUserIdFromToken(resetToken);
    const isTokenValid = await this.passwordResetTokenService.verifyToken(
      userId,
      resetToken,
    );
    if (!isTokenValid) {
      throw CustomExceptionFactory.create(
        ErrorCode.PASSWORD_RESET_TOKEN_EXPIRED_OR_INVALID,
      );
    }
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw CustomExceptionFactory.create(
        ErrorCode.PASSWORD_RESET_TOKEN_INVALID,
      );
    }
    const decryptedPassword = this.cryptoService.asymmetricDecrypt(password);
    const hashedPassword = await this.cryptoService.hash(decryptedPassword);
    await this.userService.updateUserPassword(userId, hashedPassword);
    this.passwordResetTokenService.deleteToken(userId);
  }

  @logAround()
  public getUserVerifyLink(
    userId: string,
    baseUrl: string,
    successRedirectUrl: string,
  ) {
    const token = this.cryptoService.encrypt(userId);
    return `${baseUrl}/api/auth/verify-email?verificationToken=${token}&redirectUrl=${successRedirectUrl}`;
  }

  @logAround()
  public async verifyEmail(token: string) {
    const userId = this.cryptoService.decrypt(token);
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw CustomExceptionFactory.create(ErrorCode.USER_NOT_FOUND);
    }
    await this.userService.markUserEmailAsVerified(user.userId);
    this.sendUserVerifiedEvent(user);
  }

  public async acceptInvitation(password: string, invitationToken: string) {
    const userId =
      await this.userTokenService.validateAndDecodeToken(invitationToken);
    await this.userService.markUserEmailAsVerified(userId);
    const decodedPassword = this.cryptoService.asymmetricDecrypt(password);
    const hashedPassword = await this.cryptoService.hash(decodedPassword);
    await this.userService.updateUserPassword(userId, hashedPassword);
  }

  @logAround()
  private sendUserVerifiedEvent(user: IUser) {
    if (user.role === UserRole.SUPER_ADMIN) {
      this.publishSuperAdminVerifiedEvent(user);
    } else if (user.role === UserRole.ADMIN) {
      this.publishAdminVerifiedEvent(user);
    }
  }

  @logAround()
  public async authorize(userId: string): Promise<AuthorizeResType> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw CustomExceptionFactory.create(ErrorCode.NOT_AUTHORIZED);
    }
    if (!user.isVerified) {
      throw CustomExceptionFactory.create(ErrorCode.FORBIDDEN);
    }
    return {
      scope: [],
      role: user.role,
      userId: user.userId,
      email: user.email,
      companyId: user.companyId,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  @logAround()
  private publishSuperAdminVerifiedEvent(user: IUser) {
    new SuperAdminVerifiedPublisher(this.natsClient).publish(user);
  }

  @logAround()
  private publishAdminVerifiedEvent(user: IUser) {
    new AdminVerifiedPublisher(this.natsClient).publish(user);
  }
}
