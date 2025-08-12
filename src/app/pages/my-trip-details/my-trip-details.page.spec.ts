import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MyTripDetailsPage } from './my-trip-details.page';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
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
    expect(component.transports).toEqual([]);
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
});
