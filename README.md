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
on the Storage Plugin configuration. It allows you to define an array of configuration options to
be executed on specific states.

### Quick Links

-   😎 Checkout the [sample application](./integration)
-   📝 Learn about updates from the [changelog](CHANGELOG.md)

### Delivery example

In this example we use the <code>InterceptorStrategy</code> class to configure
pre-serialization/post-deserialization interceptors within the @ngxs-labs/storage-plugin. The pre-serialization
interceptor keeps the width, length and height for a parcel but excludes the description from being serialized. The
post-serialization interceptor instantiates the <code>ShipmentStateModel</code> and the
<code>AccountStateModel</code> concrete classes.

`parcel.ts`

```ts
export class Parcel {
    constructor(public width: number, public height: number, public length: number) {}

    public get volume(): number {
        return this.width * this.length * this.height;
    }
}
```

`shipment.state.ts`

```ts
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
```

`account.ts`

```ts
export class Account {
    constructor(public number: string) {}

    public get status(): string {
        return this.number ? 'valid' : 'invalid';
    }
}
```

`account.state.ts`

```ts
export interface AccountStateModel {
    account?: Account;
}

export class SaveAccount {
    public static readonly type: string = '[ACCOUNT] Save Account';

    constructor(public account: Account) {}
}

@State<AccountStateModel>({
    name: 'account'
})
@Injectable()
export class AccountState {
    @Selector()
    public static account(state: AccountStateModel): Account | undefined {
        return state.account;
    }

    @Action(SaveAccount)
    public saveAccount(context: StateContext<AccountStateModel>, action: SaveAccount): void {
        context.setState({
            account: action.account
        });
    }
}
```

`configuration.ts`

```ts
export const strategy: InterceptorStrategy = new InterceptorStrategy([
    {
        key: 'shipment',
        onBeforeSerialize: (obj: any): any => ({
            parcel: obj.parcel
        }),
        onAfterDeserialize: (obj: any): ShipmentStateModel =>
            ({
                parcel: obj.parcel ? new Parcel(obj.parcel.width, obj.parcel.height, obj.parcel.length) : null,
                description: obj.description
            } as ShipmentStateModel)
    },
    {
        key: 'account',
        onAfterDeserialize: (obj: any): AccountStateModel =>
            ({
                account: obj.account ? new Account(obj.account.number) : null
            } as AccountStateModel)
    }
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
        NgxsModule.forRoot([ShipmentState, AccountState], {
            developmentMode: !environment.production
        }),
        NgxsStoragePluginModule.forRoot(
            strategy.configure({
                key: [ShipmentState, AccountState]
            })
        ),
        NgxsLoggerPluginModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
```
