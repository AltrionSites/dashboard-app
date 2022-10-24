import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidateTokenGuard } from './shared/guards/guards/validate-token.guard';
import { DashboardComponent } from './shared/pages/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [ValidateTokenGuard],
    component: DashboardComponent,
    children:[
      {
        path: '',
        redirectTo: 'index',
        pathMatch: 'full',
      },
      {
        path: 'management',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtectedRoutingModule { }
