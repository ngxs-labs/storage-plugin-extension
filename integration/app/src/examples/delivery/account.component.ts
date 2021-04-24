import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Account } from './account';
import { AccountState, SaveAccount } from './account.state';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {
    @Select(AccountState.account)
    public account$!: Observable<Account | undefined>;

    public readonly accountForm: FormGroup = new FormGroup({
        number: new FormControl('', Validators.required)
    });

    constructor(private readonly _store: Store) {}

    public ngOnInit(): void {
        const account: Account | undefined = this._store.selectSnapshot(AccountState.account);

        if (account) {
            this.accountForm.setValue({
                number: account.number
            });
        }
    }

    public onSubmit(): void {
        if (this.accountForm.valid) {
            const account: Account = new Account(this.accountForm.value['number']);
            this._store.dispatch(new SaveAccount(account));
        }
    }
}
