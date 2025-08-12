import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsPage } from './tabs.page';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;
  let routerEvents$: Subject<any>;

  beforeEach(async () => {
    routerEvents$ = new Subject();

    await TestBed.configureTestingModule({
      declarations: [TabsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Router,
          useValue: {
            events: routerEvents$.asObservable()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the TabsPage component', () => {
    expect(component).toBeTruthy();
  });

  it('should update selectedTab on NavigationEnd event', () => {
    const event = new NavigationEnd(1, '/tabs/welcome', '/tabs/welcome');
    routerEvents$.next(event);

    expect(component.selectedTab).toBe('welcome');
  });
});
