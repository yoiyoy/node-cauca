// import itemParser from './itemParser';

const itemParser = $ => {
  const colToProps = (props, col, i) => {
    let innerText = $(col).innerText();
    switch (i) {
      case 1:
        let caseDesc, court, caseNo;
        [court, caseNo] = caseDesc = innerText.split('\n')
        return { ...props,
          court,
          caseNo,
          caseDesc: caseDesc.join(' ')
        };

      case 2:
        let [itemNo, ...itemType] = innerText.split('\n')
        return{ ...props,
          itemNo,
          itemType: itemType.join(' ')
        };

      case 3:
        let [desc] = $(col).find('div').get()
          .map(e => $(e).innerText());
        let [addr, itemDesc] = desc.split('\n')
        let [addr0, addr1, addr2] = addr
          .replace(/^.+(?=\:):\s+?/, '') // "사용본거지 : " 텍스트 제거
          .split(/ +/);
        return { ...props,
          itemDesc: itemDesc.replace(/[\[\]]/g, ''),
          addr,
          addr0,
          addr1,
          addr2
        };

      case 4:
        let note = innerText;
        return { ...props,
          note
        };

      case 5:
        let [appraisalPrice, reservedPrice] = $(col).find('div').get()
          .map(e => $(e).innerText())
          .map(formatted => formatted.replace(/,|\n.+$/g, ''))
          .map(price => parseInt(price));
        return { ...props,
          appraisalPrice,
          reservedPrice
        };

      case 6:
        let [auctioninfo, status] = $(col).find('div').get()
          .map(e => $(e).innerText());
        let [auctionDept] = auctioninfo.split('\n');
        let [_, auctionDeptContact, auctionDate, auctionRoom] = $(col).find('div a')
          .attr('onclick')
          .replace(/[ \t]+/g, ' ')
          .match(/'([^']+)', '([^']+)', '([^']+)'/);
        return { ...props,
          status,
          auctionDept,
          auctionDeptContact,
          auctionDate,
          auctionRoom
        };

      default:
        return props;
    }
  };

  return item => $(item).find('td').get().reduce(colToProps, {});
};

export default $ => ({
  itemParser: itemParser($)
});
