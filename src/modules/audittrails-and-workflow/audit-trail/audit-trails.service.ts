import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditTrail } from './entities/audit-trail.entity';
import { CreateAuditTrailDto } from './dtos/create-audit-trail.dto';
import { UpdateAuditTrailDto } from './dtos/update-audit-trail.dto';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AuditTrailsService {
  constructor(
    @InjectRepository(AuditTrail)
    private readonly auditRepo: Repository<AuditTrail>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateAuditTrailDto): Promise<AuditTrail> {
    let user: User | undefined;
    if (dto.userId) {
      user = await this.userRepo.findOne({ where: { id: dto.userId } });
      if (!user) {
        throw new BadRequestException('Invalid userId.');
      }
    }

    const audit = this.auditRepo.create({
      user,
      action: dto.action,
      entityName: dto.entityName,
      entityId: dto.entityId,
      actionTimestamp: dto.actionTimestamp ? new Date(dto.actionTimestamp) : undefined,
      ipAddress: dto.ipAddress,
      details: dto.details ? JSON.parse(dto.details) : undefined,
    });

    return this.auditRepo.save(audit);
  }

  async findAll(): Promise<AuditTrail[]> {
    return this.auditRepo.find({
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<AuditTrail> {
    const trail = await this.auditRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!trail) {
      throw new NotFoundException(`AuditTrail with id "${id}" not found.`);
    }
    return trail;
  }

  async update(id: string, dto: UpdateAuditTrailDto): Promise<AuditTrail> {
    const trail = await this.findOne(id);

    if (dto.userId) {
      const user = await this.userRepo.findOne({ where: { id: dto.userId } });
      if (!user) {
        throw new BadRequestException('Invalid userId.');
      }
      trail.user = user;
    } else if (dto.userId === null) {
      trail.user = undefined;
    }

    if (dto.action !== undefined) trail.action = dto.action;
    if (dto.entityName !== undefined) trail.entityName = dto.entityName;
    if (dto.entityId !== undefined) trail.entityId = dto.entityId;
    if (dto.actionTimestamp) {
      trail.actionTimestamp = new Date(dto.actionTimestamp);
    }
    if (dto.ipAddress !== undefined) trail.ipAddress = dto.ipAddress;
    if (dto.details !== undefined) {
      trail.details = JSON.parse(dto.details);
    }

    return this.auditRepo.save(trail);
  }

  async remove(id: string): Promise<void> {
    const trail = await this.findOne(id);
    await this.auditRepo.remove(trail);
  }
}
