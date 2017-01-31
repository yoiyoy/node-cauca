import co from 'co';
import request from 'co-request';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';

import cheerioInnerText from './utils/cheerio-innerText';
import parsers from './parsers';
import { itemList } from './props/requestOptions.json';
import sidos from './props/sidoList.json';

const getSidoItems = sidoCode => co(function* () {
  const sidoItemList = { ...itemList,
    form: {
      ...itemList.form,
      daepyoSidoCd: sidoCode,
      daepyoSiguCd: '',
      mDaepyoSidoCd: sidoCode,
      mDaepyoSiguCd: '',
    },
  };
  const response = yield request(sidoItemList);
  const bodyBuffer = response.body;
  if (response.statusCode !== 200) {
    throw new Error(`응답상태코드: ${response.statusCode}`);
  }
  const body = iconv.decode(bodyBuffer, 'EUC-KR').toString();
  const $ = cheerio.load(body, { decodeEntities: false });
  cheerioInnerText($);
  const { itemParser } = parsers($);
  const items = $('.Ltbl_list tbody tr').get().map(itemParser);
  return items;
});

const getItems = itemSidos => co(function* () {
  const items = yield itemSidos.map(itemSido => ({
    sidoName: itemSido.name,
    sidoCode: itemSido.code,
    items: getSidoItems(itemSido.code),
  }));
  // console.log(items);
  return items;
});

export default getItems(sidos);
