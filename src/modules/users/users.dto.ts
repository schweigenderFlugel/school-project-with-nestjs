import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { RoleTypes } from "src/common/models/roles.model";

export class ChangeRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  role: RoleTypes;
}