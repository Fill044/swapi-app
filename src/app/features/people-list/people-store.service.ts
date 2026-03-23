import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { computed, signal } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SwapiService } from '../../core/services/swapi.service';
import { ApiResponse, Person } from '../../core/models/swapi.model';

@Injectable()
export class PeopleStoreService {
    private readonly swapiService = inject(SwapiService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    readonly isLoading = signal(false);
    readonly hasError = signal(false);

    readonly queryParams = toSignal(this.route.queryParams, {
        initialValue: {} as Record<string, string>
    });

    readonly search = computed(() => this.queryParams()['search'] || '');
    readonly page = computed(() => +(this.queryParams()['page'] || 1));
    readonly gender = computed(() => this.queryParams()['gender'] || null);
    readonly sort = computed(() => this.queryParams()['sort'] || null);

    private readonly apiData$ = this.route.queryParams.pipe(
        debounceTime(300),
        distinctUntilChanged((p, c) => p['page'] === c['page'] && p['search'] === c['search']),
        tap(() => { this.isLoading.set(true); this.hasError.set(false); }),
        switchMap(params => this.swapiService.getPeople(+(params['page'] || 1), params['search'] || '')),
        catchError(() => {
            this.hasError.set(true);
            return of({ count: 0, results: [], next: null, previous: null } as ApiResponse<Person>);
        }),
        tap(() => this.isLoading.set(false))
    );

    readonly apiData = toSignal(this.apiData$, {
        initialValue: { count: 0, results: [], next: null, previous: null } as ApiResponse<Person>
    });

    readonly dataSource = computed(() => {
        let data = this.apiData().results;
        const g = this.gender();
        const s = this.sort();

        if (g && g !== 'all') data = data.filter(p => p.gender === g);
        if (s) data = [...data].sort((a, b) =>
            s === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        );
        return data;
    });

    readonly totalCount = computed(() => this.gender() ? this.dataSource().length : this.apiData().count);

    patchUrl(params: Record<string, any>) {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: params,
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }
}