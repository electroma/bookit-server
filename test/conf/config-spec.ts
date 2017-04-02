import {expect} from 'chai';
import * as nodeConfig from 'config';
import {ConfigOf} from '../../src/config/config';

interface DummyConf {
  abc: string;
  hz123: Other;
}

interface Other {
  bcd?: Other;
}

const stubConf = nodeConfig as any;
if (!stubConf.abc) {
  stubConf.abc = 'dd';
  stubConf.hz123 = {bcd: {bcd: {crap: 'it is'}}};
}
const confProxy = ConfigOf<DummyConf>(stubConf);

describe('Config access is safe', () => {
  it('existing key', () => {
    expect(confProxy.abc).to.be.eq('dd');
    const target = confProxy.hz123.bcd.bcd as any;
    expect(target.crap).to.be.deep.eq('it is');
  });
  it('non existing key', () => {
    expect(() => confProxy.hz123.bcd.bcd.bcd)
      .to.throw(Error, 'Configuration property "hz123.bcd.bcd.bcd" is not defined');
  });
});
