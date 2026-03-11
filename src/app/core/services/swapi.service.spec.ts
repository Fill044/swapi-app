import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SwapiService } from './swapi.service';
import { ApiResponse, Person, Planet } from '../models/swapi.model';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('SwapiService', () => {
    let service: SwapiService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SwapiService,
                provideHttpClient(),
                provideHttpClientTesting(),
            ]
        });
        service = TestBed.inject(SwapiService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch people with correct page and search params', () => {
        const mockResponse: ApiResponse<Person> = {
            count: 1,
            next: null,
            previous: null,
            results: []
        };

        service.getPeople(2, 'Luke').subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne('https://swapi.dev/api/people/?page=2&search=Luke');
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should cache homeworlds and map them correctly', () => {
        const planetUrl = 'https://swapi.dev/api/planets/1/';

        const mockPeopleResponse1: ApiResponse<Person> = {
            count: 1, next: null, previous: null,
            results: [{ name: 'Luke', gender: 'male', birth_year: '19BBY', height: '172', mass: '77', created: 'date', edited: 'date', homeworld: planetUrl, species: [], films: [] }]
        };

        const mockPlanetResponse: Planet = {
            name: 'Tatooine',
            url: planetUrl
        };

        // First call: Should fetch people, then fetch planet
        service.getPeople(1).subscribe(res => {
            expect(res.results[0].homeworld).toBe('Tatooine');
        });

        const reqPeople1 = httpMock.expectOne('https://swapi.dev/api/people/?page=1&search=');
        reqPeople1.flush(mockPeopleResponse1);

        const reqPlanet = httpMock.expectOne(planetUrl);
        expect(reqPlanet.request.method).toBe('GET');
        reqPlanet.flush(mockPlanetResponse);

        // Second call: Should fetch people, but use cached planet
        const mockPeopleResponse2: ApiResponse<Person> = {
            count: 1, next: null, previous: null,
            results: [{ name: 'Anakin', gender: 'male', birth_year: '41.9BBY', height: '188', mass: '84', created: 'date', edited: 'date', homeworld: planetUrl, species: [], films: [] }]
        };

        service.getPeople(2).subscribe(res => {
            expect(res.results[0].homeworld).toBe('Tatooine');
        });

        const reqPeople2 = httpMock.expectOne('https://swapi.dev/api/people/?page=2&search=');
        reqPeople2.flush(mockPeopleResponse2);

        // Verify there is no second planet request
        httpMock.expectNone(planetUrl);
    });
});
