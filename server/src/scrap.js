import co from 'co';
import request from 'co-request';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';

import cheerioInnerText from './utils/cheerio-innerText';
import parsers from './parsers';

const options = {
  method: 'POST',
  url: "https://www.courtauction.go.kr/RetrieveRealEstMulDetailList.laf",
  headers: {
    "Host": "www.courtauction.go.kr",
    "User-Agent":
    "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.8; ko; rv:1.9.0.14) Gecko/2009082706 Firefox/3.0.14",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3",
    "Accept-Charset": "windows-949,utf-8;q=0.7,*;q=0.7",
  },
  form: {
    "_FORM_YN": "Y",
    "bubwLocGubun": "2",
    "daepyoSidoCd": "11",
    "daepyoSiguCd": "",
    "mDaepyoSidoCd": "11",
    "mDaepyoSiguCd": "",
    "srnID": "PNO102000",
    "page": "default40", // 페이지에 출력될 항목 수
    "targetRow": 1
  },
  encoding: null
};

export default co(function* () {
  let result = yield request(options);
  let response = result;
  let bodyBuffer = result.body;
  if (response.statusCode !== 200) {
    throw `응답상태코드: ${response.statusCode}`;
  }
  const body = iconv.decode(bodyBuffer, 'EUC-KR').toString();
  const $ = cheerioInnerText(cheerio.load(body, {decodeEntities: false}));
  let { itemParser } = parsers($);
  let items = $('.Ltbl_list tbody tr').get();

  return items.map(itemParser);
});
