import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEntity } from './entities/role.entity';
import { CreateRoleDto, UpdateRoleDto } from './dtos';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async createRole(dto: CreateRoleDto) {
    const role = this.roleRepository.create(dto);
    return this.roleRepository.save(role);
  }

  async findAll() {
    return this.roleRepository.find();
  }

  async findById(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['users', 'rolePermissions'],
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async findByName(roleName: string) {
    return this.roleRepository.findOne({ where: { roleName } });
  }

  async updateRole(id: string, dto: UpdateRoleDto) {
    const role = await this.findById(id);
    Object.assign(role, dto);
    return this.roleRepository.save(role);
  }

  async remove(id: string) {
    const role = await this.findById(id);
    return this.roleRepository.remove(role);
  }
}
