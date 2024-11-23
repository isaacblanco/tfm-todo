import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Project } from "../../projects/entities/project.entity";

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn()
  id_task: number; // Identificador único de la tarea

  @Column()
  fk_project: number; // ID del proyecto al que pertenece

  @Column({ length: 200 })
  task_name: string; // Nombre de la tarea (máx. 200 caracteres)

  @Column({ default: false })
  completed: boolean; // Estado de completado

  @Column("timestamp", { nullable: true })
  dini: Date; // Fecha de inicio (opcional)

  @Column("timestamp", { nullable: true })
  dfin: Date; // Fecha de fin (opcional)

  @Column()
  tabs: number; // Categoría o sección asociada (opcional)

  @Column("text", { nullable: true })
  description: string; // Descripción detallada (opcional)

  @Column()
  priority: number; // Nivel de prioridad (1 = Alta, 3 = Baja)

  @Column({
    type: "enum",
    enum: ["TO_DO", "IN_PROGRESS", "BLOCKED", "IN_REVIEW", "DONE"],
    default: "TO_DO",
  })
  status: string; // Estado de la tarea

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: "CASCADE" })
  @JoinColumn({ name: "fk_project" }) // Clave foránea explícita
  project: Project; // Relación con el proyecto asociado
}
