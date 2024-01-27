import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileUploadValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const size = 5000000;
    const format = 'image/jpeg';
    if (value.size > size) {
      throw new BadRequestException('the file is too big');
    } else if (value.mimetype !== format) {
      throw new BadRequestException('the file format is not compatible');
    }
    return value;
  }
}
