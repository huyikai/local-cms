class Storage {
  storage: any;
  constructor(config: string) {
    this.storage = {
      local: window.localStorage,
      session: window.sessionStorage
    }[config];
  }
  public set(key: string, val: any) {
    this.storage.setItem(key, JSON.stringify(val));
  }
  public get(key: string) {
    return JSON.parse(this.storage.getItem(key));
  }
  public remove(key: string) {
    this.storage.removeItem(key);
  }
  public clear() {
    this.storage.clear();
  }
}
export const local = new Storage('local');
export const session = new Storage('session');
