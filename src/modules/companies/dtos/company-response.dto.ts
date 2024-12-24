import { CompanyEntity } from '../entities/company.entity';

export class CompanyResponseDto {
  constructor(entity: CompanyEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.registrationNumber = entity.registrationNumber;
    // ... other fields
  }

  id: string;
  name: string;
  registrationNumber?: string;
  // ...
}
