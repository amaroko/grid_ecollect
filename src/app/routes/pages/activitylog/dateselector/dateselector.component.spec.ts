import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateselectorComponent } from './dateselector.component';

describe('DateselectorComponent', () => {
  let component: DateselectorComponent;
  let fixture: ComponentFixture<DateselectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateselectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
