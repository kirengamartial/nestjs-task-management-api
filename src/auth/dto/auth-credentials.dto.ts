import { IsString, Matches, MaxLength, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class AuthCredentialsDto {
    @ApiProperty({ description: 'The username', minLength: 4, maxLength: 20 })
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string

    @ApiProperty({ 
        description: 'The password', 
        minLength: 8, 
        maxLength: 20,
        pattern: '/((?=.*\\d)|(?=.*\\w+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$/'
    })
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\w+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message:'password too weak'})
    password: string
}