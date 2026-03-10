import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { PeopleList } from './people-list';
import { SwapiService } from '../../core/services/swapi.service';
import { ApiResponse, Person } from '../../core/models/swapi.model';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('PeopleList', () => {
  let component: PeopleList;
  let fixture: ComponentFixture<PeopleList>;
  let swapiServiceMock: any;
  let routerMock: any;
  let queryParamsSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    vi.useFakeTimers();

    swapiServiceMock = {
      getPeople: vi.fn()
    };

    routerMock = {
      navigate: vi.fn()
    };

    queryParamsSubject = new BehaviorSubject({ page: '1', search: '' });

    await TestBed.configureTestingModule({
      imports: [PeopleList],
      providers: [
        { provide: SwapiService, useValue: swapiServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { queryParams: queryParamsSubject.asObservable() } },
        provideNoopAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PeopleList);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should trigger router.navigate on page change', () => {
    component.onPageChange(2);
    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      queryParams: { page: 2 },
      queryParamsHandling: 'merge'
    });
  });

  it('should trigger router.navigate and reset page to 1 on search change', () => {
    component.onSearchChange('Luke');
    expect(routerMock.navigate).toHaveBeenCalledWith([], {
      relativeTo: TestBed.inject(ActivatedRoute),
      queryParams: { search: 'Luke', page: 1 },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  });

  it('should filter dataSource by gender correctly', () => {
    const mockReponse: ApiResponse<Person> = {
      count: 2, next: null, previous: null,
      results: [
        { name: 'Luke', gender: 'male', birth_year: '19BBY', height: '172', mass: '77', created: '2024-12-19T10:00:00Z', edited: '2024-12-19T10:00:00Z', homeworld: 'Tatooine' },
        { name: 'Leia', gender: 'female', birth_year: '19BBY', height: '150', mass: '49', created: '2024-12-19T10:00:00Z', edited: '2024-12-19T10:00:00Z', homeworld: 'Alderaan' }
      ]
    };
    swapiServiceMock.getPeople.mockReturnValue(of(mockReponse));

    // Trigger the initial queryParams subscription
    fixture.detectChanges();
    vi.advanceTimersByTime(300); // debounceTime
    fixture.detectChanges();

    // Initially, both genders
    expect(component.dataSource().length).toBe(2);
    expect(component.paginatorLength()).toBe(2);

    // Filter to male
    component.selectedGender.set('male');
    expect(component.dataSource().length).toBe(1);
    expect(component.dataSource()[0].name).toBe('Luke');
    // Paginator length should be the filtered array length
    expect(component.paginatorLength()).toBe(1);
  });

  it('should handle error state correctly', () => {
    swapiServiceMock.getPeople.mockReturnValue(throwError(() => new Error('API Error')));

    // Trigger the initial queryParams subscription
    fixture.detectChanges();
    vi.advanceTimersByTime(300); // debounceTime
    fixture.detectChanges();

    expect(component.hasError()).toBe(true);
    expect(component.isLoading()).toBe(false);
    expect(component.dataSource().length).toBe(0);
  });
});
