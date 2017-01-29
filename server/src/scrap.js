import co from 'co';
import request from 'co-request';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';

import cheerioInnerText from './utils/cheerio-innerText';
import parsers from './parsers';
import { itemList } from './props/requestOptions';
import sidoList  from './props/sidoList';

const getItems = sidoList => co(function* () {
  let items = yield sidoList.reduce((items, sido) => [...items, getSidoItemsList(sido.code)], []);
  return items;
});

const getSidoItemsList = sidoCode => co(function* () {
  let sidoItemList = { ...itemList,
    form: {
      ...itemList.form,
      "daepyoSidoCd": sidoCode,
      "daepyoSiguCd": "",
      "mDaepyoSidoCd": sidoCode,
      "mDaepyoSiguCd": "",
    }
  };
  console.log(sidoItemList)
  let result = yield request(sidoItemList);
  let response = result;
  let bodyBuffer = result.body;
  if (response.statusCode !== 200) {
    throw `응답상태코드: ${response.statusCode}`;
  }
  const body = iconv.decode(bodyBuffer, 'EUC-KR').toString();
  const $ = cheerio.load(body, {decodeEntities: false});
  cheerioInnerText($);
  const { itemParser } = parsers($);
  const items = $('.Ltbl_list tbody tr').get().map(itemParser);
  return items;
});

export default getItems(sidoList);
