import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarkdownComponent } from './markdown/markdown.component';

const routes: Routes = [
  {path: 'markdown', component: MarkdownComponent},
  {path: '', pathMatch: 'full', redirectTo: 'markdown'},
  {path: '**', pathMatch: 'full', redirectTo: 'markdown'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
