import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userNum: number;

    @Column()
    userId: string;

    @Column()
    userPw: string;

    @Column()
    userName: string;

    @Column()
    userRegdate: string;
}
