/* eslint-disable */
// auction item AS-IS HTML templete
export default ({
  court,
  caseId,
  caseNo,
  itemNo,
  itemType,
  itemDesc,
  addr0,
  addr1,
  addr2,
  addr3,
  note,
  appraisalPrice,
  reservedPrice,
  status,
  auctionDept,
  auctionDeptContact,
  auctionDate,
  auctionRoom,
}) => `<tr class="Ltbl_list_lvl0">
			<td class="padding0"><input type="checkbox" name="chk" value="${court},${caseId},${itemNo}"></td>
			<td><a href="#" onclick="javascript:detailCaseSrch('${court}',
			                                                   '${caseId}','${itemNo}'); return false;" class="fbl">
			${court}<input type="hidden" name="boGbn" value="B"><br>
			<b>${caseNo}</b><br>


			</a></td>

			<td>
			3<br>
			${itemType}</td>
			<td class="txtleft">

			<div class="tbl_btm_noline">
			<a href="#" name="${caseId}${itemNo}" onclick="javascript:detailSrch('${court}',
														'${caseId}',
														'3'); return false;">
			${addr0} ${addr1}  ${addr2} ${addr3}</a>
			<a href="#" onclick="javascript:showPopupMap('${court}',
														 '${caseId}',
														 '3',
														 '3'); return false;">
			<img src="/images/ic_map.gif" alt="지도보기 팝업"></a>
			<br>

			[${itemDesc}]
			 </div>

			</td>
      <td class="txtleft">
				${note}
			</td>
			<td class="txtright">
			<div class="tbl_btm_noline">
			${appraisalPrice.toLocaleString()}
			</div>
			<div class="tbl_btm_line">

			${reservedPrice.toLocaleString()}

			<br>
			(13%)
			</div>
			</td>
			<td>
			<div class="tbl_btm_noline">
			${auctionDept}

			<a href="#" onclick="showJpDeptInofTitle('${auctionDeptContact}', '${auctionDate}', '${auctionRoom}', 'idImg18');return false;">
			<img src="/images/ic_poll.gif" alt="안내" title="안내" id="idImg18" onmouseover="showJpDeptInfo('${auctionDeptContact}', '${auctionDate}', '${auctionRoom}', event);" onmouseout="sh_layers2('tel_layer','','hide',event)"></a><br>
			2017.01.01
			</div>

<div class="tbl_btm_line">

				       ${status}
</div>
			</td>

		</tr>`;
