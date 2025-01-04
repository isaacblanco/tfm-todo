import { TestBed } from '@angular/core/testing';

import { ProjectUtilsService } from './project-utils.service';

describe('ProjectUtilsService', () => {
  let service: ProjectUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
