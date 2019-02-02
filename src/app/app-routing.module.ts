import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: ':t',
    loadChildren: './components/search-results/search-results.module#SearchResultsModule'
  },
  {
    path: ':t/:lucky',
    loadChildren: './components/search-results/search-results.module#SearchResultsModule'
  },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
