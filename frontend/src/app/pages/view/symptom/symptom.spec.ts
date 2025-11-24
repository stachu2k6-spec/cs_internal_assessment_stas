import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Symptom } from './symptom';

describe('Symptom', () => {
  let component: Symptom;
  let fixture: ComponentFixture<Symptom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Symptom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Symptom);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
