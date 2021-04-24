import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { Account } from './account';

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
