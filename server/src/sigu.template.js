// sigu AS-IS XML templete
export default ({
  name,
  code,
}) => `<?xml version='1.0' encoding="euc-kr"?>
<xsync>
<select clear="true" id="idSiguCode1">

<option value="">

<![CDATA[시/군/구]]>

</option>

<option value="${code}">

<![CDATA[${name}]]>

</option>

</select>

<select clear="true" id="idDongCode1">

<option value="">

<![CDATA[동/도로명]]>

</option>


</select>

</xsync>`;
