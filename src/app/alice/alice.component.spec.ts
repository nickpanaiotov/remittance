import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AliceComponent } from './alice.component';

describe('AliceComponent', () => {
  let component: AliceComponent;
  let fixture: ComponentFixture<AliceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AliceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AliceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
