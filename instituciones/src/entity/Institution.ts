import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import {User} from './User';

@Entity()
export class Institution {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({length: 100})
	name: string;

	@Column({length: 200})
	address: string;

	@Column({length: 15})
	phone: string;

	@ManyToOne(() => User)
	@JoinColumn({name: 'id_user'})
	user: User;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
