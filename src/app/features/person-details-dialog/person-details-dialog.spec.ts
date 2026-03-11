import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { PersonDetailsDialog } from './person-details-dialog';

describe('PersonDetailsDialog', () => {
  let component: PersonDetailsDialog;
  let fixture: ComponentFixture<PersonDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonDetailsDialog, MatDialogModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { person: { name: 'Luke', gender: 'male', birth_year: '19BBY', height: '172', mass: '77', homeworld: 'Tatooine', created: '', edited: '', species: [], films: [] } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
