import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable, of, switchMap, catchError } from 'rxjs';
import { ApiResponse, Person, Planet, Species } from '../models/swapi.model';

@Injectable({
    providedIn: 'root'
})
export class SwapiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'https://swapi.dev/api';
    private readonly homeworldCache = new Map<string, string>();
    private readonly speciesCache = new Map<string, string>();

    getPeople(page: number, search = ''): Observable<ApiResponse<Person>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('search', search);

        return this.http.get<ApiResponse<Person>>(`${this.baseUrl}/people/`, { params }).pipe(
            switchMap((response) => this.resolveRelatedData(response))
        );
    }

    private resolveRelatedData(response: ApiResponse<Person>): Observable<ApiResponse<Person>> {
        if (!response.results.length) {
            return of(response);
        }

        const uniqueHomeworldUrls = [...new Set(response.results.map((p) => p.homeworld))].filter(Boolean);
        const newHomeworldUrls = uniqueHomeworldUrls.filter((url) => !this.homeworldCache.has(url));

        const uniqueSpeciesUrls = [...new Set(response.results.flatMap((p) => p.species || []))].filter(Boolean);
        const newSpeciesUrls = uniqueSpeciesUrls.filter((url) => !this.speciesCache.has(url));

        const requests: Observable<any>[] = [
            ...newHomeworldUrls.map((url) => this.getPlanet(url)),
            ...newSpeciesUrls.map((url) => this.getSpecies(url))
        ];

        if (requests.length === 0) {
            return of(this.mapPeopleWithCachedData(response));
        }

        return forkJoin(requests).pipe(
            map(() => this.mapPeopleWithCachedData(response))
        );
    }

    private getPlanet(url: string): Observable<Planet> {
        return this.http.get<Planet>(url).pipe(
            map((planet) => {
                this.homeworldCache.set(url, planet.name);
                return planet;
            }),
            catchError(() => {
                this.homeworldCache.set(url, 'Unknown');
                return of({ name: 'Unknown', url } as Planet);
            })
        );
    }

    private getSpecies(url: string): Observable<Species> {
        return this.http.get<Species>(url).pipe(
            map((species) => {
                this.speciesCache.set(url, species.name);
                return species;
            }),
            catchError(() => {
                this.speciesCache.set(url, 'Unknown');
                return of({ name: 'Unknown', url } as Species);
            })
        );
    }

    // private mapPeopleWithCachedData(response: ApiResponse<Person>): ApiResponse<Person> {
    //     return {
    //         ...response,
    //         results: response.results.map((person) => ({
    //             ...person,
    //             homeworld: person.homeworld ? (this.homeworldCache.get(person.homeworld) ?? 'Unknown') : 'Unknown',
    //             species: person.species && person.species.length > 0
    //                 ? person.species.map(url => this.speciesCache.get(url) ?? 'Unknown')
    //                 : ['Human'] // SWAPI default
    //         }))
    //     };
    // }
    private mapPeopleWithCachedData(response: ApiResponse<Person>): ApiResponse<Person> {
        return {
            ...response,
            results: response.results.map((person) => ({
                ...person,
                homeworld: person.homeworld ? (this.homeworldCache.get(person.homeworld) ?? 'Unknown') : 'Unknown',
                species: (person.species || []).map(url => this.speciesCache.get(url) ?? 'Unknown')
            }))
        };
    }
}
