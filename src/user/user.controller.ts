import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { TrimRegistrationDto } from './dto/trim-registration.dto';
import { ParseArrayMaxMinLenPipe } from '../common/pips/parse-array-max-min-len.pipe';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/signup')
  @HttpCode(200)
  signUp(
    @Body(ValidationPipe) authCredentialsDot: AuthCredentialsDto,
  ): Promise<{ token: string }> {
    return this.userService.signUp(authCredentialsDot);
  }

  @Post('/signin')
  @HttpCode(200)
  signIp(
    @Body(ValidationPipe) authCredentialsDot: AuthCredentialsDto,
  ): Promise<{ token: string }> {
    return this.userService.signIn(authCredentialsDot);
  }

  @Post('/register-tires')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  registerTires(
    @Body(new ParseArrayMaxMinLenPipe({ items: TrimRegistrationDto }, 1, 5))
    trimRegistrationDto: TrimRegistrationDto[],
  ) {
    return this.userService.registerTires(trimRegistrationDto);
  }

  @Get('/:id/tires')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  getUsersTires(@Param('id') id: string) {
    return this.userService.getUsersTires(id);
  }
}
