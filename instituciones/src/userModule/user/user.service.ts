import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateUserDto, UpdateUserDto} from './user.dto';
import * as bcrypt from 'bcrypt';
import {apiResponse} from 'src/common/helpers/apiResponse';
import {RoleService} from '../role/role.service';
import {EmailService} from 'src/common/email/email.service';
import {User} from 'src/entity/User.entity';
import {Role} from 'src/entity/Role.entity';

/**
 * Esta clase maneja las operaciones CRUD para los usuarios en PostgreSQL.
 */
@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
		private readonly roleService: RoleService,
		private readonly emailService: EmailService,
	) {}

	/**
	 * Devuelve una lista de todos los usuarios en la base de datos.
	 * @returns Promesa que resuelve con una lista de usuarios.
	 */
	async findAllfilter(params: any, relations: string[] = []): Promise<any> {
		try {
			const data = await this.userRepository.find({
				where: params,
				order: {created_at: 'DESC'},
				relations,
			});
			return apiResponse(200, 'Usuarios obtenidos con éxito.', data, null);
		} catch (error) {
			console.error(error);
			return apiResponse(500, 'ERROR', null, error);
		}
	}

	/**
	 * Encuentra un usuario por su ID.
	 * @param id ID del usuario a buscar.
	 * @returns Promesa que resuelve con el usuario encontrado o null si no existe.
	 */
	async findById(id: string): Promise<any> {
		try {
			const user = await this.userRepository.findOne({
				where: {id},
				relations: ['role'], // Relacionar con roles
			});
			if (!user) {
				return apiResponse(404, 'Usuario no encontrado', null, null);
			}
			return apiResponse(200, 'Usuario obtenido con éxito.', user, null);
		} catch (error) {
			console.error(error);
			return apiResponse(500, 'ERROR', null, error);
		}
	}

	/**
	 * Crea un nuevo usuario en la base de datos.
	 * La contraseña se cifra utilizando bcrypt.
	 * @param data DTO que contiene los datos para crear un nuevo usuario.
	 * @returns Promesa que resuelve con el nuevo usuario creado.
	 */
	async createUser(data: CreateUserDto): Promise<any> {
		try {
			if (data.password) {
				data.password = await bcrypt.hash(data.password, 10); // Hash de la contraseña
			}

			if (!data.role) {
				const defaultRole = await this.roleService.getDefaultRole();
				if (defaultRole) {
					data.role = {id: defaultRole.id} as Role; // Asigna el ID del rol por defecto al usuario
				} else {
					return apiResponse(400, 'No se encontró un rol por defecto.', null, null);
				}
			}

			const newUser = this.userRepository.create(data);
			const user = await this.userRepository.save(newUser);

			if (user) {
				// Asegúrate de que el usuario fue creado antes de enviar el correo
				this.emailService
					.sendNotification(user.email, 'Nuevo usuario registrado', 'src/emailTemplates/welcome.html', {
						name: user.name,
						last_name: user.last_name,
						email: user.email,
					})
					.catch((error) => {
						console.error(`Error enviando correo a ${user.email}:`, error);
					});
			}

			return apiResponse(201, 'Usuario creado con éxito.', user, null);
		} catch (error) {
			console.error(error);
			const errorMessage = error.code === '23505' ? 'El usuario ya existe.' : 'Error al crear el usuario.';
			return apiResponse(500, errorMessage, null, error);
		}
	}

	/**
	 * Actualiza un usuario por su ID.
	 * @param id ID del usuario a actualizar.
	 * @param updateUserDto DTO con los datos de actualización.
	 * @returns Promesa que resuelve con el usuario actualizado o null si no se encuentra.
	 */
	async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<any> {
		try {
			const user = await this.userRepository.findOne({where: {id}, relations: ['role']});

			if (!user) {
				return apiResponse(404, 'Usuario no encontrado', null, null);
			}

			await this.userRepository.update(id, updateUserDto);
			const updatedUser = await this.userRepository.findOne({where: {id}, relations: ['role']});

			if (user.role.id === updatedUser.role.id) {
				this.emailService.sendNotification(user.email, 'Actualización de Información', 'src/emailTemplates/updateAccount.html', {
					userName: updatedUser.name,
					updatedFields: updateUserDto,
				});
			} else {
				const role = await this.roleRepository.findOne({where: {id: updatedUser.role.id}});
				this.emailService.sendNotification(user.email, 'Cambio de Rol', 'src/emailTemplates/role_change_notification.html', {
					userName: updatedUser.name,
					newRole: role.name,
					permissions: role.permissions,
				});
			}

			return apiResponse(200, 'Usuario actualizado con éxito.', updatedUser, null);
		} catch (error) {
			console.error(error);
			return apiResponse(500, 'ERROR', null, error);
		}
	}

	/**
	 * Elimina un usuario por su ID.
	 * @param id ID del usuario a eliminar.
	 * @returns Promesa que resuelve con true si el usuario fue eliminado, o false si no se encontró.
	 */
	async deleteUser(id: string): Promise<any> {
		try {
			const deletedUser = await this.userRepository.findOne({where: {id}});
			if (!deletedUser) {
				return apiResponse(404, 'Usuario no encontrado', null, null);
			}

			await this.userRepository.delete(id);

			this.emailService.sendNotification(deletedUser.email, 'Eliminación de Cuenta', 'src/emailTemplates/deleteAccount.html', {
				name: deletedUser.name,
				last_name: deletedUser.last_name,
				deleteDate: deletedUser.created_at,
				accountId: deletedUser.id,
				supportUrl: 'https://esmeraldas.gob.ec/contacto',
				currentYear: new Date().getFullYear(),
				serviceName: 'Esmeraldas la Bella',
				email: deletedUser.email,
			});

			return apiResponse(200, 'Usuario eliminado con éxito.', deletedUser, null);
		} catch (error) {
			console.error(error);
			return apiResponse(500, 'ERROR', null, error);
		}
	}

	async createBatch(createUsersDto: CreateUserDto[]) {
		const createdUsers = [];
		const errors = [];

		for (const userDto of createUsersDto) {
			try {
				const createdUser = this.userRepository.create(userDto);
				await this.userRepository.save(createdUser);
				createdUsers.push(createdUser);

				this.emailService.sendNotification(createdUser.email, 'Nuevo usuario registrado', 'src/emailTemplates/welcome.html', {
					name: createdUser.name,
					last_name: createdUser.last_name,
					email: createdUser.email,
				});
			} catch (error) {
				if (error.code === '23505') {
					errors.push({
						user: userDto,
						message: 'Usuario ya existente',
					});
				} else {
					errors.push({
						user: userDto,
						message: error.message,
					});
				}
			}
		}

		return apiResponse(
			errors.length > 0 ? 207 : 201,
			errors.length > 0 ? 'Hubieron algunos errores al crear los usuarios.' : 'Creación de usuarios exitosa.',
			createdUsers,
			errors,
		);
	}

	async updateBatch(updateUsersDto: UpdateUserDto[]): Promise<any> {
		const updatedUsers = [];
		const errors = [];

		for (const dtoUser of updateUsersDto) {
			try {
				const user = await this.userRepository.findOne({where: {id: dtoUser.id}});
				if (!user) {
					errors.push({
						id: dtoUser.id,
						message: `Usuario con ID ${dtoUser.id} no encontrado`,
					});
					continue;
				}

				await this.userRepository.update(dtoUser.id, dtoUser);
				const updatedUser = await this.userRepository.findOne({where: {id: dtoUser.id}});
				updatedUsers.push(updatedUser);
			} catch (error) {
				errors.push({
					id: dtoUser.id,
					message: error.message,
				});
			}
		}

		return apiResponse(
			errors.length > 0 ? 207 : 200,
			errors.length > 0 ? 'Algunos usuarios no pudieron ser actualizados.' : 'Actualización de usuarios exitosa.',
			updatedUsers,
			errors,
		);
	}
}
