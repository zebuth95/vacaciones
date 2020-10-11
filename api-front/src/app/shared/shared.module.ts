import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//shared
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
//added
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [ HeaderComponent, SidebarComponent],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
     HeaderComponent, SidebarComponent
  ]
})
export class SharedModule { }
