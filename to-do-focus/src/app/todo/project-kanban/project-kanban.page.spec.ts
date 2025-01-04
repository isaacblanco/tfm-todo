import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectKanbanPage } from './project-kanban.page';

describe('ProjectKanbanPage', () => {
  let component: ProjectKanbanPage;
  let fixture: ComponentFixture<ProjectKanbanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectKanbanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
