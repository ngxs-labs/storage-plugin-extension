import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                redirectTo: 'package',
                pathMatch: 'full'
            },
            {
                path: 'package',
                loadChildren: () => import('./examples/delivery/delivery.module').then((m: any) => m.DeliveryModule)
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
