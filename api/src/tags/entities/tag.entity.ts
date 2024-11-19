import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("tags")
export class Tag {
  @PrimaryGeneratedColumn()
  id_tag: number;

  @Column({ length: 50 })
  tag_name: string;

  @Column()
  fk_user: number;

  /*
  @ManyToMany(() => Task, (task) => task.tags)
  tasks: Task[];
  */
}
