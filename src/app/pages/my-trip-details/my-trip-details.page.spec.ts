import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MyTripDetailsPage } from './my-trip-details.page';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { TripsService } from 'src/app/services/trips.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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
      imports: [NoopAnimationsModule],
      declarations: [MyTripDetailsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
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

  it('should start with loading state', () => {
    // Reset pour tester l'état initial avant ngOnInit
    component.isLoading = true;
    component.errorMessage = '';
    fixture.detectChanges();
    expect(component.isLoading).toBe(true);
  });

  it('should initialize tripId, set loading to false and load trip data on ngOnInit', () => {
    expect(component.tripId).toBe(1);
    expect(tripsService.getVoyageById).toHaveBeenCalledWith(1);
    expect(component.city).toBe('Paris');
    expect(component.trip).toEqual(mockVoyage);
    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe('');
  });

  it('should handle error on getVoyageById', () => {
    // Mock de l'erreur
    (tripsService.getVoyageById as jest.Mock).mockReturnValueOnce(throwError(() => new Error('fail')));
    
    // Appel de la méthode loadTrip directement pour éviter les conflits avec beforeEach
    component.loadTrip();
    
    // Vérifications
    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe("Une erreur est survenue lors du chargement du voyage.");
  });

  it('should handle invalid tripId', () => {
    // Simuler un ID invalide
    component.tripId = 0;
    component.loadTrip();
    
    expect(component.isLoading).toBe(false);
    expect(component.errorMessage).toBe("ID de voyage invalide");
  });

  it('should set animationState to active on ionViewWillEnter', fakeAsync(() => {
    component.animationState = 'void';
    component.ionViewWillEnter();
    tick();
    expect(component.animationState).toBe('active');
  }));

  it('should reset animationState on ionViewWillLeave', () => {
    component.animationState = 'active';
    component.ionViewWillLeave();
    expect(component.animationState).toBe('void');
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
    tick();
    
    // Simule le clic sur le bouton "Supprimer"
    const deleteHandler = alertConfig.buttons[1].handler;
    deleteHandler();
    tick();
    
    expect(tripsService.removeVoyage).toHaveBeenCalledWith(1);
    expect(router.navigate).toHaveBeenCalledWith(['/tabs/my-trips']);
  }));

  it('should handle error on removeVoyage', fakeAsync(() => {
    // Configuration du mock pour l'alerte
    let alertConfig: any;
    (alertController.create as jest.Mock).mockImplementation((config) => {
      alertConfig = config;
      return Promise.resolve({
        present: jest.fn()
      });
    });
    
    // Configuration du mock pour retourner une erreur
    (tripsService.removeVoyage as jest.Mock).mockReturnValue(throwError(() => new Error('fail')));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Exécution
    component.presentDeleteAlert('Paris');
    tick();
    const deleteHandler = alertConfig.buttons[1].handler;
    deleteHandler();
    tick();
    
    // Vérifications
    expect(tripsService.removeVoyage).toHaveBeenCalledWith(1);
    expect(consoleSpy).toHaveBeenCalledWith('Erreur lors de la suppression:', expect.any(Error));
    consoleSpy.mockRestore();
  }));
});
