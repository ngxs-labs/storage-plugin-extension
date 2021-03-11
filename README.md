<p align="center">
  <img src="https://raw.githubusercontent.com/ngxs/store/master/docs/assets/logo.png">
  <br />
  <b>NGXS Storage Plugin Extension API (@ngxs-labs/storage-plugin-extension)</b> <br />
  <br />
</p>

<p align="center">

</p>

---

## Introduction

NGXS Storage Plugin Extension API is a collection of extensions for the NGXS Storage Plugin.

### InterceptorStrategy

The interceptor strategy is a convenient way to configure the before and after serialization properties
on the Storage Plugin configuration.

### Quick Links

-   😎 Checkout the [sample application](./integration)
-   📝 Learn about updates from the [changelog](CHANGELOG.md)

### Simple example

In this example we use the <code>InterceptorStrategy</code> class to configure
pre-serialization/post-deserialization interceptors within the @ngxs-labs/storage-plugin. The pre-serialization
interceptor keeps the width, length and height for a parcel but excludes the description from being serialized. The
post-serialization interceptor instantiates a <code>DeliveryStateModel</code> concrete class.

`parcel.ts`

```ts
export class Parcel {
    constructor(public width: number, public height: number, public length: number) {}

    get volume(): number {
        return this.width * this.length * this.height;
    }
}
```

`delivery.state.ts`

```ts
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
```

`configuration.ts`

```ts
export const strategy = new InterceptorStrategy([
    {
        key: "delivery",
        onBeforeSerialize: (obj) => {
            return {
                parcel: obj.parcel,
            };
        },
        onAfterDeserialize: (obj) => {
            return {
                parcel: obj.parcel ? new Parcel(obj.parcel.width, obj.parcel.height, obj.parcel.length) : null,
                description: obj.description,
            } as DeliveryStateModel;
        },
    },
]);
```

`app.module.ts`

```ts
@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        NgxsModule.forRoot([DeliveryState]),
        NgxsStoragePluginModule.forRoot(
            strategy.configure({
                key: DeliveryState,
            })
        )
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
```
