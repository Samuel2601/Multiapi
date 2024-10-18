import {
	Body,
	Query,
	Controller,
	Delete,
	Request,
	Get,
	Param,
	Post,
	NotFoundException,
	UnauthorizedException,
	Put,
	UsePipes,
	ValidationPipe,
	UseInterceptors,
	UploadedFile,
} from '@nestjs/common';
import {UserService} from './user.service';
import {CreateUserDto, UpdateUserDto} from './user.dto';
import {FindByIdDto } from 'src/common/dto/id.dto';
import {FileInterceptor} from '@nestjs/platform-express';
import {UploadsService} from 'src/common/uploads/uploads.service';

@Controller('/users')
export class UserController {
	constructor(
		private readonly usersService: UserService,
	) {}

	// Obtener un usuario por su ID (GET /users/:id)
	@Get('/:id')
	@UsePipes(new ValidationPipe({transform: true}))
	async findById(@Param() params: FindByIdDto): Promise<any> {
		return await this.usersService.findById(params.id);
	}

	// Obtener todos los usuarios (GET /users)
	@Get()
	async getAllUsersfilter(@Query() query) {
		return this.usersService.findAllfilter(query);
	}

	// Crear un nuevo usuario (POST /users)
	@Post()
	@UsePipes(new ValidationPipe({transform: true}))
	@UseInterceptors(FileInterceptor('photo', UploadsService.configureMulter(5 * 1024 * 1024, 'users'))) //uso del fileinterceptor para subir el archivo
	async createUser(@Body() userDto: CreateUserDto, @UploadedFile() file: Express.Multer.File): Promise<any> {
		if (file) {
			userDto.photo = file.filename;
		}
		return await this.usersService.createUser(userDto);
	}

	// Actualizar un usuario (PUT /users/:id)
	@Put('/:id')
	@UsePipes(new ValidationPipe({transform: true}))
	async updateUser(@Param() params: FindByIdDto, @Body() updateUserDto: UpdateUserDto): Promise<any> {
		return await this.usersService.updateUser(params.id, updateUserDto);
	}

	// Eliminar un usuario (DELETE /users/:id)
	@Delete('/:id')
	@UsePipes(new ValidationPipe({transform: true}))
	async deleteUser(@Param() params: FindByIdDto): Promise<any> {
		return await this.usersService.deleteUser(params.id);
	}

	@Post('batch')
	@UsePipes(new ValidationPipe({transform: true}))
	async createBatch(@Body() createUsersDto: CreateUserDto[]): Promise<any> {
		return await this.usersService.createBatch(createUsersDto);
	}

	@Put('batch')
	@UsePipes(new ValidationPipe({transform: true}))
	async updateBatch(@Body() updateUsersDto: UpdateUserDto[]): Promise<any> {
		return await this.usersService.updateBatch(updateUsersDto);
	}
}
