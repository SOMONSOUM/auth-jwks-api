import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserRequest } from './dto/request/create-user.request';
import { PasswordService } from 'src/shared/security/password.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async create(data: CreateUserRequest) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    data.password = await this.passwordService.hashPassword(data.password);

    return await this.prisma.user.create({ data });
  }
}
