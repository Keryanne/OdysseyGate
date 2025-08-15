import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripTransportListComponent } from './trip-transport-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TripsService } from 'src/app/services/trips.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Transport } from 'src/app/models/transport.model';

describe('TripTransportListComponent', () => {
  let component: TripTransportListComponent;
  let fixture: ComponentFixture<TripTransportListComponent>;
  let tripsService: TripsService;

  const mockTransport: Transport = { 
    id: 1,
    type: 'Train',
    numero: 'TGV123',
    compagnie: 'SNCF',
    depart: 'Paris',
    arrivee: 'Lyon',
    dateDepart: new Date('2025-03-05T08:00:00Z'),
    dateArrivee: new Date('2025-03-05T11:30:00Z'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TripTransportListComponent],
      imports: [HttpClientTestingModule],
      providers: [TripsService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TripTransportListComponent);
    component = fixture.componentInstance;
    tripsService = TestBed.inject(TripsService);
    component.tripId = 1;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load transports from TripsService on init', () => {
    const mockTransports = [mockTransport];
    jest.spyOn(tripsService, 'getTransportsByVoyage').mockReturnValue(of(mockTransports));
    component.ngOnInit();
    expect(component.transports).toEqual(mockTransports);
  });

  it('should handle error when loading transports', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(tripsService, 'getTransportsByVoyage').mockReturnValue(throwError(() => new Error('API error')));
    component.ngOnInit();
    expect(consoleSpy).toHaveBeenCalledWith('Erreur chargement transports :', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should not assign transports if tripId is invalid', () => {
    component.tripId = 0;
    component.ngOnInit();
    expect(component.transports).toEqual([]);
  });

  it('should open single transport form', () => {
    component.openSingleTransportForm();
    expect(component.showSingleTransportForm).toBe(true);
  });

  it('should handle add transport modal with valid data', () => {
    const mockEvent = {
      detail: {
        data: {
          update: false,
          transports: [mockTransport]
        }
      }
    };
    const spy = jest.spyOn(component, 'onSingleTransportAdded');
    component.handleAddTransportModal(mockEvent);
    expect(spy).toHaveBeenCalledWith([mockTransport]);
    expect(component.showSingleTransportForm).toBe(false);
  });

  it('should not call onSingleTransportAdded if event data is invalid', () => {
    const spy = jest.spyOn(component, 'onSingleTransportAdded');
    // Cas 1: pas de detail.data
    component.handleAddTransportModal({});
    // Cas 2: data.update = true (pas pour un ajout)
    component.handleAddTransportModal({ detail: { data: { update: true } } });
    // Cas 3: pas de transports
    component.handleAddTransportModal({ detail: { data: { update: false } } });
    // Cas 4: tableau transports vide
    component.handleAddTransportModal({ detail: { data: { update: false, transports: [] } } });
    
    expect(spy).not.toHaveBeenCalled();
  });

  it('should add new transport via service and update local list', () => {
    const newTransport: Transport = { 
      type: 'Bus',
      numero: 'B456',
      compagnie: 'FlixBus',
      depart: 'Nice',
      arrivee: 'Marseille',
      dateDepart: new Date('2025-04-10T09:00:00Z'),
      dateArrivee: new Date('2025-04-10T11:00:00Z'),
    };
    const createdTransport = { ...newTransport, id: 2 };
    
    jest.spyOn(tripsService, 'addTransport').mockReturnValue(of(createdTransport));
    component.transports = [mockTransport]; // État initial

    component.onSingleTransportAdded([newTransport]);
    
    expect(tripsService.addTransport).toHaveBeenCalledWith(1, newTransport);
    expect(component.transports).toEqual([mockTransport, createdTransport]);
    expect(component.showSingleTransportForm).toBe(false);
  });

  it('should handle error when adding transport', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    // Utilise un objet Transport complet comme dans le test réussi
    const newTransport: Transport = { 
      type: 'Bus',
      numero: 'B456',
      compagnie: 'FlixBus',
      depart: 'Nice',
      arrivee: 'Marseille',
      dateDepart: new Date('2025-04-10T09:00:00Z'),
      dateArrivee: new Date('2025-04-10T11:00:00Z'),
    };
    
    jest.spyOn(tripsService, 'addTransport').mockReturnValue(throwError(() => new Error('API error')));
    component.onSingleTransportAdded([newTransport]);
    
    expect(consoleSpy).toHaveBeenCalledWith('Erreur ajout transport :', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should delete transport and update local list', () => {
    const transportId = 1;
    jest.spyOn(tripsService, 'removeTransport').mockReturnValue(of({}));
    component.transports = [mockTransport];
    
    component.deleteTransport(transportId);
    
    expect(tripsService.removeTransport).toHaveBeenCalledWith(transportId);
    expect(component.transports).toEqual([]);
  });

  it('should handle error when deleting transport', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(tripsService, 'removeTransport').mockReturnValue(throwError(() => new Error('API error')));
    component.transports = [mockTransport];
    
    component.deleteTransport(1);
    
    expect(consoleSpy).toHaveBeenCalledWith('Erreur suppression transport :', expect.any(Error));
    expect(component.transports).toEqual([mockTransport]); // Liste inchangée
    consoleSpy.mockRestore();
  });

  it('should set transport for editing', () => {
    component.transports = [mockTransport];
    component.editTransport(1);
    
    expect(component.selectedTransport).toEqual([mockTransport]);
    expect(component.showUpdateTransportForm).toBe(true);
  });

  it('should not set transport for editing if ID not found', () => {
    component.transports = [mockTransport];
    component.showUpdateTransportForm = false;
    component.selectedTransport = [];
    
    component.editTransport(999); // ID inexistant
    
    expect(component.selectedTransport).toEqual([]);
    expect(component.showUpdateTransportForm).toBe(false);
  });

  it('should handle update transport modal with valid data', () => {
    const mockEvent = {
      detail: {
        data: {
          update: true,
          transports: [{ ...mockTransport, compagnie: 'UPDATED' }]
        }
      }
    };
    const spy = jest.spyOn(component, 'onUpdateTransport');
    
    component.handleUpdateTransportModal(mockEvent);
    
    expect(spy).toHaveBeenCalledWith([{ ...mockTransport, compagnie: 'UPDATED' }]);
    expect(component.showUpdateTransportForm).toBe(false);
  });

  it('should not call onUpdateTransport if event data is invalid', () => {
    const spy = jest.spyOn(component, 'onUpdateTransport');
    
    component.handleUpdateTransportModal({});
    component.handleUpdateTransportModal({ detail: { data: { update: false } } });
    
    expect(spy).not.toHaveBeenCalled();
  });

  it('should update transport via service and update local list', () => {
    const updatedTransport = { ...mockTransport, compagnie: 'UPDATED' };
    jest.spyOn(tripsService, 'updateTransport').mockReturnValue(of(updatedTransport));
    component.transports = [mockTransport];
    
    component.onUpdateTransport([updatedTransport]);
    
    expect(tripsService.updateTransport).toHaveBeenCalledWith(1, updatedTransport);
    expect(component.transports[0]).toEqual(updatedTransport);
    expect(component.showUpdateTransportForm).toBe(false);
  });

  it('should handle error when updating transport', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const updatedTransport = { ...mockTransport, compagnie: 'UPDATED' };
    
    jest.spyOn(tripsService, 'updateTransport').mockReturnValue(throwError(() => new Error('API error')));
    component.onUpdateTransport([updatedTransport]);
    
    expect(consoleSpy).toHaveBeenCalledWith('Erreur mise à jour transport :', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
