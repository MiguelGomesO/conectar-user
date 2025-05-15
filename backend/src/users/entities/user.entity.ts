 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,} from 'typeorm';
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    password: string;
  
    @Column({ type: 'varchar', default: 'USER' })
    role: string;

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    lastLogin: Date | null;

    @Column({ nullable: true })
    avatar: string;

  }
  