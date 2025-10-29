export class Signal<T> {
    value: T | undefined;
    subscribers: Set<Function> = new Set([]);
    unregisteredEffect: Function | null = null;

    constructor(_value: T | undefined = undefined) {
        this.value = _value;
    }
    
    effect(fn: Function) {
        this.unregisteredEffect = fn;
        fn();
        this.unregisteredEffect = null;
    }

    set(_value: T) {
        this.value = _value;
        this.subscribers.forEach(effect => effect());
    }

    get(): T | undefined {
        if (this.unregisteredEffect) {
            this.subscribers.add(this.unregisteredEffect);
        }
        return this.value;
    }
}
