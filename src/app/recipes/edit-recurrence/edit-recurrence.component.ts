import { Component,
         OnInit,
         OnChanges,
         SimpleChanges,
         Input,
         Output,
         EventEmitter,
         ChangeDetectionStrategy } from '@angular/core';
import { MdDialog } from '@angular/material';
import { FormGroup } from '@angular/forms';

import { Recipe, TimeBoundary } from '../../core/recipes-state/recipes-state.interface';
import { DataInfoDialog,
         EditRecurrenceDialogComponent } from '../edit-recurrence-dialog/edit-recurrence-dialog.component';

@Component({
  selector: 'app-edit-recurrence',
  templateUrl: './edit-recurrence.component.html',
  styleUrls: ['./edit-recurrence.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditRecurrenceComponent implements OnInit, OnChanges {

  @Input() recipe: Recipe;

  @Output() change = new EventEmitter<void>();

  private displayRecu = false;

  constructor(private dialog: MdDialog) { }

  ngOnInit() {
  }

  ngOnChanges(s: SimpleChanges) {
    const recipe: Recipe = s.recipe.currentValue;
    if (!recipe) { return; }
    this.displayRecu = this.isTimeBoundaryEmpty(recipe.recurrence) ? false : true;
  }

  openDialog() {
    const recurrence = this.recipe.recurrence;
    const data: DataInfoDialog = {
      recurrence: recurrence
    };
    const dialogRef = this.dialog.open(EditRecurrenceDialogComponent, {
      data: data
    });
    dialogRef.afterClosed().subscribe(this.handleDialogResult.bind(this));
  }

  private isTimeBoundaryEmpty(obj: TimeBoundary): boolean {
    return Object.keys(obj).length === 0 || (obj.max == null && obj.min  == null && obj.target == null);
  }

  private handleDialogResult(result: FormGroup): void {
    if (!result || !result.dirty) { return; }
    const value: DataInfoDialog = result.value;
    this.recipe.recurrence = value.recurrence; // deep copy ?
    this.change.emit(result.value);
  }
}
