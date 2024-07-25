import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from './../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    await this.emailExists(data.email);
    const salt = await bcrypt.genSalt();

    data.password = await bcrypt.hash(data.password, salt);

    return await this.prisma.user.create({
      data,
    });
  }

  async list() {
    return await this.prisma.user.findMany();
  }

  async show(id: number) {
    await this.exists(id);

    return await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }


  async updatePartial(
    id: number,
    { email, name, password, value }: UpdateUserDto,
  ) {
    
    await this.exists(id);
    const data: any = {};

    if (email) {
      await this.emailExists(email);
      data.email = email;
    }
    if (name) data.name = name;
    if (password) {
      const salt = await bcrypt.genSalt();

      data.password = await bcrypt.hash(password, salt);
    }
    if (value) data.value = value;

    if(data.value === undefined){
      data.value = 0;
    }
    return await this.prisma.user.update({
      data,
      where: {
        id,
      },
    });
  }

  async delete(id: number) {
    await this.exists(id);
    return await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async exists(id: number) {
    if (
      !(await this.prisma.user.count({
        where: {
          id,
        },
      }))
    ) {
      throw new NotFoundException(`User ${id} does not exist!`);
    }
  }

  async emailExists(email: string) {
    if (
      await this.prisma.user.count({
        where: {
          email,
        },
      })
    ) {
      throw new BadRequestException(`E-mail already registered!`);
    }
  }
}