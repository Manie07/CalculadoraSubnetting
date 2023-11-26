import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { Pagina1Component } from './componentes/pagina1/pagina1.component';
import { CalculadoraComponent } from './componentes/calculadora/calculadora.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'pagina1', component: Pagina1Component },
  { path: 'calculadora', component: CalculadoraComponent },
  //{ path: '**', component: PagenotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
