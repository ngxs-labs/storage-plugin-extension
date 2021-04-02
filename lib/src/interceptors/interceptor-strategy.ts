/* eslint-disable @typescript-eslint/no-explicit-any */

import { NgxsStoragePluginOptions } from '@ngxs/storage-plugin';

import { DEFAULT_STATE_KEY } from '../internals/internals';
import { InterceptorOption } from './interceptor-option';

export class InterceptorStrategy {
    constructor(private readonly _options: InterceptorOption[]) {}

    public configure(options: NgxsStoragePluginOptions): NgxsStoragePluginOptions {
        options.beforeSerialize = (obj: any, key: string): any => this._beforeSerialize(obj, key);
        options.afterDeserialize = (obj: any, key: string): any => this._afterDeserialize(obj, key);

        return options;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    protected _beforeSerialize(obj: any, key: string): any {
        return this._executeStrategy(
            obj,
            key,
            (option: InterceptorOption): ((obj: any) => any) | undefined => option.onBeforeSerialize
        );
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    protected _afterDeserialize(obj: any, key: string): any {
        return this._executeStrategy(
            obj,
            key,
            (option: InterceptorOption): ((obj: any) => any) | undefined => option.onAfterDeserialize
        );
    }

    private _executeStrategy(
        obj: any,
        key: string,
        func: (option: InterceptorOption) => ((obj: any) => any) | undefined
    ): void {
        const strategy: InterceptorOption | undefined = this._findStrategy(key);

        if (strategy) {
            const prototype: ((obj: any) => any) | undefined = func(strategy);

            if (prototype) {
                return prototype(obj);
            }
        }

        return obj;
    }

    private _findStrategy(key: string): InterceptorOption | undefined {
        return this._options.find(
            (strategy: InterceptorOption): boolean =>
                (!strategy.key && key === DEFAULT_STATE_KEY) || strategy.key === key
        );
    }
}
