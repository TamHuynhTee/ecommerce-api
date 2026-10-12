import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './users.service';
import { ProfileService } from '../profile/profile.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<number> {
    const { profile, email, password, username } = dto;
    const newProfile = await this.profileService.create(profile);

    const userId = await this.userService.create({
      email,
      password,
      username,
      profile: newProfile,
    });

    return userId;
  }

  @Get()
  async getList() {
    return this.userService.findAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findById(id);
  }
}
