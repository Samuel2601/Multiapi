import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'; // Relación con SocialNetwork
import { Role } from './Role';
import { SocialNetwork } from './SocialNetwork';

@Entity('users') // Nombre de la tabla en la base de datos
export class User {
  @PrimaryGeneratedColumn('uuid') // UUID como ID único
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false})
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastName: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  dni: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'boolean', default: false })
  verificado: boolean;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  // Relación con la tabla de roles (un usuario tiene un solo rol)
  @ManyToOne(() => Role, (role) => role.users, { nullable: false, eager: true })
  role: Role;

  @OneToMany(() => SocialNetwork, (socialNetwork) => socialNetwork.user, { cascade: true })
  redes: SocialNetwork[];

  @Column({ type: 'text', nullable: true })
  photo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  verificationCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordTemp: string;
}
