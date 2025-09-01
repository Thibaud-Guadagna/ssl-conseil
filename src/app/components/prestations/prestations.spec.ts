import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prestations } from './prestations';

describe('Prestations', () => {
  let component: Prestations;
  let fixture: ComponentFixture<Prestations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prestations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prestations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
