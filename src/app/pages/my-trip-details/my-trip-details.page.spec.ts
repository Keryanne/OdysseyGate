import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MyTripDetailsPage } from './my-trip-details.page';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { TripsService } from 'src/app/services/trips.service';

describe('MyTripDetailsPage', () => {
  let component: MyTripDetailsPage;
  let fixture: ComponentFixture<MyTripDetailsPage>;
  let router: Router;
  let alertController: AlertController;
  let tripsService: TripsService;

  const mockAlert = {
    present: jest.fn(),
  };

  const mockVoyage = {
    id: 1,
    destination: 'Paris',
    transport: [],
    logement: [],
    activite: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyTripDetailsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          },
        },
        {
          provide: AlertController,
          useValue: {
            create: jest.fn().mockResolvedValue(mockAlert),
          },
        },
        {
          provide: TripsService,
          useValue: {
            getVoyageById: jest.fn().mockReturnValue(of(mockVoyage)),
            removeVoyage: jest.fn().mockReturnValue(of({ success: true })),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyTripDetailsPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    alertController = TestBed.inject(AlertController);
    tripsService = TestBed.inject(TripsService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize tripId and trip data on ngOnInit', () => {
    expect(component.tripId).toBe(1);
    expect(tripsService.getVoyageById).toHaveBeenCalledWith(1);
    expect(component.city).toBe('Paris');
    expect(component.trip).toEqual(mockVoyage);
  });

  it('should handle error on getVoyageById', () => {
    (tripsService.getVoyageById as jest.Mock).mockReturnValueOnce(throwError(() => new Error('fail')));
    component.ngOnInit();
    // No throw, just logs error
    expect(component.tripId).toBe(1);
  });

  it('should update selected tab correctly', () => {
    const tab = component.tabs[1]; // logements
    component.selectTab(tab);
    expect(component.selectedTab).toBe(tab);
    expect(component.selectedTabIndex).toBe(1);
  });

  it('should generate correct transform style', () => {
    component.selectedTabIndex = 2;
    expect(component.getTransform()).toBe('translateX(-200%)');
  });

  it('should present delete confirmation alert', fakeAsync(async () => {
    await component.presentDeleteAlert('Rome');
    expect(alertController.create).toHaveBeenCalledWith(
      expect.objectContaining({
        header: expect.stringContaining('Rome'),
        cssClass: 'custom-alert',
      }),
    );
    expect(mockAlert.present).toHaveBeenCalled();
  }));

  it('should call removeVoyage and navigate on confirm delete', fakeAsync(() => {
    // Capture la configuration de l'alerte pour accéder au handler
    let alertConfig: any;
    (alertController.create as jest.Mock).mockImplementation((config) => {
      alertConfig = config;
      return Promise.resolve({
        present: jest.fn()
      });
    });
    
    // Appelle la méthode pour afficher l'alerte
    component.presentDeleteAlert('Paris');
    // Avance le temps pour résoudre la Promise
    tick();
    
    // Simule le clic sur le bouton "Supprimer" en appelant son handler directement
    const deleteHandler = alertConfig.buttons[1].handler;
    deleteHandler();
    
    // Force l'exécution asynchrone
    tick();
    
    // Vérifie que removeVoyage a été appelé avec l'id attendu
    expect(tripsService.removeVoyage).toHaveBeenCalledWith(1);
    expect(router.navigate).toHaveBeenCalledWith(['/tabs/my-trips']);
  }));

  it('should handle error on removeVoyage', fakeAsync(() => {
    // Capture la configuration de l'alerte pour accéder au handler
    let alertConfig: any;
    (alertController.create as jest.Mock).mockImplementation((config) => {
      alertConfig = config;
      return Promise.resolve({
        present: jest.fn()
      });
    });
    
    // Mock removeVoyage pour retourner une erreur
    (tripsService.removeVoyage as jest.Mock).mockReturnValue(throwError(() => new Error('fail')));
    
    // Espionne console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Appelle la méthode pour afficher l'alerte
    component.presentDeleteAlert('Paris');
    // Avance le temps pour résoudre la Promise dans presentDeleteAlert
    tick();
    
    // Simule le clic sur le bouton "Supprimer" en appelant son handler directement
    const deleteHandler = alertConfig.buttons[1].handler;
    deleteHandler();
    
    // Force l'exécution asynchrone
    tick();
    
    // Vérifie que removeVoyage a été appelé avec l'id attendu
    expect(tripsService.removeVoyage).toHaveBeenCalledWith(1);
    
    // Vérifie que console.error a été appelé avec l'erreur
    expect(consoleSpy).toHaveBeenCalledWith('Erreur lors de la suppression:', expect.any(Error));
    
    // Restaure console.error
    consoleSpy.mockRestore();
  }));
});
