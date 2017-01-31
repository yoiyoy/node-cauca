const itemParser = ($) => {
  const propReducer = (props, col, i) => {
    const innerText = $(col).innerText();
    switch (i) {
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
        const [addr0, addr1, addr2] = addr
          .replace(/^.+(?=:):\s+?/, '') // "사용본거지 : " 텍스트 제거
          .split(/ +/);
        return { ...props,
          itemDesc: itemDesc.replace(/[[]]/g, ''),
          addr,
          addr0,
          addr1,
          addr2,
        };
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

export default $ => ({
  itemParser: itemParser($),
});
