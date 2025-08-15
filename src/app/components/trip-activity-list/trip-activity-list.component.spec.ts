import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TripActivityListComponent } from './trip-activity-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TripsService } from 'src/app/services/trips.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Activity } from 'src/app/models/activity.model';

describe('TripActivityListComponent', () => {
  let component: TripActivityListComponent;
  let fixture: ComponentFixture<TripActivityListComponent>;
  let tripsService: TripsService;

  const mockActivity: Activity = { 
    id: 1,
    description: 'Musée du Louvre',
    lieu: 'Paris',
    voyageId: 1
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TripActivityListComponent],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      providers: [TripsService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TripActivityListComponent);
    component = fixture.componentInstance;
    tripsService = TestBed.inject(TripsService);
    
    // Définir tripId pour les tests
    component.tripId = 1;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load activities from TripsService on init', () => {
    const mockActivities = [mockActivity];
    jest.spyOn(tripsService, 'getActivitiesByVoyage').mockReturnValue(of(mockActivities));
    
    component.ngOnInit();
    
    expect(component.activities).toEqual(mockActivities);
    expect(tripsService.getActivitiesByVoyage).toHaveBeenCalledWith(1);
  });

  it('should handle error when loading activities', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(tripsService, 'getActivitiesByVoyage').mockReturnValue(throwError(() => new Error('API error')));
    
    component.ngOnInit();
    
    expect(consoleSpy).toHaveBeenCalledWith('Erreur chargement activités :', expect.any(Error));
    expect(component.activities).toEqual([]);
    consoleSpy.mockRestore();
  });

  it('should not load activities if tripId is invalid', () => {
    jest.spyOn(tripsService, 'getActivitiesByVoyage');
    component.tripId = 0;
    
    component.ngOnInit();
    
    expect(tripsService.getActivitiesByVoyage).not.toHaveBeenCalled();
    expect(component.activities).toEqual([]);
  });

  it('should open single activity form', () => {
    component.openSingleActivityForm();
    expect(component.showSingleActivityForm).toBe(true);
  });

  it('should handle add activity modal with valid data', () => {
    const mockEvent = {
      detail: {
        data: {
          update: false,
          activities: [mockActivity]
        }
      }
    };
    const spy = jest.spyOn(component, 'onSingleActivityAdded');
    
    component.handleAddActivityModal(mockEvent);
    
    expect(spy).toHaveBeenCalledWith([mockActivity]);
    expect(component.showSingleActivityForm).toBe(false);
  });

  it('should not call onSingleActivityAdded if event data is invalid', () => {
    const spy = jest.spyOn(component, 'onSingleActivityAdded');
    
    component.handleAddActivityModal({});
    component.handleAddActivityModal({ detail: { data: { update: true } } });
    component.handleAddActivityModal({ detail: { data: { update: false } } });
    component.handleAddActivityModal({ detail: { data: { update: false, activities: [] } } });
    
    expect(spy).not.toHaveBeenCalled();
  });

  it('should add new activity via service and update local list', fakeAsync(() => {
    const newActivity: Activity = {
      description: 'Tour Eiffel',
      lieu: 'Paris',
      voyageId: 0
    };
    const createdActivity = { ...newActivity, id: 2 };
    
    jest.spyOn(tripsService, 'addActivity').mockReturnValue(of(createdActivity));
    component.activities = [mockActivity]; // État initial

    component.onSingleActivityAdded([newActivity]);
    tick(20); // Pour les éventuels setTimeout
    
    expect(tripsService.addActivity).toHaveBeenCalledWith(1, newActivity);
    expect(component.activities).toEqual([mockActivity, createdActivity]);
    expect(component.showSingleActivityForm).toBe(false);
  }));

  it('should handle error when adding activity', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const newActivity: Activity = {
      description: 'Tour Eiffel',
      lieu: 'Paris',
      voyageId: 0
    };
    
    jest.spyOn(tripsService, 'addActivity').mockReturnValue(throwError(() => new Error('API error')));
    component.onSingleActivityAdded([newActivity]);
    
    expect(consoleSpy).toHaveBeenCalledWith('Erreur ajout activité :', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should delete activity and update local list', () => {
    const activityId = 1;
    jest.spyOn(tripsService, 'removeActivity').mockReturnValue(of({}));
    component.activities = [mockActivity];
    
    component.deleteActivity(activityId);
    
    expect(tripsService.removeActivity).toHaveBeenCalledWith(activityId);
    expect(component.activities).toEqual([]);
  });

  it('should handle error when deleting activity', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(tripsService, 'removeActivity').mockReturnValue(throwError(() => new Error('API error')));
    component.activities = [mockActivity];
    
    component.deleteActivity(1);
    
    expect(consoleSpy).toHaveBeenCalledWith('Erreur suppression activité :', expect.any(Error));
    expect(component.activities).toEqual([mockActivity]); // Liste inchangée
    consoleSpy.mockRestore();
  });

  it('should set activity for editing', () => {
    component.activities = [mockActivity];
    component.editActivity(1);
    
    expect(component.selectedActivity).toEqual([mockActivity]);
    expect(component.showUpdateActivityForm).toBe(true);
  });

  it('should not set activity for editing if ID not found', () => {
    component.activities = [mockActivity];
    component.showUpdateActivityForm = false;
    component.selectedActivity = [];
    
    component.editActivity(999); // ID inexistant
    
    expect(component.selectedActivity).toEqual([]);
    expect(component.showUpdateActivityForm).toBe(false);
  });

  it('should handle update activity modal with valid data', () => {
    const mockEvent = {
      detail: {
        data: {
          update: true,
          activities: [{ ...mockActivity, nom: 'Musée d\'Orsay' }]
        }
      }
    };
    const spy = jest.spyOn(component, 'onUpdateActivity');
    
    component.handleUpdateActivityModal(mockEvent);
    
    expect(spy).toHaveBeenCalledWith([{ ...mockActivity, nom: 'Musée d\'Orsay' }]);
    expect(component.showUpdateActivityForm).toBe(false);
  });

  it('should not call onUpdateActivity if event data is invalid', () => {
    const spy = jest.spyOn(component, 'onUpdateActivity');
    
    component.handleUpdateActivityModal({});
    component.handleUpdateActivityModal({ detail: { data: { update: false } } });
    
    expect(spy).not.toHaveBeenCalled();
  });

  it('should update activity via service and update local list', () => {
    const updatedActivity = { ...mockActivity, nom: 'Musée d\'Orsay' };
    jest.spyOn(tripsService, 'updateActivity').mockReturnValue(of(updatedActivity));
    component.activities = [mockActivity];
    
    component.onUpdateActivity([updatedActivity]);
    
    expect(tripsService.updateActivity).toHaveBeenCalledWith(1, updatedActivity);
    expect(component.activities[0]).toEqual(updatedActivity);
    expect(component.showUpdateActivityForm).toBe(false);
  });

  it('should handle error when updating activity', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const updatedActivity = { ...mockActivity, nom: 'Musée d\'Orsay' };
    
    jest.spyOn(tripsService, 'updateActivity').mockReturnValue(throwError(() => new Error('API error')));
    component.onUpdateActivity([updatedActivity]);
    
    expect(consoleSpy).toHaveBeenCalledWith('Erreur mise à jour activité :', expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('should set animation state after timeout in ngOnInit', fakeAsync(() => {
    jest.spyOn(tripsService, 'getActivitiesByVoyage').mockReturnValue(of([mockActivity]));
    component.animationState = 'void';
    
    component.ngOnInit();
    expect(component.animationState).toBe('void');
    
    tick(100);
    expect(component.animationState).toBe('active');
  }));
});
