import { Entity, Column } from 'typeorm';
import { BaseEntityAbstractModel } from './baseEntityAbstract.model';

@Entity()
export class Item extends BaseEntityAbstractModel {
  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('double')
  price: number;
}
