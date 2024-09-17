import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CheckUserExistsAPIBody,
  ForgotPasswordAPIBody,
  LoginAPIBody,
  RegisterAPIBody,
  VerifyEmailQueryDto,
} from './dto/request';
import {
  CheckUserExistsAPIResponse,
  CurrentUserAPIResponse,
  LoginAPIResponse,
  RegisterAPIResponse,
} from './dto/response';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../users/user.service';
import { Public } from '../auth/decorators';
import { UserAuthData } from '../auth/decorators/user.decorator';
import { AuthorizeResType } from '../auth/@types/payload';
import { Response } from 'express';
import { ResetPasswordAPIBody } from './dto/request/reset-password.dto';
import { RateLimitError } from '../blocking/decorators/rate-limit-error.decorator';
import { WrongCredentialsException } from '../exceptions/wrong-credentials';
import { HostService } from '../host/host.service';
import { HostName } from '../host/decorators/host-name.decorator';
import { EditMeDto } from './dto/request/edit-user.dto';
import { AcceptInvitationReqDto } from './dto/request/accecpt-invitation.dto';

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private hostsService: HostService,
  ) {}

  @Public()
  @Post('/register')
  @ApiResponse({ status: 200, type: RegisterAPIResponse })
  public async register(
    @Body() body: RegisterAPIBody,
    @HostName() hostName: string,
  ) {
    return this.authService.signUp(
      body.email,
      body.password,
      body.recaptchaToken,
      this.hostsService.getSignupRoleByHostName(hostName),
      this.hostsService.getBaseNameByHostName(hostName),
      this.hostsService.getSuccessRedirectUrlByHostName(hostName),
    );
  }

  @Public()
  @RateLimitError({
    limitKey: 'blockingConfig.wrongCredentialsLimit',
    windowKey: 'blockingConfig.wrongCredentialsWindowInMinutes',
    blockDurationKey: 'blockingConfig.wrongCredentialsBlockDurationInMinutes',
    Class: WrongCredentialsException,
  })
  @Post('/login')
  @ApiResponse({ status: 200, type: LoginAPIResponse })
  public async login(@Body() body: LoginAPIBody, @HostName() hostName: string) {
    return this.authService.login(
      body.email,
      body.password,
      this.hostsService.getAllowedLoginRolesByHostName(hostName),
    );
  }

  @Public()
  @HttpCode(200)
  @Post('/forgot-password')
  @ApiResponse({ status: 200, type: null })
  public async forgotPassword(
    @Body() body: ForgotPasswordAPIBody,
    @HostName() hostName: string,
  ) {
    await this.authService.forgotPassword(
      body.email,
      body.recaptchaToken,
      this.hostsService.getAllowedLoginRolesByHostName(hostName),
      this.hostsService.getPasswordResetUrlByHostName(hostName),
    );
  }

  @Public()
  @HttpCode(200)
  @Post('/reset-password')
  @ApiResponse({ status: 200, type: null })
  public async resetPassword(@Body() body: ResetPasswordAPIBody) {
    await this.authService.resetPassword(body.password, body.resetToken);
  }

  @Public()
  @HttpCode(200)
  @Post('/accept-invitation')
  @ApiResponse({ status: 200, type: null })
  public async acceptInvitation(@Body() body: AcceptInvitationReqDto) {
    await this.authService.acceptInvitation(body.password, body.inviteCode);
  }

  @HttpCode(200)
  @Get('/current-user')
  @ApiResponse({ status: 200, type: CurrentUserAPIResponse })
  public async currentUser(
    @UserAuthData() user: AuthorizeResType,
  ): Promise<CurrentUserAPIResponse> {
    const userDoc = await this.userService.findUserById(user.userId);
    return {
      email: userDoc.email,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      isVerified: userDoc.isVerified,
      role: userDoc.role,
    };
  }

  @HttpCode(200)
  @Public()
  @Post('/check-user-exists')
  @ApiResponse({ status: 200, type: CheckUserExistsAPIResponse })
  public async checkUserExists(
    @Body() body: CheckUserExistsAPIBody,
  ): Promise<CheckUserExistsAPIResponse> {
    try {
      const user = await this.userService.findUserByEmail(body.email);
      return {
        exists: !!user,
      };
    } catch (error) {
      return {
        exists: false,
      };
    }
  }

  @Public()
  @Get('/verify-email')
  public async verifyEmail(
    @Query() queryParams: VerifyEmailQueryDto,
    @Res() res: Response,
    @HostName() hostName: string,
  ) {
    try {
      await this.authService.verifyEmail(queryParams.verificationToken);
      return res.redirect(
        queryParams.redirectUrl ||
          this.hostsService.getSuccessRedirectUrlByHostName(hostName),
      );
    } catch (error) {
      return res.redirect(
        this.hostsService.getFailureRedirectUrlByHostname(hostName),
      );
    }
  }

  @Get('/authorize')
  public async authorize(@UserAuthData() userAuthData: AuthorizeResType) {
    return userAuthData;
  }

  @Put('/edit/me')
  public async editMe(
    @Body() body: EditMeDto,
    @UserAuthData() userAuthData: AuthorizeResType,
  ) {
    await this.authService.validateCredentialsAndEditUser(
      {
        email: userAuthData.email,
        password: body.currentPassword,
        role: userAuthData.role,
      },
      {
        id: userAuthData.userId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: body.newPassword,
      },
    );
  }
}
