import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto): Promise<number> {
    // Validate if a user exist with the given email or username
    const checkEmail = await this.userRepository.existsBy({
      email: data.email,
    });

    if (checkEmail) {
      throw new BadRequestException('Email existed');
    }
    const checkUsername = await this.userRepository.existsBy({
      username: data.username,
    });

    if (checkUsername) {
      throw new BadRequestException('Username existed');
    }
    // Handle error / exceptions
    // Create user
    try {
      const newUser = await this.userRepository.create(data);

      // Returns created user id
      return (await this.userRepository.save(newUser)).id;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: { profile: true },
      select: {
        id: true,
        email: true,
        username: true,
        profile: {
          id: true,
          firstName: true,
          lastName: true,
          gender: true,
          dateOfBirth: true,
          bio: true,
          profileImage: true,
        },
      },
    });
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async update() {}
}
