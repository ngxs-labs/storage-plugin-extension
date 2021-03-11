import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { Select, Store } from "@ngxs/store";

import { Observable } from "rxjs";

import { Parcel } from "./parcel";
import { DeliveryState, RegisterDelivery } from "./delivery.state";

@Component({
    templateUrl: "./delivery.component.html",
    styleUrls: ["./delivery.component.scss"],
})
export class DeliveryComponent implements OnInit {
    constructor(private _store: Store) {}

    @Select(DeliveryState.parcel)
    parcel$!: Observable<Parcel | undefined>;

    readonly deliveryForm = new FormGroup({
        width: new FormControl("", Validators.required),
        length: new FormControl("", Validators.required),
        height: new FormControl("", Validators.required),
        description: new FormControl(""),
    });

    ngOnInit() {
        const parcel = this._store.selectSnapshot(DeliveryState.parcel);

        if (parcel) {
            this.deliveryForm.patchValue({
                width: parcel.width,
                length: parcel.length,
                height: parcel.height,
            });
        }

        const description = this._store.selectSnapshot(DeliveryState.description);

        this.deliveryForm.patchValue({ description: description });
    }

    onSubmit() {
        if (this.deliveryForm.valid) {
            const parcel = new Parcel(
                this.deliveryForm.value["width"],
                this.deliveryForm.value["length"],
                this.deliveryForm.value["height"]
            );

            const description = this.deliveryForm.value["description"];

            this._store.dispatch(new RegisterDelivery(parcel, description));
        }
    }
}
