import { Component,
         OnInit,
         Input,
         Output,
         EventEmitter,
         ChangeDetectionStrategy } from '@angular/core';
import { MdDialog } from '@angular/material';
import { FormGroup } from '@angular/forms';

import { Recipe } from '../../core/recipes-state/recipes-state.interface';
import { DataInfoDialog,
         EditLinkDialogComponent } from '../edit-link-dialog/edit-link-dialog.component';

@Component({
  selector: 'app-edit-link',
  templateUrl: './edit-link.component.html',
  styleUrls: ['./edit-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditLinkComponent implements OnInit {

  @Input() recipe: Recipe;

  @Output() change = new EventEmitter<void>();

  constructor(private dialog: MdDialog) { }

  ngOnInit() {
  }

  openDialog() {
    const links = this.recipe.links;
    const data: DataInfoDialog = {
      links: links
    };
    const dialogRef = this.dialog.open(EditLinkDialogComponent, {
      data: data
    });
    dialogRef.afterClosed().subscribe(this.handleDialogResult.bind(this));
  }

  private handleDialogResult(result: FormGroup): void {
    if (!result || !result.dirty) { return; }
    const value: DataInfoDialog = result.value;
    this.recipe.links = value.links; // deep copy ?
    this.change.emit(result.value);
  }

}
