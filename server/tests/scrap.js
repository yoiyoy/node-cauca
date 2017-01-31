/* eslint-env  mocha */
import chai from 'chai';
import scrap from '../src/scrap';
import sidos from '../src/props/sidoList.json';

const expect = chai.expect;
const handleErr = (err, done, cb) => {
  if (!err && cb) cb();
  done(err);
};

describe('SCRAP', () => {
  let scrappedItems;
  beforeEach((done) => {
    scrap
      .then((items) => {
        scrappedItems = items;
        done();
      })
      .catch(err => handleErr(err, done));
  });

  describe('scrapped item', () => {
    it('should be a array', (done) => {
      expect(scrappedItems).to.be.a('array');
      done();
    });

    it('should have items per sido', (done) => {
      sidos.forEach((sido, i) => {
        expect(scrappedItems[i]).to.have.property('sidoName')
        .that.is.a('string')
        .that.is.equals(sido.name);

        expect(scrappedItems[i]).to.have.property('sidoCode')
        .that.is.a('number')
        .that.is.equals(sido.code);
      });
      done();
    });
  });
});
