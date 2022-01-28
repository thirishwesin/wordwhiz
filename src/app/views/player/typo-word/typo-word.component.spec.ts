import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypoWordComponent } from './typo-word.component';

describe('TypoWordComponent', () => {
  let component: TypoWordComponent;
  let fixture: ComponentFixture<TypoWordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypoWordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypoWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
