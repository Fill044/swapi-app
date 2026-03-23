// src/app/features/people-list/people-list.ts
import { ChangeDetectionStrategy, Component, inject, signal, effect, ViewChild, ElementRef } from '@angular/core';
import { DatePipe, DOCUMENT } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

import { Person } from '../../core/models/swapi.model';
import { PeopleStoreService } from './people-store.service';
import { PersonDetailsDialog } from '../person-details-dialog/person-details-dialog';

@Component({
  selector: 'app-people-list',
  standalone: true,
  providers: [PeopleStoreService],
  imports: [
    DatePipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatDialogModule
  ],
  animations: [
    trigger('tableStagger', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(15px)' }),
          stagger('50ms', [
            animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ],
  templateUrl: './people-list.html',
  styleUrl: './people-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleList {
  readonly store = inject(PeopleStoreService);
  private readonly document = inject(DOCUMENT);
  private readonly dialog = inject(MatDialog);

  readonly isDarkMode = signal(localStorage.getItem('theme') !== 'light');

  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

  displayedColumns = ['name', 'gender', 'species', 'birth_year', 'height', 'mass', 'homeworld', 'created'];

  constructor() {
    effect(() => {
      const dark = this.isDarkMode();
      localStorage.setItem('theme', dark ? 'dark' : 'light');
      this.document.body.classList.toggle('dark-theme', dark);
      this.document.body.classList.toggle('light-theme', !dark);
    });
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
  }

  openPersonDetails(person: Person) {
    if (window.getSelection()?.toString()) return;
    this.dialog.open(PersonDetailsDialog, {
      data: { person },
      width: '400px',
      panelClass: this.isDarkMode() ? 'dark-theme' : 'light-theme'
    });
  }
}