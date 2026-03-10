import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { ApiResponse, Person, Planet } from '../models/swapi.model';

@Injectable({
    providedIn: 'root'
})
export class SwapiService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = 'https://swapi.dev/api';
    private readonly homeworldCache = new Map<string, string>();

    getPeople(page: number, search = ''): Observable<ApiResponse<Person>> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('search', search);

        return this.http.get<ApiResponse<Person>>(`${this.baseUrl}/people/`, { params }).pipe(
            switchMap((response) => this.resolveHomeworlds(response))
        );
    }

    private resolveHomeworlds(response: ApiResponse<Person>): Observable<ApiResponse<Person>> {
        if (!response.results.length) {
            return of(response);
        }

        const uniqueHomeworldUrls = [...new Set(response.results.map((p) => p.homeworld))];
        const newUrls = uniqueHomeworldUrls.filter((url) => !this.homeworldCache.has(url));

        if (newUrls.length === 0) {
            return of(this.mapPeopleWithCachedPlanets(response));
        }

        const requests = newUrls.map((url) => this.getPlanet(url));

        return forkJoin(requests).pipe(
            map(() => this.mapPeopleWithCachedPlanets(response))
        );
    }

    private getPlanet(url: string): Observable<Planet> {
        return this.http.get<Planet>(url).pipe(
            map((planet) => {
                this.homeworldCache.set(url, planet.name);
                return planet;
            })
        );
    }

    private mapPeopleWithCachedPlanets(response: ApiResponse<Person>): ApiResponse<Person> {
        return {
            ...response,
            results: response.results.map((person) => ({
                ...person,
                homeworld: this.homeworldCache.get(person.homeworld) ?? 'Unknown'
            }))
        };
    }
}
