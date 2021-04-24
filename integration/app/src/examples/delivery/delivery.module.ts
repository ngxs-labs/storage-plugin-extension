import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AccountComponent } from './account.component';
import { DeliveryComponent } from './delivery.component';
import { ShipmentComponent } from './shipment.component';

@NgModule({
    declarations: [DeliveryComponent, ShipmentComponent, AccountComponent],
    imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild([{ path: '', component: DeliveryComponent }])]
})
export class DeliveryModule {}
