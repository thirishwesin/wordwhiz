import { Subject } from "rxjs";

const Store = require('electron-store');

class ElectronStore{
    private static _instance: ElectronStore;
    private subject: Subject<any>;
    private static store: typeof Store;

    private constructor() {};

    public static get Instance(): ElectronStore {
        if(!this._instance){
            this._instance = new ElectronStore();
            ElectronStore.store = new Store({
                watch: true,
                name: 'state',
                accessPropertiesByDotNotation: true
            });
        }
        return this._instance;
    }

    public listenDataChange(): Subject<any> {
        if(!this.subject) {
            this.subject = new Subject();
        }
        const unsubscribe = ElectronStore.store.onDidAnyChange((newValue, oldValue) => {
            let valueObj = {
                newValue, oldValue, unsubscribe
            }
            this.subject.next(valueObj);
        })
        return this.subject;
    }

    public set(value: Partial<Object>) {
        ElectronStore.store.set(value);
    }

    public setItemWithKey(key: string, value: any) : void {
        ElectronStore.store.set(key, value);
    }

    public get(key: string) : any {
        return ElectronStore.store.get(key);
    }

    public getWithDefaultValue(key: string, value: any) {
        return ElectronStore.store.get(key, value)
    }
}

export { ElectronStore }