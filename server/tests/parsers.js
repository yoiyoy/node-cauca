/* eslint-env  mocha */
import chai from 'chai';
import cheerio from 'cheerio';

import parsers from '../src/parsers';
import siguTempl from '../src/sigu.template';
import auctionItemTempl from '../src/auctionItem.template';
import paginationTempl from '../src/pagination.template';
import cheerioInnerText from '../src/utils/cheerio-innerText';

const expect = chai.expect;
const itemProps = {
  caseId: '22220990098765',
  court: '가나다지방법원',
  caseNo: '2222타경98765',
  caseDesc: '가나다지방법원 2222타경98765',
  itemNo: '3',
  itemType: '근린시설',
  itemDesc: '집합건물 철골,철근콘크리트조 11.99㎡',
  addr: '서울특별시 중구 가나다로 987, 1층987호',
  addr0: '서울특별시',
  addr1: '중구',
  addr2: '가나다로',
  addr3: '987, 1층987호',
  note: '',
  appraisalPrice: 50000000,
  reservedPrice: 10000000,
  status: '유찰 1회',
  auctionDept: '경매99계',
  auctionDeptContact: '987-6543, 987-6542',
  auctionDate: '2017.01.01 10:00',
  auctionRoom: '제4별관 999호 법정',
};
const siguProps = {
  name: '가나다구',
  code: '123',
};

const targetRowProps = {
  nextTargetRow: 41,
};

cheerioInnerText(cheerio);

describe('parsers', () => {
  it('parses name and code of sigu from "option"', (done) => {
    const body = siguTempl(siguProps);
    const $ = cheerio.load(body, { decodeEntities: false });
    const { siguParser } = parsers($);
    const sigu = $('xsync > select > option:not([value=""])').get().map(siguParser).pop();
    expect(sigu).to.eql(siguProps);
    done();
  });

  it('parses auction item from "tr"', (done) => {
    const body = auctionItemTempl(itemProps);
    const $ = cheerio.load(body, { decodeEntities: false });
    const { itemParser } = parsers($);
    const auctionItem = $('tr').get().map(itemParser).pop();
    expect(auctionItem).to.eql(itemProps);
    done();
  });

  it('parses next targetRow from ".page2"', (done) => {
    const body = paginationTempl(targetRowProps);
    const $ = cheerio.load(body, { decodeEntities: false });
    const { nextTargetRowParser } = parsers($);
    const nextTargetRow = nextTargetRowParser($('.page2').get());
    expect(nextTargetRow).to.eql(targetRowProps.nextTargetRow);
    done();
  });
});
