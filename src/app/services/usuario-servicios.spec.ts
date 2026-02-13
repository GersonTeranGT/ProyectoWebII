import { TestBed } from '@angular/core/testing';

import { UsuarioServicios } from './usuario-servicios';

describe('UsuarioServicios', () => {
  let service: UsuarioServicios;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioServicios);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
