import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectTimelinePage } from './project-timeline.page';

describe('ProjectTimelinePage', () => {
  let component: ProjectTimelinePage;
  let fixture: ComponentFixture<ProjectTimelinePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTimelinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
