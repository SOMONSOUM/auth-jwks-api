import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/request';

@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() data: CreateUserRequest) {
    return await this.userService.create(data);
  }
}
