import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterRequest {
  @IsString({ message: "Ім'я повинно бути строкою" })
  @IsNotEmpty({ message: "Ім'я не повинно бути пустим" })
  @MaxLength(50, { message: "Ім'я не повинно бути більше 50 символів" })
  name!: string;

  @IsString({ message: 'Почта повинна бути строкою' })
  @IsNotEmpty({ message: 'Почта повинна бути обовязковою до заповнення' })
  @IsEmail({}, { message: 'Не валідна електронна адреса' })
  email!: string;

  @IsString({ message: 'Пароль повиннен бути строкою' })
  @IsNotEmpty({ message: 'Пароль повиннен бути обовязковою до заповнення' })
  @MinLength(6, { message: 'Пароль повинен містити не менше 6 символів' })
  @MaxLength(128, { message: 'Пароль не повинен містити більше 128 символів' })
  password!: string;
}
