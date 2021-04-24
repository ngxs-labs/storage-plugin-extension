export class Account {
    constructor(public number: string) {}

    public get status(): string {
        return this.number ? 'valid' : 'invalid';
    }
}
