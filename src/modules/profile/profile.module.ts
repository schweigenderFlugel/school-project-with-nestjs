import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Profile } from './profile.entity';
import { ProfileRepository } from './profile.repository';


@Module({
    imports: [CloudinaryModule, TypeOrmModule.forFeature([Profile])],
    controllers: [ProfileController],
    providers: [ProfileService, ProfileRepository],
    exports: [ProfileService]
})
export class ProfileModule {}