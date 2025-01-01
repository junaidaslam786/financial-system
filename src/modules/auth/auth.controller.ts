import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    Get,
    Patch,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { LoginDto } from './dtos/login.dto';
  import { RegisterDto } from './dtos/register.dto';
  import { LocalAuthGuard } from './../../common/guards/local-auth.guard';
  import { JwtAuthGuard } from './../../common/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
  
  @ApiTags('Auth')
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    /**
     * Public endpoint - LocalAuthGuard executes local strategy
     */
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req, @Body() _loginDto: LoginDto) {
      // After validation, local strategy attaches user to req.user
      return this.authService.login(req.user);
    }
  
    /**
     * Public endpoint - user registration
     */
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
      return this.authService.register(registerDto);
    }
  
    /**
     * Protected endpoint - verifies your token is valid
     */
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
      return req.user;
    }
  
    /**
     * Example of how you could enable/disable 2FA
     * For brevity, 2FA logic is not implemented - just toggled
     */
    @UseGuards(JwtAuthGuard)
    @Patch('2fa')
    async toggle2FA(@Request() req) {
      const user = req.user;
      if (!user) throw new UnauthorizedException('Invalid user context');
      return this.authService.toggleTwoFactor(user.id);
    }
  }
  