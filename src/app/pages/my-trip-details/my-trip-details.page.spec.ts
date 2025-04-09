import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyTripDetailsPage } from './my-trip-details.page';

describe('MyTripDetailsPage', () => {
  let component: MyTripDetailsPage;
  let fixture: ComponentFixture<MyTripDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTripDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
