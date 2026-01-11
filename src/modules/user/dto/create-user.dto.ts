
import { IsString } from 'class-validator';

/**
 * CreateUserDto
 */
export class CreateUserDto {
  @IsString()
  name!: string;
}
