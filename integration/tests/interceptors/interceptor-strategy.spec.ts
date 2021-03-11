import { Injectable } from "@angular/core";
import { TestBed } from "@angular/core/testing";

import { Action, NgxsModule, State, StateContext, Store } from "@ngxs/store";
import { NgxsStoragePluginModule } from "@ngxs/storage-plugin";
import { InterceptorStrategy } from "@ngxs-labs/storage-plugin-extension";

import { DEFAULT_STATE_KEY } from "../../../lib/src/internals/internals";

describe("InterceptorStrategy", () => {
    class Increment {
        static type = "INCREMENT";
    }

    class Decrement {
        static type = "DECREMENT";
    }

    interface CounterStateModel {
        count: number;
    }

    @State<CounterStateModel>({
        name: "counter",
        defaults: { count: 0 },
    })
    @Injectable()
    class CounterState {
        @Action(Increment)
        increment({ getState, setState }: StateContext<CounterStateModel>) {
            setState({
                count: getState().count + 1,
            });
        }

        @Action(Decrement)
        decrement({ getState, setState }: StateContext<CounterStateModel>) {
            setState({
                count: getState().count - 1,
            });
        }
    }

    class Rotate {
        static type = "ROTATE";

        constructor(public value: number) {}
    }

    interface EffectStateModel {
        angle: number;
    }

    @State<EffectStateModel>({
        name: "effect",
        defaults: { angle: 0 },
    })
    @Injectable()
    class EffectState {
        @Action(Rotate)
        increment({ getState, setState }: StateContext<EffectStateModel>, action: Rotate) {
            setState({
                angle: getState().angle + action.value,
            });
        }
    }

    class CounterInfoStateModel {
        constructor(public count: number) {}
    }

    @State<CounterInfoStateModel>({
        name: "counterInfo",
        defaults: { count: 0 },
    })
    @Injectable()
    class CounterInfoState {}

    it("should alter object before serialization when using default state.", () => {
        // Arrange
        localStorage.setItem(
            DEFAULT_STATE_KEY,
            JSON.stringify({
                counter: { count: 100 },
            })
        );

        const strategy = new InterceptorStrategy([
            {
                onBeforeSerialize: (obj) => {
                    return {
                        counter: {
                            count: obj.counter.count * 2,
                        },
                    };
                },
            },
        ]);

        // Act
        TestBed.configureTestingModule({
            imports: [NgxsModule.forRoot([CounterState]), NgxsStoragePluginModule.forRoot(strategy.configure({}))],
        });

        const store: Store = TestBed.get(Store);

        store.dispatch(new Increment());

        const state: CounterStateModel = store.selectSnapshot(CounterState);

        // Assert
        expect(state.count).toBe(101);
        expect(localStorage.getItem(DEFAULT_STATE_KEY)).toBe(JSON.stringify({ counter: { count: 202 } }));
    });

    it("should alter object before serialization when using key state.", () => {
        // Arrange
        localStorage.setItem("counter", JSON.stringify({ count: 100 }));
        localStorage.setItem("effect", JSON.stringify({ angle: 0 }));

        const strategy = new InterceptorStrategy([
            {
                key: "counter",
                onBeforeSerialize: (obj) => {
                    return {
                        count: obj.count * 2,
                    };
                },
            },
            {
                key: "effect",
                onBeforeSerialize: (obj) => {
                    return {
                        angle: obj.angle + 10,
                    };
                },
            },
        ]);

        // Act
        TestBed.configureTestingModule({
            imports: [
                NgxsModule.forRoot([CounterState, EffectState]),
                NgxsStoragePluginModule.forRoot(
                    strategy.configure({
                        key: ["counter", "effect"],
                    })
                ),
            ],
        });

        const store: Store = TestBed.get(Store);

        store.dispatch(new Increment());
        store.dispatch(new Rotate(90));

        const counterState: CounterStateModel = store.selectSnapshot(CounterState);
        const effectState: EffectStateModel = store.selectSnapshot(EffectState);

        // Assert
        expect(counterState.count).toBe(101);
        expect(effectState.angle).toBe(90);
        expect(localStorage.getItem("counter")).toBe(JSON.stringify({ count: 202 }));
        expect(localStorage.getItem("effect")).toBe(JSON.stringify({ angle: 100 }));
    });

    it("should alter state and return concrete type after deserialization when using key state.", () => {
        // Arrange
        localStorage.setItem("counterInfo", JSON.stringify({ count: 100 }));

        const strategy = new InterceptorStrategy([
            {
                key: "counterInfo",
                onAfterDeserialize: (obj) => new CounterInfoStateModel(obj.count),
            },
        ]);

        // Act
        TestBed.configureTestingModule({
            imports: [
                NgxsModule.forRoot([CounterInfoState]),
                NgxsStoragePluginModule.forRoot(
                    strategy.configure({
                        key: "counterInfo",
                    })
                ),
            ],
        });

        const store: Store = TestBed.get(Store);
        const state: CounterInfoStateModel = store.selectSnapshot(CounterInfoState);

        // Assert
        expect(state).toBeInstanceOf(CounterInfoStateModel);
        expect(state.count).toBe(100);
    });
});
