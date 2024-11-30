import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "../../projects/entities/project.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column({ length: 100 })
  username: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column()
  password: string;

  @Column("jsonb", { nullable: true })
  settings: {
    numberType?: boolean;
    numberOfTaskToShow?: number;
    projectOrder?: string;
    showDescription?: boolean;
    showEmptyTask?: boolean;
    showAllOpen?: boolean;
  };

  @OneToMany(() => Project, (project) => project.fk_user)
  projects: Project[];
}
