import chai from 'chai';
import scrap from '../src/scrap';

const expect = chai.expect;
const handleErr = (err, done, cb) => {
  if(!err && cb) cb();
  done(err);
};

describe('SCRAP', () => {

  let scrappedItems;
  beforeEach((done) => {
    scrap
      .then(items => {
        scrappedItems = items;
        done();
      })
      .catch(err => handleErr(err, done));
  });

  describe('scrapped item', () => {
    it('should be a array', (done) => {
      expect(scrappedItems).to.be.a('array');
      done()
    });
  });

});
