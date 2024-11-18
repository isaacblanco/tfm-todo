import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Project } from "../../projects/entities/project.entity";
import { Tag } from "../../tags/entities/tag.entity";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ default: false })
  completed: boolean;

  @Column("timestamp", { nullable: true })
  dIni: Date;

  @Column("timestamp", { nullable: true })
  dFin: Date;

  @Column({ length: 50, nullable: true })
  tabs: string;

  @Column("text", { nullable: true })
  description: string;

  @Column({ type: "enum", enum: ["Low", "Normal", "High"], default: "Normal" })
  priority: string;

  @Column({
    type: "enum",
    enum: ["TO_DO", "IN_PROGRESS", "BLOCKED", "IN_REVIEW", "DONE"],
    default: "TO_DO",
  })
  status: string;

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: "CASCADE" })
  project: Project;

  // Relación muchos a muchos con Tag
  @ManyToMany(() => Tag, (tag) => tag.tasks)
  @JoinTable() // Necesario para crear la tabla intermedia
  tags: Tag[];
}
