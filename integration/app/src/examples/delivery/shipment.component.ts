import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Parcel } from './parcel';
import { SaveShipment, ShipmentState } from './shipment.state';

@Component({
    selector: 'app-shipment',
    templateUrl: './shipment.component.html'
})
export class ShipmentComponent implements OnInit {
    @Select(ShipmentState.parcel)
    public parcel$!: Observable<Parcel | undefined>;

    public readonly shipmentForm: FormGroup = new FormGroup({
        width: new FormControl('', Validators.required),
        length: new FormControl('', Validators.required),
        height: new FormControl('', Validators.required),
        description: new FormControl('')
    });

    constructor(private readonly _store: Store) {}

    public ngOnInit(): void {
        const parcel: Parcel | undefined = this._store.selectSnapshot(ShipmentState.parcel);

        if (parcel) {
            this.shipmentForm.patchValue({
                width: parcel.width,
                length: parcel.length,
                height: parcel.height
            });
        }

        const description: string = this._store.selectSnapshot(ShipmentState.description);

        this.shipmentForm.patchValue({ description });
    }

    public onSubmit(): void {
        if (this.shipmentForm.valid) {
            const parcel: Parcel = new Parcel(
                this.shipmentForm.value['width'],
                this.shipmentForm.value['length'],
                this.shipmentForm.value['height']
            );

            const description: string = this.shipmentForm.value['description'];

            this._store.dispatch(new SaveShipment(parcel, description));
        }
    }
}
