import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/models/roles.model';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ChangeRoleDto } from './users.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'change the role of the user' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async changeUserRole(@Param('id', ParseIntPipe) id: number, @Body() role: ChangeRoleDto) {
    return this.usersService.changeRole(id, role.role);
  }
}
