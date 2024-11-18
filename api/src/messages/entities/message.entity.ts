import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  title: string;

  @Column('text')
  description: string;
}
