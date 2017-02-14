import co from 'co';
import request from 'co-request';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';

import requestQueue from './utils/request-queue';
import cheerioInnerText from './utils/cheerio-innerText';
import parsers from './parsers';
import { items as itemsRequest, sigu as siguRequest } from './props/requestOptions.json';
import addrCode from './props/addrCode.json';

const REQUEST_INTERVAL = 3500;

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

const requestQ = requestQueue(send, { // 비동기 요청간 일정한 시간 간격을 보장
  asyncMode: true,
  interval: REQUEST_INTERVAL,
});

const getSigu = sidoCode => co(function* () {
  const sidoSiguRequest = { ...siguRequest,
    form: {
      ...siguRequest.form,
      sidoCode,
    },
    encoding: null,
  };
  const $ = yield requestQ.push(sidoSiguRequest);
  const { siguParser } = parsers($);
  const sidoSigus = $('xsync > select > option:not([value=""])').get().map(siguParser);
  return sidoSigus;
});

const getSidoSigus = sidos =>
  sidos.map(sido => co(function* () {
    const sigus = yield getSigu(sido.code);
    return {
      ...sido,
      sigus,
    };
  }));

const getSidoSiguItems = (sidoCode, siguCode, targetRow = 1) => co(function* () {
  const sidoItemsRequest = { ...itemsRequest,
    form: {
      ...itemsRequest.form,
      daepyoSidoCd: sidoCode,
      daepyoSiguCd: siguCode,
      mDaepyoSidoCd: sidoCode,
      mDaepyoSiguCd: siguCode,
      targetRow,
    },
    encoding: null,
  };
  const $ = yield requestQ.push(sidoItemsRequest);
  const { itemParser, nextTargetRowParser } = parsers($);
  const sidoItems = $('.Ltbl_list tbody tr').get().map(itemParser);
  const nextTargetRow = nextTargetRowParser($('.page2').get());
  if (nextTargetRow !== null) {
    const nextPageItems = yield getSidoSiguItems(sidoCode, siguCode, nextTargetRow);
    return [...sidoItems, ...nextPageItems];
  }
  // console.log(sidoItems);
  return sidoItems;
});

const getSidoSiguAuctions = sidoSigus => co(function* () {
  const items = yield sidoSigus.reduce((sidosiguItems, sido) =>
    [...sidosiguItems,
      ...sido.sigus.map(sigu => ({
        sidoName: sido.name,
        sidoCode: sido.code,
        siguName: sigu.name,
        siguCode: sigu.code,
        items: getSidoSiguItems(sido.code, sigu.code),
      })),
    ], []);
  return items;
});

export default () => co(function* () {
  const sidoSigus = yield getSidoSigus(addrCode.sidos.slice(1, 4));
  const sidoSiguAuctions = yield getSidoSiguAuctions(sidoSigus.slice(1, 2));
  return sidoSiguAuctions;
}).catch(e => console.error(e));

export { getSidoSigus, getSidoSiguAuctions };
