import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { LogementFormComponent } from './logement-form.component';
import { Logement } from 'src/app/models/logement.model';

describe('LogementFormComponent', () => {
  let component: LogementFormComponent;
  let fixture: ComponentFixture<LogementFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LogementFormComponent, IonicModule.forRoot(), ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LogementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with one empty logement by default', () => {
    expect(component.logements.length).toBe(1);
    expect(component.form.value).toEqual({
      logements: [{
        nom: '',
        adress: ''
      }]
    });
  });

  it('should initialize form with existingLogements values', () => {
    const logements: Logement[] = [
      { nom: 'Hotel Test', adress: '123 rue Test', voyageId: '' },
      { nom: 'Hotel Deux', adress: '456 rue Deux', voyageId: '' }
    ];
    component.existingLogements = logements;
    component.ngOnInit();
    expect(component.logements.length).toBe(2);
    expect(component.form.value.logements[0]).toEqual({
      nom: 'Hotel Test',
      adress: '123 rue Test'
    });
    expect(component.form.value.logements[1]).toEqual({
      nom: 'Hotel Deux',
      adress: '456 rue Deux'
    });
  });

  it('should add a new logement block when addLogement is called', () => {
    const initialLength = component.logements.length;
    component.addLogement();
    expect(component.logements.length).toBe(initialLength + 1);
  });

  it('should remove a logement block when removeLogement is called', () => {
    component.addLogement();
    const initialLength = component.logements.length;
    component.removeLogement(0);
    expect(component.logements.length).toBe(initialLength - 1);
  });

  it('should emit formSubmitted with all logements on submit if form is valid', () => {
    jest.spyOn(component.formSubmitted, 'emit');
    component.logements.at(0).patchValue({
      nom: 'Hotel ABC',
      adress: '1 rue de Paris'
    });
    component.addLogement({
      nom: 'Hotel DEF',
      adress: '2 rue DEF'
    });
    component.logements.at(1).patchValue({
      nom: 'Hotel DEF',
      adress: '2 rue DEF'
    });
    component.submit();
    expect(component.formSubmitted.emit).toHaveBeenCalledWith(component.form.value.logements);
    expect(component.form.value.logements.length).toBe(2);
  });
});
