import { IsEmail, Length } from 'class-validator';
import { Entity, Column, Index } from 'typeorm';
import { BaseEntityAbstractModel } from './baseEntityAbstract.model';
import { Location } from '../../../../src/constants/locationConstants';

@Entity()
export class User extends BaseEntityAbstractModel {
  @Column({
    type: 'varchar',
    length: 500,
    nullable: false,
  })
  @IsEmail()
  @Index()
  email: string;

  @Column('text')
  name: string;

  @Column('text')
  phone: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  address: string;
  
  @Column('text')
  role: string;

  @Column({
    type: 'enum',
    enum: Location,
  })
  location: Location;
  
  @Column('text')
  @Length(2, 100)
  @IsEmail()
  createdBy: string;

  @Column('text')
  @Length(2, 100)
  @IsEmail()
  deletedBy: string;

  @Column('text')
  @Length(2, 100)
  @IsEmail()
  updatedBy: string;
}
