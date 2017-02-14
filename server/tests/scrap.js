/* eslint-env  mocha */
import chai from 'chai';

import { getSidoSigus, getSidoSiguAuctions } from '../src/scrap';
import addrCode from '../src/props/addrCode.json';

const expect = chai.expect;

describe('scrap', () => {
  it('gets sido-sigu codes ', function* () {
    const sidoSigus = yield getSidoSigus(addrCode.sidos.slice(1, 3));
    expect(sidoSigus).to.be.an('array');
    sidoSigus.every(sido =>
      expect(sido).to.have.property('name').that.exist &&
      expect(sido).to.have.property('code').that.exist &&
      expect(sido).to.have.property('sigus').that.is.an('array') &&
      sido.sigus.every(sigu =>
        expect(sigu).to.have.property('name').that.exist &&
        expect(sigu).to.have.property('code').that.exist));
  });

  it('gets auction items per sido-sigu', function* () {
    const someSidoSigus = [{
      name: '서울특별시',
      code: '11',
      sigus: [{
        name: '강남구',
        code: '680',
      }, {
        name: '강동구',
        code: '740',
      }, {
        name: '강북구',
        code: '300',
      }, {
        name: '강서구',
        code: '500',
      }, {
        name: '관악구',
        code: '620',
      }],
    }];
    const sidoSiguAuctions = yield getSidoSiguAuctions(someSidoSigus);
    sidoSiguAuctions.every(sidoSiguAuction =>
      expect(sidoSiguAuction).to.have.property('sidoName').that.exist &&
      expect(sidoSiguAuction).to.have.property('sidoCode').that.exist &&
      expect(sidoSiguAuction).to.have.property('siguName').that.exist &&
      expect(sidoSiguAuction).to.have.property('siguCode').that.exist &&
      expect(sidoSiguAuction).to.have.property('items').that.is.an('array'));
  });
});
