import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class AuthLoginDTO {
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword({
    minLength: 6,
    minNumbers: 0,
    minLowercase: 0,
    minUppercase: 0,
    minSymbols: 0,
  })
  password: string;
}
