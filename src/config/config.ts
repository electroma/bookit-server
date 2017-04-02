import * as nodeConfig from 'config';
import {ConfigRoot} from '../model/ConfigRoot';
import {IConfig} from 'config';

export const AppConfig = nodeConfig as ConfigRoot;

class ConfAccessHandler implements ProxyHandler<IConfig> {

  constructor(private conf: IConfig, public readonly prefix: string = '') {
  }

  get(target: any, p: PropertyKey, receiver: any): any {
    const name = p.toString();
    console.log(`NAME: ${name}`);
    const path = this.prefix ? `${this.prefix}.${name}` : name;
    const value = this.conf.get(path);
    if (typeof  value === 'object') {
      return new Proxy(target, new ConfAccessHandler(this.conf, path));
    }
    return value;
  }
}

export function ConfigOf<T>(conf: IConfig): T {
  return new Proxy<ConfigRoot>({}, new ConfAccessHandler(conf)) as T;
}

export const AppConfigProxy = ConfigOf<ConfigRoot>(nodeConfig);
