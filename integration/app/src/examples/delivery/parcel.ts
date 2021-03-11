export class Parcel {
    constructor(public width: number, public height: number, public length: number) {}

    get volume(): number {
        return this.width * this.length * this.height;
    }
}
