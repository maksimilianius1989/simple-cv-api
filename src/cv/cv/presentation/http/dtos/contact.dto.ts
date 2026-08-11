import {
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
} from 'class-validator';

export class ContactDto {
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  @Matches(
    /^https?:\/\/(www\.)?linkedin\.com\/(in|company|posts)\/[a-zA-Z0-9-_\p{L}]+/u,
    {
      message:
        'Please provide a valid link to your LinkedIn profile (e.g., https://www.linkedin.com/in/your-profile)',
    },
  )
  linkedin?: string;
}
