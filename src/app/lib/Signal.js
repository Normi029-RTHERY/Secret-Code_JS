export class Signal {
    value;
    subscribers = new Set([])
    unregisteredEffect = null;

    constructor(_value) {
        this.value = _value ?? undefined;
    }
    
    effect(fn) {
        this.unregisteredEffect = fn;
        fn();
        this.unregisteredEffect = null;
    }

    set(_value) {
        this.value = _value;
        this.subscribers.forEach(effect => effect());
    }

    get(_value) {
        if (this.unregisteredEffect) {
            this.subscribers.add(this.unregisteredEffect);
        }
        return this.value;
    }
}
