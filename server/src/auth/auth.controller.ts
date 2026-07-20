import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('认证')
@Controller('api/auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '注册' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: '登录' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('wechat-login')
  @ApiOperation({ summary: '微信小程序静默登录' })
  @ApiBody({ schema: { properties: { code: { type: 'string' } } } })
  wechatLogin(@Body('code') code: string) {
    return this.auth.wechatLogin(code);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户信息 + 收藏列表' })
  profile(@Req() req: any) {
    return this.auth.getProfile(req.user.userId);
  }
}
