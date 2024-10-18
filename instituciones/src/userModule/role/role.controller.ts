import {Body, Query, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe, Injectable} from '@nestjs/common';

import * as Dto from './role.dto';
import {RoleService} from './role.service';
import {FindByIdDto} from 'src/common/dto/id.dto';

@Controller('/roles')
@Injectable()
export class RoleController {
	constructor(
		private readonly rolesService: RoleService,
	) {}

	@Get()
	async getAllRoltefilter(@Query() query): Promise<any> {
		return await this.rolesService.findAllfilter(query);
	}

	@Get('/:id')
	@UsePipes(new ValidationPipe({transform: true}))
	async findById(@Param() params: FindByIdDto): Promise<any> {
		return await this.rolesService.findById(params.id);
	}

	@Post('')
	@UsePipes(new ValidationPipe({transform: true}))
	async create(@Body() rolDto: Dto.CreateRoleUserDto): Promise<any> {
		return await this.rolesService.createRole(rolDto);
	}

	@Put('/:id')
	@UsePipes(new ValidationPipe({transform: true}))
	async updateRole(@Param() params: FindByIdDto, @Body() rolDto: Dto.UpdateRoleUserDto): Promise<any> {
		return await this.rolesService.updateRole(params.id, rolDto);
	}

	@Delete('/:id')
	@UsePipes(new ValidationPipe({transform: true}))
	async deleteRole(@Param() params: FindByIdDto): Promise<any> {
		return await this.rolesService.deleteRole(params.id);
	}

	@Post('batch')
	@UsePipes(new ValidationPipe({transform: true}))
	async createBatch(@Body() rolDto: Dto.CreateRoleUserDto[]): Promise<any> {
		return await this.rolesService.createBatch(rolDto);
	}

	@Put('batch')
	@UsePipes(new ValidationPipe({transform: true}))
	async updateBatch(@Body() updateRoleUserDto: Dto.UpdateRoleUserDto[]): Promise<any> {
		return await this.rolesService.updateBatch(updateRoleUserDto);
	}
}
