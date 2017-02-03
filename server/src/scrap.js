import co from 'co';
import wait from 'co-wait';
import request from 'co-request';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';

import cheerioInnerText from './utils/cheerio-innerText';
import parsers from './parsers';
import { items as itemsRequest, sigu as siguRequest } from './props/requestOptions.json';
import addrCode from './props/addrCode.json';

// 무조건 기다리는 시간, 요청간 일정한 시간 간격을 보장하지 않음
const MIN_DELAY_MS = 2000;
cheerioInnerText(cheerio);

// array를 비동기지만 순차적으로 map을 수행함
// coFunc는 yieldable을 반환 하는 함수
const mapSerial = (array, coFunc) => co(function* () {
  const resultArray = [];
  const len = array.length;
  for (let i = 0; i < len; i += 1) {
    const result = yield coFunc(array[i], i, array);
    resultArray.push(result);
  }
  return resultArray;
});

const send = requestOption => co(function* () {
  yield wait(MIN_DELAY_MS);
  const response = yield request(requestOption);
  const bodyBuffer = response.body;
  if (response.statusCode !== 200) {
    throw new Error(`응답상태코드: ${response.statusCode}`);
  }
  const body = iconv.decode(bodyBuffer, 'EUC-KR').toString();
  return cheerio.load(body, { decodeEntities: false });
});

const getSidoSigu = sidoCode => co(function* () {
  const sidoSiguRequest = { ...siguRequest,
    form: {
      ...siguRequest.form,
      sidoCode,
    },
    encoding: null,
  };
  const $ = yield send(sidoSiguRequest);
  const { siguParser } = parsers($);
  const sidoSigus = $('xsync > select > option:not([value=""])').get().map(siguParser);
  return sidoSigus;
});

const getAddrCode = sidos => co(function* () {
  const sidoSigus = yield mapSerial(sidos, sido => co(function* () {
    const sigus = yield getSidoSigu(sido.code);
    return {
      ...sido,
      sigus,
    };
  }));
  return sidoSigus;
});

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
  const $ = yield send(sidoItemsRequest);
  const { itemParser } = parsers($);
  const sidoItems = $('.Ltbl_list tbody tr').get().map(itemParser);

  return sidoItems;
});

const getItems = sidoSigus => co(function* () {
  yield mapSerial(sidoSigus, sido => co(function* () {
    yield mapSerial(sido.sigus, sigu => co(function* () {
      const items = yield getSidoSiguItems(sido.code, sigu.code);
      return {
        sidoName: sido.name,
        sidoCode: sido.code,
        siguName: sigu.name,
        siguCode: sigu.code,
        items,
      };
    }));
  }));
});

export default co(function* () {
  const sidoSigus = yield getAddrCode(addrCode.sidos);
  const items = yield getItems(sidoSigus.slice(1, 1));
  return items;
}).catch(e => console.error(e));
