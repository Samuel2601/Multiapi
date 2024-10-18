import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany} from 'typeorm';
import { User } from './User';

@Entity()
export class Role {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({length: 50, unique: true})
	name: string;

	@Column('uuid', {array: true, default: () => 'ARRAY[]::uuid[]'})
	permissions: string[];

	@Column({length: 20})
	access_scope: string;

	@Column({default: false})
	is_default: boolean;

	// Relación con la tabla de usuarios (un rol puede tener múltiples usuarios)
	@OneToMany(() => User, (user) => user.role)
	users: User[];

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
