import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dtos/register.dto';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { User as User } from '../users/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RolesService } from '../roles/roles.service';
import { CompaniesService } from '../companies/companies.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly companiesService: CompaniesService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validate user’s credentials when using LocalStrategy
   */
  async validateUser(email: string, plainPassword: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const passwordMatched = await bcrypt.compare(plainPassword, user.passwordHash);
    if (!passwordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  /**
   * Return a signed JWT after successful local login
   */
  async login(user: User) {
    // Generate short-lived access token and a long-lived refresh token
    const { accessToken, refreshToken } = await this.generateTokens(user);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role?.roleName,   // or just user.role
        twoFactorEnabled: user.twoFactorEnabled,
      },
    };
  }

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto) {
    // 1) Check if email or username exist
    const existingByEmail = await this.usersService.findByEmail(registerDto.email);
    if (existingByEmail) {
      throw new BadRequestException('Email already registered');
    }
    const existingByUsername = await this.usersService.findByUsername(registerDto.username);
    if (existingByUsername) {
      throw new BadRequestException('Username already taken');
    }

    // 2) Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // 3) Force the role to 'owner' (or find the role from DB)
    const ownerRole = await this.rolesService.findByName('owner');
    if (!ownerRole) {
      throw new ForbiddenException('Cannot register user, "owner" role not found');
    }

    // 4) Create user
    const createdUser = await this.usersService.createUser({
      username: registerDto.username,
      email: registerDto.email,
      passwordHash: hashedPassword,
      roleId: ownerRole.id, // assign 'owner' role
    });

    // 5) Create a default company for that user
    await this.companiesService.createDefaultCompanyForUser(createdUser.id);

    return {
      message: 'Registration successful',
      userId: createdUser.id,
      email: createdUser.email,
    };
  }

  /**
   * Toggle 2FA (just a sample demonstration)
   */
  async toggleTwoFactor(userId: string) {
    const user = await this.usersService.findById(userId);
    user.twoFactorEnabled = !user.twoFactorEnabled;
    await this.usersService.saveUser(user);
    return {
      message: `Two-factor authentication is now ${
        user.twoFactorEnabled ? 'enabled' : 'disabled'
      }.`,
    };
  }

  /**
   * Generate both access and refresh tokens
   */
  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.signToken(user, '1h');  // e.g. 1 hour
    const refreshToken = await this.signToken(user, '7d'); // e.g. 7 days
    return { accessToken, refreshToken };
  }

  /**
   * Sign a token (access or refresh) with configurable expiry
   */
  private async signToken(user: User, expiresIn: string): Promise<string> {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role?.roleName, 
    };
    return this.jwtService.sign(payload, { expiresIn });
  }

  /**
   * Verify the refresh token and return the associated user
   */
  async verifyRefreshToken(refreshToken: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(refreshToken) as JwtPayload;
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token: user not found');
      }
      return user;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Generate a two-factor authentication secret and store it in the user record
   */
  generateTwoFactorAuthenticationSecret(user: User) {
    const secret = speakeasy.generateSecret({
      name: `YourAppName (${user.email})`,
    });

    user.twoFactorAuthenticationSecret = secret.base32;
    // Persist the new secret in DB
    this.usersService.updateUser(user.id, {
      twoFactorAuthenticationSecret: secret.base32,
    });

    return {
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url,
    };
  }

  /**
   * Stream QR code for 2FA
   */
  async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return qrcode.toFileStream(stream, otpauthUrl);
  }

  /**
   * Validate a TOTP code against the stored user secret
   */
  isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
    return speakeasy.totp.verify({
      secret: user.twoFactorAuthenticationSecret,
      encoding: 'base32',
      token: twoFactorAuthenticationCode,
    });
  }

  
}
