import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { Parcel } from './parcel';

export interface ShipmentStateModel {
    parcel?: Parcel;
    description: string;
}

export class SaveShipment {
    public static readonly type: string = '[SHIPMENT] Save Shipment';

    constructor(public parcel: Parcel, public description: string) {}
}

@State<ShipmentStateModel>({
    name: 'shipment'
})
@Injectable()
export class ShipmentState {
    @Selector()
    public static parcel(state: ShipmentStateModel): Parcel | undefined {
        return state.parcel;
    }

    @Selector()
    public static description(state: ShipmentStateModel): string {
        return state.description;
    }

    @Action(SaveShipment)
    public saveShipment(context: StateContext<ShipmentStateModel>, action: SaveShipment): void {
        context.setState({
            parcel: action.parcel,
            description: action.description
        });
    }
}
