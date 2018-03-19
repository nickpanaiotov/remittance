import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {AliceComponent} from './alice/alice.component';
import {CarolComponent} from './carol/carol.component';
import {HomeComponent} from './home/home.component';


const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'alice', component: AliceComponent},
  {path: 'carol', component: CarolComponent},
];


export const AppRoutingProviders: any[] = [];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});
