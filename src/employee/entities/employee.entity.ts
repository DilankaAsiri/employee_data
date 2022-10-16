import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum EmployeeStatus {
    "ACTIVE" = "ACTIVE",
    "DELETED" = "DELETED"
}

@Entity()
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 150 })
    name: string;

    @Column({ type: 'varchar', length: 75 })
    email: string;

    @Column({ type: 'enum', enum: EmployeeStatus, default: EmployeeStatus.ACTIVE })
    status: EmployeeStatus

    @Column({type: 'json', nullable: true, select: false})
    profilePicture: any;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
