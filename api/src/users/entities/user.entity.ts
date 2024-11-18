import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "../../projects/entities/project.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  username: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column()
  password: string;

  @Column("jsonb", { nullable: true })
  settings: {
    numberOfTaskToShow?: number;
    projectOrder?: string;
    showDescription?: boolean;
    showEmptyTask?: boolean;
    showAllOpen?: boolean;
  };

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];
}
