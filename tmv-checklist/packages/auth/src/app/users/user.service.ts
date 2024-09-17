import { InjectUserRepository } from './decorators/inject-user-repository';
import { User } from './entities/user.entity';
import { UserRepository } from './providers/user.repository';
import { ErrorCode } from '../exceptions/error-codes';
import {
  AccountStatus,
  FindCompanyUserOptions,
  FindSuperAdminOptions,
  IUser,
  UserRole,
} from './@types/users';
import { CustomExceptionFactory } from '../exceptions/custom-exception.factory';
import { logAround } from '../logger/decorator/log-around';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEventType } from '../events/@types';
import { Brackets, DataSource, In, IsNull, Not } from 'typeorm';
import {
  PageService,
  PaginationFilter,
  PaginationResponse,
} from '../common/pagination';
import { SortOrder } from '../common/@types';
import { CompanyUserDto } from '../rest/dto/request/create-user.dto';
import { DATA_SOURCE } from '../db/constants';
import { Inject } from '@nestjs/common';

export class UserService extends PageService<User> {
  constructor(
    @InjectUserRepository()
    private readonly userRepository: UserRepository,
    private readonly eventEmitter: EventEmitter2,
    @Inject(DATA_SOURCE)
    private readonly dataSource: DataSource,
  ) {
    super(userRepository);
  }

  @logAround()
  public async register(
    email: string,
    password: string,
    role: UserRole,
    companyId?: string,
  ): Promise<IUser> {
    const checkExists = await this.checkUserExistsByEmail(email);
    if (checkExists) {
      throw CustomExceptionFactory.create(ErrorCode.USER_ALREADY_EXISTS);
    }
    const newUser = new User();
    newUser.email = email;
    newUser.firstName = 'Test';
    newUser.lastName = 'User';
    newUser.password = password;
    newUser.companyId = companyId;
    newUser.role = role;
    const savedUser = await this.userRepository.registerNewUser(newUser);
    return savedUser;
  }

  @logAround()
  public async findUserByEmail(email: string): Promise<IUser> {
    return this.userRepository.findOneTenantUser({
      where: {
        email,
      },
    });
  }

  @logAround()
  public async findUserByEmailAndRole(
    email: string,
    role: UserRole[],
  ): Promise<IUser> {
    return this.userRepository.findOneTenantUser({
      where: {
        email,
        role: In(role),
      },
    });
  }

  @logAround()
  public async findUserById(id: string): Promise<IUser> {
    const user = await this.userRepository.findOneTenantUser({
      where: { id },
    });
    if (!user) {
      throw CustomExceptionFactory.create(ErrorCode.USER_NOT_FOUND);
    }
    return user;
  }

  @logAround()
  public async findSuperadminById(id: string): Promise<IUser> {
    const user = await this.userRepository.findOneTenantUser({
      where: {
        id,
        companyId: IsNull(),
      },
    });
    if (!user) {
      throw CustomExceptionFactory.create(ErrorCode.USER_NOT_FOUND);
    }
    return user;
  }

  @logAround()
  public async checkUserExistsByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    return !!user;
  }

  @logAround()
  public async checkUserExistsByEmailWithRole(
    email: string,
    role: UserRole,
  ): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: {
        email,
        role,
      },
    });

    return !!user;
  }

  @logAround()
  public async markUserEmailAsVerified(userId: string) {
    this.userRepository.update({ id: userId }, { isVerified: true });
  }

  @logAround()
  public async updateUserPassword(userId: string, hashedPassword: string) {
    this.userRepository.update({ id: userId }, { password: hashedPassword });
  }

  @logAround()
  public async unlockUserByEmailAndRole(email: string, role: UserRole) {
    const foundUser = await this.userRepository.findOne({
      where: {
        email,
        role,
      },
    });
    if (!foundUser) {
      throw CustomExceptionFactory.create(ErrorCode.USER_NOT_FOUND);
    }
    await this.userRepository.update(
      { id: foundUser.id },
      { status: AccountStatus.ACTIVE },
    );
  }

  @logAround()
  public async deleteUserByEmailAndRole(email: string, role: UserRole) {
    this.userRepository.delete({
      email,
      role,
    });
  }

  @logAround()
  public async findUsersByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.find({
      where: {
        role,
      },
    });
  }

  @logAround({
    ignoreArgs: false,
    ignoreReturn: false,
  })
  public async createOrUpdateMasterAdminUser(
    email: string,
    hashedPassword: string,
  ) {
    const masterAdminUsers = await this.findUsersByRole(UserRole.MASTER_ADMIN);
    if (masterAdminUsers && masterAdminUsers.length > 0) {
      return;
    }
    const masterAdmin = new User();
    masterAdmin.email = email;
    masterAdmin.firstName = 'Master';
    masterAdmin.lastName = 'Admin';
    masterAdmin.password = hashedPassword;
    masterAdmin.isVerified = true;
    masterAdmin.status = AccountStatus.ACTIVE;
    masterAdmin.role = UserRole.MASTER_ADMIN;
    return this.userRepository.save(masterAdmin);
  }

  @logAround()
  public async findSuperAdmins(
    filter: PaginationFilter & FindSuperAdminOptions,
    userId: string,
  ): Promise<PaginationResponse<User>> {
    const query = this.userRepository.createQueryBuilder('user');
    if (filter.search) {
      query.where(
        new Brackets((qb) => {
          qb.orWhere(
            `CONCAT(user.firstName, ' ', user.lastName) ILIKE :search`,
            {
              search: `%${filter.search}%`,
            },
          )
            .orWhere(
              `CONCAT(user.lastName, ' ', user.firstName) ILIKE :search`,
              {
                search: `%${filter.search}%`,
              },
            )
            .orWhere('user.email ILIKE :search', {
              search: `%${filter.search}%`,
            });
        }),
      );
    }
    query.andWhere('user.role = :role', {
      role: UserRole.SUPER_ADMIN,
    });
    if (filter.excludeMe) {
      query.andWhere('user.id != :userId', { userId });
    }
    if (filter.orderBy) {
      query.orderBy(
        `"${filter.orderBy}"`,
        filter.sortOrder === SortOrder.DESC ? 'DESC' : 'ASC',
      );
    } else {
      query.orderBy('user.createdAt', 'DESC');
    }
    query.skip((filter.page - 1) * filter.pageSize);
    query.take(filter.pageSize);

    const [data, total] = await query.getManyAndCount();

    return {
      items: data,
      meta: {
        currentPage: filter.page,
        itemsPerPage: filter.pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / filter.pageSize),
        itemCount: data.length,
      },
    };
  }

  @logAround()
  public async createSuperadmin(
    firstName: string,
    lastName: string,
    email: string,
    role: UserRole,
  ) {
    const foundUser = await this.findUserByEmail(email);
    if (foundUser) {
      throw CustomExceptionFactory.create(ErrorCode.USER_ALREADY_EXISTS);
    }
    const newUser = new User();
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.email = email;
    newUser.role = role;
    const user = await this.userRepository.save(newUser);
    this.eventEmitter.emit(UserEventType.USER_CREATED, user);
    return user;
  }

  @logAround()
  public async updateUserWithPassword(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    hashedPassword: string,
  ) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!foundUser) {
      throw CustomExceptionFactory.create(ErrorCode.USER_NOT_FOUND);
    }
    const user = await this.userRepository.findOne({
      where: {
        email,
        id: Not(id),
      },
    });
    if (user) {
      throw CustomExceptionFactory.create(ErrorCode.USER_ALREADY_EXISTS);
    }
    return this.userRepository.update(
      { id },
      {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    );
  }

  @logAround()
  public async updateUserNamesOrEmail(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
  ) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id,
        role: UserRole.SUPER_ADMIN,
      },
    });
    if (!foundUser) {
      throw CustomExceptionFactory.create(ErrorCode.USER_NOT_FOUND);
    }
    const user = await this.userRepository.findOne({
      where: {
        id: Not(id),
        email,
      },
    });
    if (user) {
      throw CustomExceptionFactory.create(ErrorCode.USER_ALREADY_EXISTS);
    }
    await this.userRepository.update(
      { id },
      {
        firstName,
        lastName,
        email,
      },
    );
    if (foundUser.email !== email) {
      const user = await this.userRepository.findOne({
        where: {
          id,
        },
      });
      this.eventEmitter.emit(UserEventType.USER_EMAIL_CHANGED, user);
    }
  }

  @logAround()
  public async deleteSuperAdmin(id: string) {
    const { affected } = await this.userRepository.delete({
      id,
      role: UserRole.SUPER_ADMIN,
    });
    if (affected < 1) {
      throw CustomExceptionFactory.create(ErrorCode.USER_NOT_FOUND);
    }
  }

  @logAround()
  public async findUsersByCompanyId(
    filter: PaginationFilter & FindCompanyUserOptions,
    userId: string,
    companyId: string,
  ) {
    const query = this.userRepository.createQueryBuilder('user');
    if (filter.search) {
      query.where(
        new Brackets((qb) => {
          qb.orWhere(
            `CONCAT(user.firstName, ' ', user.lastName) ILIKE :search`,
            {
              search: `%${filter.search}%`,
            },
          )
            .orWhere(
              `CONCAT(user.lastName, ' ', user.firstName) ILIKE :search`,
              {
                search: `%${filter.search}%`,
              },
            )
            .orWhere('user.email ILIKE :search', {
              search: `%${filter.search}%`,
            });
          if (
            [
              UserRole.ADMIN.toString(),
              UserRole.TECHNICIAN.toString(),
              UserRole.SERVICE_ADVISER.toString(),
            ].includes(filter.search)
          ) {
            qb.orWhere('user.role = :role', {
              role: filter.search,
            });
          }
        }),
      );
    }
    if (filter.roles) {
      query.andWhere('user.role IN (:...userRoles)', {
        userRoles: filter.roles,
      });
    }
    query.andWhere('user.role IN (:...roles)', {
      roles: [UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.SERVICE_ADVISER],
    });
    console.log(companyId);
    query.andWhere('user.companyId = :companyId', { companyId });
    if (filter.excludeMe) {
      query.andWhere('user.id != :userId', { userId });
    }
    if (filter.orderBy) {
      query.orderBy(
        `"${filter.orderBy}"`,
        filter.sortOrder === SortOrder.DESC ? 'DESC' : 'ASC',
      );
    } else {
      query.orderBy('user.createdAt', 'DESC');
    }
    query.skip((filter.page - 1) * filter.pageSize);
    query.take(filter.pageSize);
    console.log(query.getSql());
    const [data, total] = await query.getManyAndCount();

    return {
      items: data,
      meta: {
        currentPage: filter.page,
        itemsPerPage: filter.pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / filter.pageSize),
        itemCount: data.length,
      },
    };
  }

  @logAround()
  public async createUserForCompany(
    firstName: string,
    lastName: string,
    email: string,
    role: UserRole,
    companyId: string,
    maxCount: number,
  ): Promise<User> {
    const foundUser = await this.findUserByEmail(email);
    if (foundUser) {
      throw CustomExceptionFactory.create(ErrorCode.EMAIL_IN_USE);
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const usersCount = await queryRunner.manager.count(User, {
        where: {
          companyId,
          role: UserRole.TECHNICIAN,
        },
      });
      if (usersCount >= maxCount && role === UserRole.TECHNICIAN) {
        throw CustomExceptionFactory.create(ErrorCode.MAX_USERS_REACHED);
      }
      const user = new User();
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.role = role;
      user.companyId = companyId;
      const savedUser = await queryRunner.manager.save(user);
      this.eventEmitter.emit(UserEventType.USER_CREATED, savedUser);
      await queryRunner.commitTransaction();
      return savedUser;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  @logAround()
  public async updateUserNamesOrEmailOrRoleForCompany(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    role: UserRole,
    companyId: string,
    maxUsers: number,
  ) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id,
        companyId,
        role: In([
          UserRole.ADMIN,
          UserRole.TECHNICIAN,
          UserRole.SERVICE_ADVISER,
        ]),
      },
    });
    if (!foundUser) {
      throw CustomExceptionFactory.create(ErrorCode.USER_NOT_FOUND);
    }
    const userWithEmail = await this.userRepository.findOne({
      where: {
        id: Not(id),
        email,
      },
    });
    if (userWithEmail) {
      throw CustomExceptionFactory.create(ErrorCode.EMAIL_IN_USE);
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (
        role === UserRole.TECHNICIAN &&
        foundUser.role !== UserRole.TECHNICIAN
      ) {
        const count = await queryRunner.manager.count(User, {
          where: {
            companyId,
            role: UserRole.TECHNICIAN,
          },
        });
        if (count >= maxUsers) {
          throw CustomExceptionFactory.create(ErrorCode.MAX_USERS_REACHED);
        }
        await queryRunner.manager.update(
          User,
          { id },
          { firstName, lastName, email, role },
        );
      } else {
        await queryRunner.manager.update(
          User,
          { id },
          { firstName, lastName, email, role },
        );
      }
      if (foundUser.email !== email) {
        const user = await queryRunner.manager.findOne(User, {
          where: {
            id,
          },
        });
        this.eventEmitter.emit(UserEventType.USER_EMAIL_CHANGED, user);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @logAround()
  public async deleteUserForCompany(id: string, companyId: string) {
    const { affected } = await this.userRepository.delete({
      id,
      companyId,
      role: In([UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.SERVICE_ADVISER]),
    });
    if (affected < 1) {
      throw CustomExceptionFactory.create(ErrorCode.USER_NOT_FOUND);
    }
  }

  public async findUserByIdForCompany(
    id: string,
    companyId: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
        companyId,
        role: In([
          UserRole.ADMIN,
          UserRole.TECHNICIAN,
          UserRole.SERVICE_ADVISER,
        ]),
      },
    });
    if (!user) {
      throw CustomExceptionFactory.create(ErrorCode.USER_NOT_FOUND);
    }
    return user;
  }

  @logAround()
  public async createBulkUserForCompany(
    usersToCreate: CompanyUserDto[],
    companyId: string,
    maxUsers: number,
  ): Promise<User[]> {
    const users: User[] = [];
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const usersCount = await queryRunner.manager.count(User, {
        where: {
          companyId,
          role: UserRole.TECHNICIAN,
        },
      });
      if (usersCount + usersToCreate.length > maxUsers) {
        throw CustomExceptionFactory.create(
          ErrorCode.USER_COUNT_WILL_EXCEED_LIMIT,
        );
      }
      for (const userToCreate of usersToCreate) {
        const foundUser = await queryRunner.manager.findOne(User, {
          where: {
            email: userToCreate.email,
          },
        });
        if (foundUser) {
          throw CustomExceptionFactory.create(ErrorCode.EMAIL_IN_USE);
        }
        const user = new User();
        user.firstName = userToCreate.firstName;
        user.lastName = userToCreate.lastName;
        user.email = userToCreate.email;
        user.role = userToCreate.role;
        user.companyId = companyId;
        const savedUser = await queryRunner.manager.save(user);
        users.push(savedUser);
      }
      for (const user of users) {
        this.eventEmitter.emit(UserEventType.USER_CREATED, user);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    return users;
  }

  @logAround()
  public async getUserCountForCompany(
    companyId: string,
    role: UserRole | undefined,
  ): Promise<number> {
    return this.userRepository.count({
      where: {
        companyId,
        role:
          role ||
          In([UserRole.ADMIN, UserRole.TECHNICIAN, UserRole.SERVICE_ADVISER]),
      },
    });
  }

  @logAround()
  public async deleteByCompanyId(companyId: string) {
    if (companyId) {
      await this.userRepository.delete({
        companyId,
      });
    }
  }
}
