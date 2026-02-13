import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioTest } from './formulario-test';

describe('FormularioTest', () => {
  let component: FormularioTest;
  let fixture: ComponentFixture<FormularioTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioTest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
