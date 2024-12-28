import { Company } from '../entities/company.entity';

export class CompanyResponseDto {
  constructor(entity: Company) {
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
