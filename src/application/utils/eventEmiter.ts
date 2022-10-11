type listener = {
    once: boolean;
    callback: Function;
}
type EventType = string;
type callback = Function;
export class EventEmiter {
    private listeners: Map<EventType, listener[]> = new Map();
    on(type: EventType, fn: callback) {
        return this._addCallback(type, fn, false);
    }

    once(eventType: EventType, fn: callback) {
        return this._addCallback(eventType, fn, true);
    }

    emit(eventType: EventType, ...args: unknown[]) {
        const callbacks = this.listeners.get(eventType);
        if(callbacks && callbacks.length){
            const cloneCallbacks = callbacks.slice(0);
            cloneCallbacks.forEach((c: listener, idx: number) => {
                c.callback(...args);
                if (c.once) {
                    callbacks.splice(idx, 1);
                }
            })
        }
        return this;
    }

    off(eventType: EventType, callback: callback) {
        const callbacks = this.listeners.get(eventType);
        if (callbacks && callbacks.length) {
            const targetIndex = callbacks.findIndex( c => c.callback === callback);
            if (targetIndex !== -1) {
                callbacks.splice(1, targetIndex);
            }
        }
    }

    private _addCallback(eventType: EventType, fn: callback, once: boolean) {
        if (!this.listeners.get(eventType)) {
            this.listeners.set(eventType, []);
        }
        const callbacks = this.listeners.get(eventType) as listener[];
        const filters = callbacks.filter( listener => listener.callback === fn );
        if (!filters.length) {
            callbacks.push({
                callback: fn,
                once
            })
        }
        return this;
    }
}