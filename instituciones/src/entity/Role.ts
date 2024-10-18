import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable} from 'typeorm';
import {User} from './User';
import {Permission} from './Permission';

@Entity('roles')
export class Role {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({length: 50, unique: true})
	name: string;

	@Column({length: 20})
	access_scope: string;

	@Column({default: false})
	is_default: boolean;

	@OneToMany(() => User, (user) => user.role)
	users: User[];

	@ManyToMany(() => Permission, (permission) => permission.roles, {
		cascade: true,
		onDelete: 'CASCADE',
	})
	@JoinTable({
		name: 'role_permissions',
		joinColumn: {
			name: 'role_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'permission_id',
			referencedColumnName: 'id',
		},
	})
	permissions: Permission[];

	@CreateDateColumn({
		name: 'created_at',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	created_at: Date;

	@UpdateDateColumn({
		name: 'updated_at',
		type: 'timestamp',
		default: () => 'CURRENT_TIMESTAMP',
	})
	updated_at: Date;
}
