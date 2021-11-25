import {
  Body,
  Controller,
  HttpCode,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthCredentialsDot } from './dto/auth-credential.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  @HttpCode(200)
  signUp(
    @Body(ValidationPipe) authCredentialsDot: AuthCredentialsDot,
  ): Promise<{ token: string }> {
    return this.userService.signUp(authCredentialsDot);
  }

  @Post('/signin')
  @HttpCode(200)
  signIp(
    @Body(ValidationPipe) authCredentialsDot: AuthCredentialsDot,
  ): Promise<{ token: string }> {
    return this.userService.signIn(authCredentialsDot);
  }
}
