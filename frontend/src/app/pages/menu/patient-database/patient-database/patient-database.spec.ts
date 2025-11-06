import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDatabase } from './patient-database';

describe('PatientDatabase', () => {
  let component: PatientDatabase;
  let fixture: ComponentFixture<PatientDatabase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientDatabase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientDatabase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
