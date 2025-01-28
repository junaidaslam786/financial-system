import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { ContactEntity } from './entities/contact.entity';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity]), UsersModule],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
