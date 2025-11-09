import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseDatabase } from './exercises';

describe('Exercises', () => {
  let component: ExerciseDatabase;
  let fixture: ComponentFixture<ExerciseDatabase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseDatabase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseDatabase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
