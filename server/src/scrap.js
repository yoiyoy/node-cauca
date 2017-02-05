import co from 'co';

import request from 'co-request';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';

import requestQueue from './utils/request-queue';
import cheerioInnerText from './utils/cheerio-innerText';
import parsers from './parsers';
import { items as itemsRequest, sigu as siguRequest } from './props/requestOptions.json';
import addrCode from './props/addrCode.json';

const MIN_INTERVAL = 10000;

cheerioInnerText(cheerio);

const send = requestOption => co(function* () {
  const response = yield request(requestOption);
  const bodyBuffer = response.body;
  if (response.statusCode !== 200) {
    throw new Error(`응답상태코드: ${response.statusCode}`);
  }
  const body = iconv.decode(bodyBuffer, 'EUC-KR').toString();
  return cheerio.load(body, { decodeEntities: false });
});

const requestQ = requestQueue(send, {
  minInterval: MIN_INTERVAL,
  asyncWithInterval: true, // 비동기 요청간 일정한 시간 간격을 보장
});

const getSidoSigu = sidoCode => co(function* () {
  const sidoSiguRequest = { ...siguRequest,
    form: {
      ...siguRequest.form,
      sidoCode,
    },
    encoding: null,
  };
  const $ = yield requestQ.send(sidoSiguRequest);
  const { siguParser } = parsers($);
  const sidoSigus = $('xsync > select > option:not([value=""])').get().map(siguParser);
  return sidoSigus;
});

const getAddrCode = sidos =>
  sidos.map(sido => co(function* () {
    const sigus = yield getSidoSigu(sido.code);
    // console.log(sigus);
    return {
      ...sido,
      sigus,
    };
  }));

const getSidoSiguItems = (sidoCode, siguCode) => co(function* () {
  const sidoItemsRequest = { ...itemsRequest,
    form: {
      ...itemsRequest.form,
      daepyoSidoCd: sidoCode,
      daepyoSiguCd: siguCode,
      mDaepyoSidoCd: sidoCode,
      mDaepyoSiguCd: siguCode,
    },
    encoding: null,
  };
  const $ = yield requestQ.send(sidoItemsRequest);
  const { itemParser } = parsers($);
  const sidoItems = $('.Ltbl_list tbody tr').get().map(itemParser);
  // console.log(sidoItems);
  return sidoItems;
});

const getItems = sidoSigus => co(function* () {
  yield sidoSigus.map(sido =>
    sido.sigus.map(sigu => ({
      sidoName: sido.name,
      sidoCode: sido.code,
      siguName: sigu.name,
      siguCode: sigu.code,
      items: getSidoSiguItems(sido.code, sigu.code),
    })));
});

export default co(function* () {
  const sidoSigus = yield getAddrCode(addrCode.sidos.slice(1, 4));
  const items = yield getItems(sidoSigus.slice(1, 2));
  return items;
}).catch(e => console.error(e));
