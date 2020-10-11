import { NgModule } from '@angular/core';
import { MatTableModule} from '@angular/material/table';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule} from '@angular/material/input';
import { MatIconModule} from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTreeModule } from '@angular/material/tree';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';

const MaterialComponents = [
  MatExpansionModule,
  MatSelectModule,
  MatMomentDateModule,
  MatDatepickerModule,
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatSidenavModule,
  MatDividerModule,
  MatToolbarModule,
  MatButtonModule,
  FlexLayoutModule,
  MatMenuModule,
  MatListModule,
  RouterModule,
  MatCardModule,
  MatPaginatorModule,
  MatTabsModule,
  MatTreeModule
];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }
