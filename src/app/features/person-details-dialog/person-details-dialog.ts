import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Person } from '../../core/models/swapi.model';

@Component({
  selector: 'app-person-details-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatListModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      {{ data.person.name }}
    </h2>
    <mat-dialog-content class="dialog-content">
      <div class="character-info">
        <p><strong>Birth Year:</strong> {{ data.person.birth_year }}</p>
        <p><strong>Gender:</strong> <span class="gender-value">{{ data.person.gender }}</span></p>
      </div>

      <h3 class="movies-title">Movies Appeared In</h3>
      
      @if (data.person.films && data.person.films.length > 0) {
        <mat-list>
          @for (film of data.person.films; track film) {
            <mat-list-item>
              <mat-icon matListItemIcon>movie</mat-icon>
              <!-- To fully resolve film objects, another SWAPI endpoint call would be needed.
                   For demonstration of the UI generic pattern we display the given URLs. -->
              <span matListItemTitle class="film-url">Film Database Ref: {{ extractFilmId(film) }}</span>
            </mat-list-item>
          }
        </mat-list>
      } @else {
        <p class="no-movies">No known movie appearances.</p>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-stroked-button mat-dialog-close class="close-btn">Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.8rem;
      color: var(--accent-color);
      letter-spacing: 1px;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      text-shadow: 0 0 5px var(--accent-glow, rgba(0, 212, 255, 0.3));
    }
    .dialog-content {
      color: var(--text-primary);
    }
    .character-info {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
      
      p {
        margin: 0.5rem 0;
        font-size: 1rem;
      }
      .gender-value {
        text-transform: capitalize;
      }
    }
    .movies-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.2rem;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }
    mat-list-item {
      color: var(--text-primary);
    }
    mat-icon {
      color: var(--accent-color);
    }
    .film-url {
      font-size: 0.9rem;
      opacity: 0.9;
    }
    .no-movies {
      color: var(--text-secondary);
      font-style: italic;
    }
    .close-btn {
      color: var(--accent-color) !important;
      border-color: var(--accent-color) !important;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: var(--hover-bg, rgba(0, 212, 255, 0.1));
      }
    }
  `]
})
export class PersonDetailsDialog {
  readonly data: { person: Person } = inject(MAT_DIALOG_DATA);

  // Helper to visually tidy up film URLs and display just their id part
  extractFilmId(url: string): string {
    const parts = url.split('/').filter(p => p.length > 0);
    return 'Episode ' + parts[parts.length - 1];
  }
}
