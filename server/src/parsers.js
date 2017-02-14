const siguParser = $ =>
  siguNode => ({
    name: $(siguNode).html().match(/[가-힇]+/g).pop(),
    code: $(siguNode).attr('value'),
  });

const itemParser = ($) => {
  const propReducer = (props, col, i) => {
    const innerText = $(col).innerText();
    switch (i) {
      case 0: {
        const [, caseId] = $(col).find('input').attr('value').split(',');
        return { ...props,
          caseId,
        };
      }
      case 1: {
        let caseDesc;
        const [court, caseNo] = caseDesc = innerText.split('\n');
        return { ...props,
          court,
          caseNo,
          caseDesc: caseDesc.join(' '),
        };
      }
      case 2: {
        const [itemNo, ...itemType] = innerText.split('\n');
        return { ...props,
          itemNo,
          itemType: itemType.join(' '),
        };
      }
      case 3: {
        const [desc] = $(col).find('div').get()
          .map(e => $(e).innerText());
        const [addr, itemDesc] = desc.split('\n');
        const [addr0, addr1, addr2, ...addr3] = addr
          .replace(/^.+(?=:):\s+?/, '') // "사용본거지 : " 텍스트 제거
          .split(/ +/);
        /* eslint-disable no-useless-escape */
        return { ...props,
          itemDesc: itemDesc.replace(/[\[\]]/g, ''),
          addr,
          addr0,
          addr1,
          addr2,
          addr3: addr3.join(' '),
        };
        /* eslint-enable no-useless-escape */
      }
      case 4: {
        const note = innerText;
        return { ...props,
          note,
        };
      }
      case 5: {
        const [appraisalPrice, reservedPrice] = $(col).find('div').get()
          .map(e => $(e).innerText())
          .map(formatted => formatted.replace(/,|\n.+$/g, ''))
          .map(price => parseInt(price, 10));
        return { ...props,
          appraisalPrice,
          reservedPrice,
        };
      }
      case 6: {
        const [auctioninfo, status] = $(col).find('div').get()
          .map(e => $(e).innerText());
        const [auctionDept] = auctioninfo.split('\n');
        const [auctionDeptContact, auctionDate, auctionRoom] = $(col).find('div a')
          .attr('onclick')
          .replace(/[ \t]+/g, ' ')
          .match(/'([^']+)', '([^']+)', '([^']+)'/)
          .slice(1);
        return { ...props,
          status,
          auctionDept,
          auctionDeptContact,
          auctionDate,
          auctionRoom,
        };
      }
      default: return props;
    }
  };

  return item => $(item).find('td').get().reduce(propReducer, {});
};

const nextTargetRowParser = $ =>
  (pagination) => {
    const nextPagination = $(pagination).find('.page_on + a').get(0);
    if (!nextPagination) {
      return null;
    }
    /* eslint-disable no-useless-escape */
    const [, nextTargetRow] = $(nextPagination).attr('onclick').match(/\(\'([0-9]+)/);
    /* eslint-enable no-useless-escape */
    return parseInt(nextTargetRow, 10);
  };

export default $ => ({
  siguParser: siguParser($),
  itemParser: itemParser($),
  nextTargetRowParser: nextTargetRowParser($),
});
