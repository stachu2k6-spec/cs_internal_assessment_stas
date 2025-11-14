import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymptomView } from './symptom-view';

describe('SymptomView', () => {
  let component: SymptomView;
  let fixture: ComponentFixture<SymptomView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SymptomView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SymptomView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
