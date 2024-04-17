import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent  {

  @Input() task: any; // Input property to receive task data
  selectedTaskList!: string;
  selectedPriority!: string;
  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }

  applyFilters() {
    // Implement filter logic here
    this.modalController.dismiss();
  }

}
