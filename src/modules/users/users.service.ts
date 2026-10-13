import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ERROR_CODE } from 'src/common/constants/error-code';
import { CredentialService } from '../auth/credential.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly credentialService: CredentialService,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const exist = await this.userRepo.existsBy({
      email: data.email,
    });

    if (exist) {
      throw new ConflictException(ERROR_CODE.EMAIL_EXIST);
    }

    try {
      const hashedPassword = await this.credentialService.hash(data.password);
      const newUser = this.userRepo.create({
        email: data.email,
        name: data.name,
        hashedPassword,
      });

      return new User(await this.userRepo.save(newUser));
    } catch (e) {
      throw e;
    }
  }

  async findById(id: string): Promise<User> {
    return this.userRepo.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepo.findOneBy({ email });
  }
}
