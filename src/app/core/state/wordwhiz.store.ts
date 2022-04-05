import { Observable, Subject } from 'rxjs';
import { ElectronStore } from './electron.store';

class WordWhizStore {
    private static _instance: WordWhizStore;

    private constructor(){}

    public static get Instance() {
        if(this._instance == null || this._instance == undefined) {
            this._instance = new WordWhizStore();
        }
        return this._instance;
    }

    public initData(data: any) {
        ElectronStore.Instance.set(data);
    }

    public getItem(key: string, defaultValue?: any) {
        if(defaultValue) {
           return ElectronStore.Instance.getWithDefaultValue(key, defaultValue);
        }else {
           return ElectronStore.Instance.get(key)
        }
    }

    public setItemWithKey(key: string, value: any) {
        ElectronStore.Instance.setItemWithKey(key, value);
    }

    public setItem(value: Partial<Object>) {
        ElectronStore.Instance.set(value);
    }

    public onAnyDataChange() : Subject<any>{
       return ElectronStore.Instance.listenDataChange();
    }
}

export { WordWhizStore }