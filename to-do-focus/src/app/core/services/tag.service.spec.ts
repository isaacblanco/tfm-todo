import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa el módulo de prueba para HttpClient
import { TestBed } from '@angular/core/testing';
import { TagService } from './tag.service';

describe('TagService', () => {
  let service: TagService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Añade HttpClientTestingModule
      ],
    });
    service = TestBed.inject(TagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
