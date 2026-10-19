import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import {
  ERROR_CODE,
  POSTGRES_ERROR_CODE,
} from 'src/common/constants/error-code';
import { CredentialService } from '../auth/credential.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly credentialService: CredentialService,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    // const existingUser = await this.userRepo.findOne({
    //   where: [{ email: data.email }, { username: data.username }],
    // });

    // if (existingUser) {
    //   throw new ConflictException(ERROR_CODE.EMAIL_OR_USERNAME_EXIST);
    // }

    try {
      const hashedPassword = await this.credentialService.hash(data.password);
      const user = this.userRepo.create({
        ...data,
        hashedPassword,
      });

      return new User(await this.userRepo.save(user));
    } catch (error) {
      // Handle concurrent create request error
      if (
        error instanceof QueryFailedError &&
        error?.driverError?.code === POSTGRES_ERROR_CODE.UNIQUE_VIOLATION
      ) {
        throw new ConflictException(ERROR_CODE.EMAIL_OR_USERNAME_EXIST);
      }

      Logger.error(error);

      throw error;
    }
  }

  async findById(id: string): Promise<User> {
    return this.userRepo.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepo.findOneBy({ email });
  }
}
