import { Injectable } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  async register() {}

  async login(payload: LoginDto) {
    return payload;
  }
}
