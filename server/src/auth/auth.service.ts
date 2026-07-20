import { Injectable, ConflictException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('该邮箱已被注册');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name || dto.email.split('@')[0],
        password: hashedPassword,
      },
    });

    return {
      user: { id: user.id, email: user.email, name: user.name },
      token: this._signToken(user.id, user.email),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    return {
      user: { id: user.id, email: user.email, name: user.name },
      token: this._signToken(user.id, user.email),
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        favorites: {
          orderBy: { sortOrder: 'asc' },
          select: { toolId: true, sortOrder: true },
        },
      },
    });
    if (!user) throw new UnauthorizedException('用户不存在');
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      favorites: user.favorites.map((f) => f.toolId),
    };
  }

  async wechatLogin(code: string) {
    const appid = this.config.get<string>('WECHAT_APPID');
    const secret = this.config.get<string>('WECHAT_SECRET');
    if (!appid || !secret) {
      throw new InternalServerErrorException('微信登录未配置');
    }

    // 用 code 向微信服务器换 openid
    const wxRes = await fetch(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,
    );
    const wxData = await wxRes.json() as any;

    if (wxData.errcode) {
      throw new UnauthorizedException(`微信登录失败: ${wxData.errmsg}`);
    }

    const openid = wxData.openid as string;

    // 查找或创建用户
    let user = await this.prisma.user.findUnique({ where: { email: `wx_${openid}@toolbox.app` } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: `wx_${openid}@toolbox.app`,
          name: '微信用户',
          password: '',
        },
      });
    }

    return {
      user: { id: user.id, email: user.email, name: user.name },
      token: this._signToken(user.id, user.email),
    };
  }

  private _signToken(userId: string, email: string): string {
    return this.jwt.sign({ sub: userId, email });
  }
}
