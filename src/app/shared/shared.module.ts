import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsLayoutComponent } from './components/tabs-layout/tabs-layout.component';
import { IonicModule } from '@ionic/angular';
import { FilterModalComponent } from './components/filter-modal/filter-modal.component';

@NgModule({
  declarations: [TabsLayoutComponent, FilterModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [TabsLayoutComponent, FilterModalComponent]
})
export class SharedModule { }
