import { IsString, Length, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateFeedbackDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 2000)
  message!: string;
}
