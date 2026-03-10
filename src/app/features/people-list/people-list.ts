import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SwapiService } from '../../core/services/swapi.service';
import { ApiResponse, Person } from '../../core/models/swapi.model';

// Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [
    DatePipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
    MatFormFieldModule
  ],
  templateUrl: './people-list.html',
  styleUrl: './people-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleList {
  private readonly swapiService = inject(SwapiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Loading state & Error state
  readonly isLoading = signal<boolean>(false);
  readonly hasError = signal<boolean>(false);

  displayedColumns: string[] = ['name', 'gender', 'birth_year', 'height', 'mass', 'homeworld', 'created'];

  readonly queryParams = toSignal(this.route.queryParams, { initialValue: {} as Record<string, string> });
  readonly currentRoutePage = computed(() => +(this.queryParams()['page'] || 1));

  // We keep Gender and Sort criteria as local signals (since SWAPI doesn't support them server-side)
  readonly selectedGender = signal<string | null>(null);
  readonly sortDirection = signal<'asc' | 'desc' | null>(null);

  // The main reactive pipeline that listens to URL changes
  private readonly apiData$ = this.route.queryParams.pipe(
    debounceTime(300),
    distinctUntilChanged((prev, curr) => prev['page'] === curr['page'] && prev['search'] === curr['search']),
    tap(() => {
      this.isLoading.set(true);
      this.hasError.set(false);
    }),
    switchMap(params => {
      const page = +params['page'] || 1;
      const search = params['search'] || '';

      return this.swapiService.getPeople(page, search).pipe(
        catchError(() => {
          this.hasError.set(true);
          return of({ count: 0, next: null, previous: null, results: [] } as ApiResponse<Person>);
        })
      );
    }),
    tap(() => this.isLoading.set(false))
  );

  // Convert the pipeline to a Signal with an initial value
  readonly apiData = toSignal(this.apiData$, {
    initialValue: { count: 0, next: null, previous: null, results: [] } as ApiResponse<Person>
  });

  // Client-side filtering & sorting
  readonly dataSource = computed(() => {
    let data = this.apiData().results;

    // 1. Gender filtering
    const gender = this.selectedGender();
    if (gender && gender !== 'all') {
      data = data.filter(person => person.gender === gender);
    }

    // 2. Client-side sorting by name
    const sort = this.sortDirection();
    if (sort) {
      data = [...data].sort((a, b) => {
        const res = a.name.localeCompare(b.name);
        return sort === 'asc' ? res : -res;
      });
    }

    return data;
  });

  readonly paginatorLength = computed(() => {
    return this.selectedGender() ? this.dataSource().length : this.apiData().count;
  });

  // Actions for modifying URL
  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onSearchChange(value);
  }

  onSearchChange(newSearch: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: newSearch || null, page: 1 },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  onPaginationChange(event: PageEvent) {
    this.onPageChange(event.pageIndex + 1);
  }

  onPageChange(newPage: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: newPage },
      queryParamsHandling: 'merge'
    });
  }

  // Client-side actions
  onGenderChange(gender: string) {
    this.selectedGender.set(gender);
  }

  onSortChange(sortState: Sort) {
    this.sortDirection.set((sortState.direction as 'asc' | 'desc') || null);
  }

  resetFilters() {
    this.selectedGender.set(null);
    this.sortDirection.set(null);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: null, page: 1 },
      queryParamsHandling: 'merge'
    });
  }
}
