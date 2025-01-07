import { PartialType } from '@nestjs/swagger';
import { CreateGrainQualityTestDto } from './create-grain-quality-test.dto';

export class UpdateGrainQualityTestDto extends PartialType(CreateGrainQualityTestDto) {}
