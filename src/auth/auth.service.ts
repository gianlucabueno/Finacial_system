import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'users';

  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaClient,
    private readonly userService: UserService,
  ) {}

  async createToken(user: User) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.id,
        },
        {
          expiresIn: '7 days',
          subject: String(user.id),
          issuer: this.issuer,
          audience: this.audience,
        },
      ),
    };
  }

  async checkToken(token: string) {
    try {
      const data = await this.jwtService.verify(token, {
        issuer: this.issuer,
        audience: this.audience,
      });

      return data;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async isValidToken(token: string) {
    try {
      await this.checkToken(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) throw new UnauthorizedException('Wrong e-mail and/or password!');

    if (!(await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('Wrong e-mail and/or password!');

    const token = await this.createToken(user);
    console.log(token)
    return {
      token: token,
      user_id: user.id
    }
  }

  async forgot(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) throw new UnauthorizedException('Wrong e-mail!');

    //TO-DO: send password recovery e-mail

    return true;
  }

  async reset(password: string, token: string) {
    //TO-DO: validate token

    const id = 0; // will be changed when token gets validated

    const user = await this.prisma.user.update({
      where: { id },
      data: { password },
    });

    return this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return this.createToken(user);
  }
}
