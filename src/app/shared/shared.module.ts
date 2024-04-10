import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsLayoutComponent } from './components/tabs-layout/tabs-layout.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [TabsLayoutComponent,],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [TabsLayoutComponent]
})
export class SharedModule { }
