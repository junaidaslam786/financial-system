import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactEntity } from './entities/contact.entity';
import { CreateContactDto } from './dtos/create-contact.dto';
import { UpdateContactDto } from './dtos/update-contact.dto';
import { Company } from 'src/modules/companies/entities/company.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(ContactEntity)
    private readonly contactRepo: Repository<ContactEntity>,
  ) {}

  async create(dto: CreateContactDto): Promise<ContactEntity> {
    const contact = this.contactRepo.create({
      company: { id: dto.companyId } as Company,
      entityType: dto.entityType,
      entityId: dto.entityId,
      contactName: dto.contactName,
      phone: dto.phone,
      email: dto.email,
      address: dto.address,
      isPrimary: dto.isPrimary ?? false,
    });
    return this.contactRepo.save(contact);
  }

  async findAll(companyId: string): Promise<ContactEntity[]> {
    return this.contactRepo.find({
      where: { company: { id: companyId } },
      relations: ['company'],
    });
  }

  async findOne(id: string): Promise<ContactEntity> {
    const contact = await this.contactRepo.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact with ID "${id}" not found`);
    }
    return contact;
  }

  async update(id: string, dto: UpdateContactDto): Promise<ContactEntity> {
    const contact = await this.findOne(id);

    if (dto.entityType !== undefined) {
      contact.entityType = dto.entityType;
    }
    if (dto.entityId !== undefined) {
      contact.entityId = dto.entityId;
    }
    if (dto.contactName !== undefined) {
      contact.contactName = dto.contactName;
    }
    if (dto.phone !== undefined) {
      contact.phone = dto.phone;
    }
    if (dto.email !== undefined) {
      contact.email = dto.email;
    }
    if (dto.address !== undefined) {
      contact.address = dto.address;
    }
    if (dto.isPrimary !== undefined) {
      contact.isPrimary = dto.isPrimary;
    }

    return this.contactRepo.save(contact);
  }

  async remove(id: string): Promise<void> {
    const contact = await this.findOne(id);
    await this.contactRepo.remove(contact);
  }
}
