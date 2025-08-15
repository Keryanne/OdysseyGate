import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TripLogementListComponent } from './trip-logement-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TripsService } from 'src/app/services/trips.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Logement } from 'src/app/models/logement.model';

describe('TripLogementListComponent', () => {
  let component: TripLogementListComponent;
  let fixture: ComponentFixture<TripLogementListComponent>;
  let tripsService: TripsService;

  const mockLogement: Logement = {
    id: 1,
    nom: 'Hôtel Paradis',
    adresse: '10 Avenue de la Plage, Nice',
    voyageId: 1
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TripLogementListComponent],
      imports: [HttpClientTestingModule, NoopAnimationsModule],
      providers: [TripsService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TripLogementListComponent);
    component = fixture.componentInstance;
    tripsService = TestBed.inject(TripsService);
    component.tripId = 1;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load logements from TripsService on init', () => {
    const mockLogements = [mockLogement];
    jest.spyOn(tripsService, 'getLogementsByVoyage').mockReturnValue(of(mockLogements));
    
    component.ngOnInit();
    
    expect(component.logements).toEqual(mockLogements);
    expect(tripsService.getLogementsByVoyage).toHaveBeenCalledWith(1);
  });

  it('should handle error when loading logements', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(tripsService, 'getLogementsByVoyage').mockReturnValue(throwError(() => new Error('API error')));
    
    component.ngOnInit();
    
    expect(consoleSpy).toHaveBeenCalledWith('Erreur chargement logements :', expect.any(Error));
    expect(component.logements).toEqual([]);
    consoleSpy.mockRestore();
  });

  it('should not load logements if tripId is invalid', () => {
    jest.spyOn(tripsService, 'getLogementsByVoyage');
    component.tripId = 0;
    
    component.ngOnInit();
    
    expect(tripsService.getLogementsByVoyage).not.toHaveBeenCalled();
    expect(component.logements).toEqual([]);
  });

  it('should open single logement form', () => {
    component.openSingleLogementForm();
    expect(component.showSingleLogementForm).toBe(true);
  });

  it('should handle add logement modal with valid data', () => {
    const mockEvent = {
      detail: {
        data: {
          update: false,
          logements: [mockLogement]
        }
      }
    };
    const spy = jest.spyOn(component, 'onSingleLogementAdded');
    
    component.handleAddLogementModal(mockEvent);
    
    expect(spy).toHaveBeenCalledWith([mockLogement]);
    expect(component.showSingleLogementForm).toBe(false);
  });

  it('should not call onSingleLogementAdded if event data is invalid', () => {
    const spy = jest.spyOn(component, 'onSingleLogementAdded');
    
    // Cas 1: pas de detail.data
    component.handleAddLogementModal({});
    // Cas 2: data.update = true (pas pour un ajout)
    component.handleAddLogementModal({ detail: { data: { update: true } } });
    // Cas 3: pas de logements
    component.handleAddLogementModal({ detail: { data: { update: false } } });
    // Cas 4: tableau logements vide
    component.handleAddLogementModal({ detail: { data: { update: false, logements: [] } } });
    
    expect(spy).not.toHaveBeenCalled();
  });

  it('should add new logement via service and update local list', fakeAsync(() => {
    const newLogement: Logement = {
      nom: 'Résidence Le Soleil',
      adresse: '25 Rue de la République, Paris',
      voyageId: 0
    };
    const createdLogement = { ...newLogement, id: 2 };
    
    jest.spyOn(tripsService, 'addLogement').mockReturnValue(of(createdLogement));
    component.logements = [mockLogement]; // État initial

    component.onSingleLogementAdded([newLogement]);
    tick(20); // Augmenter le délai pour s'assurer que le setTimeout dans le composant s'exécute
    
    expect(tripsService.addLogement).toHaveBeenCalledWith(1, newLogement);
    expect(component.logements).toEqual([mockLogement, createdLogement]);
    expect(component.showSingleLogementForm).toBe(false);
  }));

  it('should handle error when adding logement', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const newLogement: Logement = {
      nom: 'Résidence Le Soleil',
      adresse: '25 Rue de la République, Paris',
      voyageId: 0
    };
    
    jest.spyOn(tripsService, 'addLogement').mockReturnValue(throwError(() => new Error('API error')));
    component.onSingleLogementAdded([newLogement]);
    
    expect(consoleSpy).toHaveBeenCalledWith('Erreur ajout logement :', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should delete logement and update local list', () => {
    const logementId = 1;
    jest.spyOn(tripsService, 'removeLogement').mockReturnValue(of({}));
    component.logements = [mockLogement];
    
    component.deleteLogement(logementId);
    
    expect(tripsService.removeLogement).toHaveBeenCalledWith(logementId);
    expect(component.logements).toEqual([]);
  });

  it('should handle error when deleting logement', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(tripsService, 'removeLogement').mockReturnValue(throwError(() => new Error('API error')));
    component.logements = [mockLogement];
    
    component.deleteLogement(1);
    
    expect(consoleSpy).toHaveBeenCalledWith('Erreur suppression logement :', expect.any(Error));
    expect(component.logements).toEqual([mockLogement]); // Liste inchangée
    consoleSpy.mockRestore();
  });

  it('should set logement for editing', () => {
    component.logements = [mockLogement];
    component.editLogement(1);
    
    expect(component.selectedLogement).toEqual([mockLogement]);
    expect(component.showUpdateLogementForm).toBe(true);
  });

  it('should not set logement for editing if ID not found', () => {
    component.logements = [mockLogement];
    component.showUpdateLogementForm = false;
    component.selectedLogement = [];
    
    component.editLogement(999); // ID inexistant
    
    expect(component.selectedLogement).toEqual([]);
    expect(component.showUpdateLogementForm).toBe(false);
  });

  it('should handle update logement modal with valid data', () => {
    const mockEvent = {
      detail: {
        data: {
          update: true,
          logements: [{ ...mockLogement, nom: 'Hôtel Paradis Renamed' }]
        }
      }
    };
    const spy = jest.spyOn(component, 'onUpdateLogement');
    
    component.handleUpdateLogementModal(mockEvent);
    
    expect(spy).toHaveBeenCalledWith([{ ...mockLogement, nom: 'Hôtel Paradis Renamed' }]);
    expect(component.showUpdateLogementForm).toBe(false);
  });

  it('should not call onUpdateLogement if event data is invalid', () => {
    const spy = jest.spyOn(component, 'onUpdateLogement');
    
    component.handleUpdateLogementModal({});
    component.handleUpdateLogementModal({ detail: { data: { update: false } } });
    
    expect(spy).not.toHaveBeenCalled();
  });

  it('should update logement via service and update local list', () => {
    const updatedLogement = { ...mockLogement, nom: 'Hôtel Paradis Premium' };
    jest.spyOn(tripsService, 'updateLogement').mockReturnValue(of(updatedLogement));
    component.logements = [mockLogement];
    
    component.onUpdateLogement([updatedLogement]);
    
    expect(tripsService.updateLogement).toHaveBeenCalledWith(1, updatedLogement);
    expect(component.logements[0]).toEqual(updatedLogement);
    expect(component.showUpdateLogementForm).toBe(false);
  });

  it('should handle error when updating logement', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const updatedLogement = { ...mockLogement, nom: 'Hôtel Paradis Premium' };
    
    jest.spyOn(tripsService, 'updateLogement').mockReturnValue(throwError(() => new Error('API error')));
    component.onUpdateLogement([updatedLogement]);
    
    expect(consoleSpy).toHaveBeenCalledWith('Erreur mise à jour logement :', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
