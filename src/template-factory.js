function createRow(col, headFlg) {
  return Array.apply(null, { length: col }).map(() => {
    if (headFlg) {
      return "<th>xxx</th>"
    } else {
      return "<td>xxx</td>"
    }
  }).join("");
}

export default {
  create(row, col) {
    var leftRow = row - 1;
    var headTr = createRow(col, true);
    var trs = Array.apply(null, { length: leftRow }).map(() => {
      return "<tr>" + createRow(col, false) + "</tr>";
    });
    trs.unshift(headTr);
    return "<table>" + trs.join("\r\n") + "</table>";
  }
}
