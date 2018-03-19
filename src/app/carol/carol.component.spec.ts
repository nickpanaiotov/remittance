import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarolComponent } from './carol.component';

describe('CarolComponent', () => {
  let component: CarolComponent;
  let fixture: ComponentFixture<CarolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
