import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';

@Entity()
export class Permission {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({length: 50})
	name: string;

	@Column({length: 50})
	method: string;

	@Column('uuid', {array: true, default: () => 'ARRAY[]::uuid[]'})
	users: string[];

	@Column({default: false})
	is_default: boolean;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
