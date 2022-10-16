import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateEmployeeDto {
    @ApiProperty()
    @IsNotEmpty()
    @Length(0, 150)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    @Length(0, 75)
    email: string;
}
