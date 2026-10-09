import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { GetUserParamDto } from './dtos/get-user-param.dto';

@Controller('users')
export class UserController {
  @Post()
  async create() {
    return null;
  }

  @Get()
  async getList(
    @Param() param: GetUserParamDto,
    @Query('limit', ParseIntPipe, new DefaultValuePipe(20)) limit: number,
    @Query('page', ParseIntPipe, new DefaultValuePipe(1)) page: number,
  ) {
    console.log(param);
    return { limit, page, param };
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return id;
  }
}
