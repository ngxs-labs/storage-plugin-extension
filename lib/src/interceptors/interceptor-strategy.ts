import { NgxsStoragePluginOptions } from "@ngxs/storage-plugin";

import { DEFAULT_STATE_KEY } from "../internals/internals";
import { InterceptorOption } from "./interceptor-option";

export class InterceptorStrategy {
    constructor(private _options: InterceptorOption[]) {}

    configure(options: NgxsStoragePluginOptions): NgxsStoragePluginOptions {
        options.beforeSerialize = (obj: any, key: string) => this._beforeSerialize(obj, key);
        options.afterDeserialize = (obj: any, key: string) => this._afterDeserialize(obj, key);

        return options;
    }

    protected _beforeSerialize(obj: any, key: string): any {
        return this._executeStrategy(obj, key, (option) => option.onBeforeSerialize);
    }

    protected _afterDeserialize(obj: any, key: string): any {
        return this._executeStrategy(obj, key, (option) => option.onAfterDeserialize);
    }

    private _executeStrategy(
        obj: any,
        key: string,
        func: (option: InterceptorOption) => ((obj: any) => any) | undefined
    ) {
        const strategy = this._findStrategy(key);

        if (strategy) {
            const prototype = func(strategy);

            if (prototype) {
                return prototype(obj);
            }
        }

        return obj;
    }

    private _findStrategy(key: string): InterceptorOption | undefined {
        return this._options.find((strategy) => (!strategy.key && key === DEFAULT_STATE_KEY) || strategy.key === key);
    }
}
