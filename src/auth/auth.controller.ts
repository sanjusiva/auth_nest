import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthenticateDto } from './dto/authenticate.dto';
import { LoggingInterceptor } from './Interceptor/logging.interceptor';
import { JwtAuthGuard } from './jwt.guard';
import { RoleGuard } from './role/role.guard';
import { Roles } from './roles/roles.decorator';

import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { createDecipheriv } from 'crypto';

import * as bcrypt from 'bcrypt';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
@UseInterceptors(new LoggingInterceptor())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RoleGuard)
  profile(@Req() req, @Res() res) {
    //ony admin
    return res.status(HttpStatus.OK).json(req.user);
  }
  @Get('/any')
  @Roles('admin','customer')
  @UseGuards(JwtAuthGuard, RoleGuard)
  anyUser(@Req() req, @Res() res) {
    //any user
    return res.status(HttpStatus.OK).json(req.user);
  }

  @Throttle(60, 1)
  @Post()
  login(@Res() res, @Body() authenticateDto: AuthenticateDto) {
    try {
      const response = this.authService.authenticate(authenticateDto);
      console.log('response: ', response);

      return res.status(HttpStatus.OK).json({ response });
    } catch (error) {
      return res.status(error.status).json(error.response);
    }
  }
  @Get('/encrypt')
  async encryptAndDecrypt(@Req() req, @Res() res) {

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync('password', salt);
    bcrypt.compareSync('password', hash);
    console.log(salt, hash);

    return res.status(HttpStatus.OK).json(bcrypt.compareSync('password', hash));
  }

  @Get('/hash')
  async chashVal(@Req() req, @Res() res) {
    const saltOrRounds = 10;
    const password = 'Somerandom_password';
    const hash = await bcrypt.hash(password, saltOrRounds);
    const salt = await bcrypt.genSalt();
    const isMatch = await bcrypt.compare(password, hash);
    console.log('hash: ', hash);
    console.log('salt: ', salt);
    console.log('isMatch: ', isMatch);
    return res.status(HttpStatus.OK).json(isMatch);
  }
}
