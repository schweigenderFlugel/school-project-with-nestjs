import { Controller, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/models/roles.model';
import { RolesGuard } from '../../common/guards/roles.guard';


@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'list of users' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getUsers() {
    return this.usersService.getUsers();
  }

  @Get('/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.usersService.getUserByEmail(email)
  }

  @ApiOperation({ summary: 'update the user information' })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() changes: any) {
    return this.usersService.updateUser(id, changes);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    this.usersService.deleteUser(id)
  }
}