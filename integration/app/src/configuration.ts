import { InterceptorStrategy } from '@ngxs-labs/storage-plugin-extension';

import { DeliveryStateModel } from './examples/delivery/delivery.state';
import { Parcel } from './examples/delivery/parcel';

export const strategy: InterceptorStrategy = new InterceptorStrategy([
    {
        key: 'delivery',
        onBeforeSerialize: (obj: any): any => ({
            parcel: obj.parcel
        }),
        onAfterDeserialize: (obj: any): DeliveryStateModel =>
            ({
                parcel: obj.parcel ? new Parcel(obj.parcel.width, obj.parcel.height, obj.parcel.length) : null,
                description: obj.description
            } as DeliveryStateModel)
    }
]);
