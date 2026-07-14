import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
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

  private _signToken(userId: string, email: string): string {
    return this.jwt.sign({ sub: userId, email });
  }
}
