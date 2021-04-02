export class Parcel {
    constructor(public width: number, public height: number, public length: number) {}

    public get volume(): number {
        return this.width * this.length * this.height;
    }
}
