import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Role } from '../../common/models/roles.model';
import { Profile } from '../profile/profile.entity';

@Entity({ name: 'users'})
export class Users {
    constructor(refreshToken: string[], id: number) {
        this.id = id;
        this.refreshToken = refreshToken;
    }
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: '255', unique: true })
    email: string;

    @Column({ type: 'varchar', length: '255' })
    password: string;

    @Column({ type: 'json', nullable: true, default: '[]' })
    refreshToken: string[];

    @Column({ type: 'json', nullable: true, default: '[]' })
    recoveryToken: string[];

    @Column({ default: Role.NORMAL })
    role: string

    @OneToOne(() => Profile, (profile) => profile.id)
    @JoinColumn({ name: 'profile_id'})
    profile: Profile

    @CreateDateColumn({ name: 'create_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    
}