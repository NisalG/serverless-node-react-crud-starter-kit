import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntityAbstractModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  createdBy: string;
  @CreateDateColumn()
  createdAt;

  @Column('text')
  updatedBy: string;
  @UpdateDateColumn()
  updatedAt;

  @Column('text')
  deletedBy: string;
  @DeleteDateColumn()
  deletedAt;
}
