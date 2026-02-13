import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaTest } from './tabla-test';

describe('TablaTest', () => {
  let component: TablaTest;
  let fixture: ComponentFixture<TablaTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaTest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
