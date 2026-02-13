import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialTest } from './historial-test';

describe('HistorialTest', () => {
  let component: HistorialTest;
  let fixture: ComponentFixture<HistorialTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialTest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
