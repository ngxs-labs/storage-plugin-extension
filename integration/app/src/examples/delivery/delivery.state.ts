import { Injectable } from "@angular/core";

import { Action, Selector, State, StateContext } from "@ngxs/store";

import { Parcel } from "./parcel";

export interface DeliveryStateModel {
    parcel?: Parcel;
    description: string;
}

export class RegisterDelivery {
    static readonly type = "[DELIVERY] Register Delivery";

    constructor(public parcel: Parcel, public description: string) {}
}

@State<DeliveryStateModel>({
    name: "delivery",
})
@Injectable()
export class DeliveryState {
    @Selector()
    static parcel(state: DeliveryStateModel): Parcel | undefined {
        return state.parcel;
    }

    @Selector()
    static description(state: DeliveryStateModel): string {
        return state.description;
    }

    @Action(RegisterDelivery)
    registerDelivery(context: StateContext<DeliveryStateModel>, action: RegisterDelivery) {
        context.setState({
            parcel: action.parcel,
            description: action.description,
        });
    }
}
