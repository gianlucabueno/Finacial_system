import { IsJWT, IsString, IsStrongPassword } from 'class-validator';

export class AuthResetDTO {
  @IsString()
  @IsStrongPassword({
    minLength: 6,
    minNumbers: 0,
    minLowercase: 0,
    minUppercase: 0,
    minSymbols: 0,
  })
  password: string;

  @IsJWT()
  token: string;
}
