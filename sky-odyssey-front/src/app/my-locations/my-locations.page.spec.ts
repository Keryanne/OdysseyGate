import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyLocationsPage } from './my-locations.page';

describe('MyLocationsPage', () => {
  let component: MyLocationsPage;
  let fixture: ComponentFixture<MyLocationsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyLocationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
