import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OneThirdScreenComponent } from "./oneThirdScreen.component";

describe("OneThirdScreen", () => {
  let component: OneThirdScreenComponent;
  let fixture: ComponentFixture<OneThirdScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OneThirdScreenComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneThirdScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
