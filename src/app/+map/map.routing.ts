import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, MapGuard } from 'app/core/guards/auth.guard';
import { MapComponent } from './map.component';
export const routes: Routes = [
    { path: '', component: MapComponent },
];

export const routing = RouterModule.forChild(routes);
