import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { Parcel } from './parcel';

export interface DeliveryStateModel {
    parcel?: Parcel;
    description: string;
}

export class RegisterDelivery {
    public static readonly type: string = '[DELIVERY] Register Delivery';

    constructor(public parcel: Parcel, public description: string) {}
}

@State<DeliveryStateModel>({
    name: 'delivery'
})
@Injectable()
export class DeliveryState {
    @Selector()
    public static parcel(state: DeliveryStateModel): Parcel | undefined {
        return state.parcel;
    }

    @Selector()
    public static description(state: DeliveryStateModel): string {
        return state.description;
    }

    @Action(RegisterDelivery)
    public registerDelivery(context: StateContext<DeliveryStateModel>, action: RegisterDelivery): void {
        context.setState({
            parcel: action.parcel,
            description: action.description
        });
    }
}
