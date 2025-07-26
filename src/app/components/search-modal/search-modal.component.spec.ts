import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchModalComponent } from './search-modal.component';
import { Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';

describe('SearchModalComponent', () => {
  let component: SearchModalComponent;
  let fixture: ComponentFixture<SearchModalComponent>;
  let renderer: Renderer2;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchModalComponent],
      imports: [FormsModule,  IonicModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchModalComponent);
    component = fixture.componentInstance;
    renderer = fixture.debugElement.injector.get(Renderer2);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should log initial inputs on ngOnInit', () => {
    const logSpy = jest.spyOn(console, 'log');
    component.departureCity = 'Paris';
    component.destinationCity = 'Rome';
    component.ngOnInit();
    expect(logSpy).toHaveBeenCalledWith('Départ:', 'Paris');
    expect(logSpy).toHaveBeenCalledWith('Destination:', 'Rome');
  });

  it('should add "active" class on ngAfterViewInit', fakeAsync(() => {
    const overlay = fixture.nativeElement.querySelector('.modal-overlay');
    const spy = jest.spyOn(renderer, 'addClass');
    component.ngAfterViewInit();
    tick(11);
    expect(spy).toHaveBeenCalledWith(overlay, 'active');
  }));

  it('should emit close after removing active class', fakeAsync(() => {
    const overlay = fixture.nativeElement.querySelector('.modal-overlay');
    const spy = jest.spyOn(renderer, 'removeClass');
    const emitSpy = jest.spyOn(component.close, 'emit');

    component.closeModal();
    expect(spy).toHaveBeenCalledWith(overlay, 'active');
    tick(301);
    expect(emitSpy).toHaveBeenCalled();
  }));

  it('should emit close on search()', fakeAsync(() => {
    const spy = jest.spyOn(component, 'closeModal');
    const logSpy = jest.spyOn(console, 'log');

    component.departureCity = 'Lyon';
    component.destinationCity = 'Tokyo';

    component.search();

    tick(301); 
    expect(logSpy).toHaveBeenCalledWith('Recherche de trajet de', 'Lyon', 'à', 'Tokyo');
    expect(spy).toHaveBeenCalled();
  }));
});
