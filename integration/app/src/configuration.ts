import { InterceptorStrategy } from '@ngxs-labs/storage-plugin-extension';

import { AccountStateModel } from './examples/delivery/account.state';
import { ShipmentStateModel } from './examples/delivery/shipment.state';
import { Parcel } from './examples/delivery/parcel';
import { Account } from './examples/delivery/account';

export const strategy: InterceptorStrategy = new InterceptorStrategy([
    {
        key: 'shipment',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onBeforeSerialize: (obj: any): any => ({
            parcel: obj.parcel
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onAfterDeserialize: (obj: any): ShipmentStateModel =>
            ({
                parcel: obj.parcel ? new Parcel(obj.parcel.width, obj.parcel.height, obj.parcel.length) : null,
                description: obj.description
            } as ShipmentStateModel)
    },
    {
        key: 'account',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onAfterDeserialize: (obj: any): AccountStateModel =>
            ({
                account: obj.account ? new Account(obj.account.number) : null
            } as AccountStateModel)
    }
]);
