import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity('social_networks') // Nombre de la tabla en la base de datos
export class SocialNetwork {
  @PrimaryGeneratedColumn('uuid') // UUID como ID único
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  provider: string; // Ejemplo: 'google', 'facebook', 'github'

  @Column({ type: 'varchar', length: 100, nullable: false })
  providerId: string; // ID del usuario en el proveedor

  @Column({ type: 'varchar', length: 255, nullable: true })
  profileUrl: string; // URL de perfil del usuario en esa red social

  @ManyToOne(() => User, (user) => user.redes, { onDelete: 'CASCADE' })
  user: User; // Relación con la entidad User
}
