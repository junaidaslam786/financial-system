import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { JwtAuthGuard } from './../../common/guards/jwt-auth.guard';
import { RolesGuard } from './../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/interfaces/role.enum';

@ApiBearerAuth()
@ApiTags('Users') 
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) 
@Roles(Role.Owner, Role.Admin)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a user
   * Restricted to "admin" role as an example
   */
  @Roles('admin')
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  /**
   * Retrieve all users (for demonstration) 
   * Possibly restricted to "admin" only
   */
  @Roles('admin')
  @Get()
  async findAll(@Query('page') page: number, @Query('limit') limit: number) {
    // You can implement pagination in your service if needed
    return this.usersService.findAll();
  }

  /**
   * Retrieve a user by ID
   * Possibly restricted to "admin", or the user itself
   */
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findById(id);
  }

  /**
   * Update a user by ID (change email, username, role, etc.)
   * Typically "admin" role or the user themself if you add checks
   */
  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  /**
   * Delete a user 
   * Typically "admin" only
   */
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
