import { Role } from 'src/common/models/roles.model';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Profile } from '../profile/profile.entity';

@Entity({ name: 'users'})
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: '255', unique: true })
    email: string;

    @Column({ type: 'varchar', length: '255' })
    password: string;

    @Column({ default: [] })
    refreshToken: string[];

    @Column({ default: [] })
    recoveryToken: string[];

    @Column({ default: Role.NORMAL })
    role: Role

    @OneToOne(() => Profile, (profile) => profile.id)
    @JoinColumn({ name: 'profile_id'})
    profileId: Profile

    @CreateDateColumn({ name: 'create_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}