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
    const sidoSigus = yield getSidoSigus(addrCode.sidos.slice(1, 4));
    const sidoSiguAuctions = yield getSidoSiguAuctions(sidoSigus.slice(1, 2));
    const itemKeys = [
      'court',
      'caseNo',
      'caseDesc',
      'itemNo',
      'itemType',
      'itemDesc',
      'addr',
      'addr0',
      'addr1',
      'addr2',
      'note',
      'appraisalPrice',
      'reservedPrice',
      'status',
      'auctionDept',
      'auctionDeptContact',
      'auctionDate',
    ];
    sidoSiguAuctions.every(sidoSiguAuction =>
      expect(sidoSiguAuction).to.have.property('sidoName').that.exist &&
      expect(sidoSiguAuction).to.have.property('sidoCode').that.exist &&
      expect(sidoSiguAuction).to.have.property('siguName').that.exist &&
      expect(sidoSiguAuction).to.have.property('siguCode').that.exist &&
      expect(sidoSiguAuction).to.have.property('items').that.is.an('array') &&
      sidoSiguAuction.items.every(item =>
        itemKeys.every(key =>
          expect(item).to.have.property(key).that.exist)));
  });
});
