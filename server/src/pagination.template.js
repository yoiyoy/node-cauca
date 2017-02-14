/* eslint-disable */
// pagination AS-IS HTML templete
export default ({ nextTargetRow }) =>
  `<div class="page2"><a href="#" onclick="goPage('1'); return false;"><img src="/images/ic_arrow_first.gif" alt="첫 쪽" border="0"></a><a href="#" onclick="goPage('1'); return false;"><span> 1 </span></a><span class="page_on">2</span><a href="#" onclick="goPage('${nextTargetRow}'); return false;"><span> 3 </span></a><a href="#" onclick="goPage('121'); return false;"><span> 4 </span></a><a href="#" onclick="goPage('161'); return false;"><span> 5 </span></a><a href="#" onclick="goPage('161'); return false;"><img src="/images/ic_arrow_last.gif" alt="마지막 쪽" border="0"></a></div>`;
