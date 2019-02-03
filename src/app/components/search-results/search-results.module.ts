import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SearchResultsComponent } from './search-results.component';
import { TracksListComponent } from '../tracks-list/tracks-list.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [SearchResultsComponent, TracksListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: SearchResultsComponent }]),
    FontAwesomeModule
  ]
})
export class SearchResultsModule {}
