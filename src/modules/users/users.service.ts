import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly rolesService: RolesService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    let role = null;
    if (createUserDto.roleId) {
      // fetch role if needed
      role = await this.rolesService.findById(createUserDto.roleId);
    }
  
    // Create a single user object
    const user = this.userRepository.create({
      ...createUserDto,
      role: role ?? undefined,
    });
  
    // Save and return the single created entity
    return this.userRepository.save(user);
  }

  async findAll() {
    return this.userRepository.find({ relations: ['role'] });
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
  async saveUser(user: UserEntity) {
    return this.userRepository.save(user);
  }
}
