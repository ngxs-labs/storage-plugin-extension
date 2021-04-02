import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { DeliveryState, RegisterDelivery } from './delivery.state';
import { Parcel } from './parcel';

@Component({
    selector: 'app-delivery',
    templateUrl: './delivery.component.html',
    styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {
    @Select(DeliveryState.parcel)
    public parcel$!: Observable<Parcel | undefined>;

    public readonly deliveryForm: FormGroup = new FormGroup({
        width: new FormControl('', Validators.required),
        length: new FormControl('', Validators.required),
        height: new FormControl('', Validators.required),
        description: new FormControl('')
    });

    constructor(private readonly _store: Store) {}

    public ngOnInit(): void {
        const parcel: Parcel | undefined = this._store.selectSnapshot(DeliveryState.parcel);

        if (parcel) {
            this.deliveryForm.patchValue({
                width: parcel.width,
                length: parcel.length,
                height: parcel.height
            });
        }

        const description: string = this._store.selectSnapshot(DeliveryState.description);

        this.deliveryForm.patchValue({ description });
    }

    public onSubmit(): void {
        if (this.deliveryForm.valid) {
            const parcel: Parcel = new Parcel(
                this.deliveryForm.value['width'],
                this.deliveryForm.value['length'],
                this.deliveryForm.value['height']
            );

            const description: string = this.deliveryForm.value['description'];

            this._store.dispatch(new RegisterDelivery(parcel, description));
        }
    }
}
