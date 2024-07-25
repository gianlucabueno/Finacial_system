import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { User as prismaUser } from '@prisma/client';

export const User = createParamDecorator(
  (
    filter: keyof Omit<prismaUser, 'id' | 'password'>,
    context: ExecutionContext,
  ) => {
    const request = context.switchToHttp().getRequest();

    if (request.user) {
      return filter ? request.user[filter] : request.user;
    } else {
      throw new NotFoundException(
        'User not found! Apply AuthGuard to obtain user information!',
      );
    }
  },
);
