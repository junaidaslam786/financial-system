import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    let role = null;
    if (createUserDto.roleId) {
      // Fetch the role if needed.
      role = await this.rolesService.findById(createUserDto.roleId);
    }

    // Hash the plain-text password from the DTO.
    // Assumes createUserDto contains a "password" field.
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create a new user object.
    // Spread the DTO and override the password field by using the hashed version.
    const user = this.userRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      // Store the hashed password on the entity.
      passwordHash: hashedPassword,
      role: role ?? undefined,
      twoFactorEnabled: createUserDto.twoFactorEnabled,
      twoFactorAuthenticationSecret: createUserDto.twoFactorAuthenticationSecret,
    });

    // Save and return the newly created user.
    return this.userRepository.save(user);
  }

  async findAll(companyId: string): Promise<User[]> {
    return this.userRepository.find({
      where: { defaultCompanyId: companyId },
      relations: ['role'],
    });
  }

  async findByIdWithRolePermissions(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'role', // Ensure the role is loaded
        'role.rolePermissions', // Load role permissions
        'role.rolePermissions.permission', // Load actual permissions
      ],
    });
  
  
    return user;
  }
  
  

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: ['role'],
    });
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);
    if (updateUserDto.roleId) {
      user.role = await this.rolesService.findById(updateUserDto.roleId);
    }
    // Merge changes
    Object.assign(user, {
      username: updateUserDto.username ?? user.username,
      email: updateUserDto.email ?? user.email,
      twoFactorEnabled:
        updateUserDto.twoFactorEnabled !== undefined
          ? updateUserDto.twoFactorEnabled
          : user.twoFactorEnabled,
    });
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.findById(id);
    return this.userRepository.remove(user);
  }

  /**
   * Helper to update a user directly
   */
  async saveUser(user: User) {
    return this.userRepository.save(user);
  }
}
