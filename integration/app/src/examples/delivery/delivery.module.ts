import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { DeliveryComponent } from "./delivery.component";

@NgModule({
    declarations: [DeliveryComponent],
    imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild([{ path: "", component: DeliveryComponent }])],
})
export class DeliveryModule {}
