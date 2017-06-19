function createRow(col, headFlg) {
  return Array.apply(null, { length: col }).map(() => {
    if (headFlg) {
      return "<th>xxx</th>"
    } else {
      return '<td></td>'
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
  },

  getSampleTable(){

    return `

        <tbody><tr>
          <th>UserID      </th>
          <th>Name          </th>
          <th>Group     </th>
          <th>attribute list   </th>
        </tr>
        <tr>
          <td id="aaa">S&lt;t&gt;arting with </td>
          <td> a              </td>
          <td>   simple   </td>
          <td>row                 </td>
        </tr>
        <tr>
          <td style="text-align:center;" colspan="3">IT                                      </td>
          <td style="text-align:left;">align left       </td>
        </tr>
        <tr>
          <td>1             </td>
          <td>Artur Pirozhkov </td>
          <td rowspan="2">Users    </td>
          <td style="text-align:right;">align right      </td>
        </tr>
        <tr>
          <td>2             </td>
          <td>Vasya Rogov     </td>
          <td style="text-align:center;">center   </td>
        </tr>
        <tr>
          <td>3             </td>
          <td>John Smith      </td>
          <td>Admin<br>                                 (root)      </td>
          <td style="vertical-align:top;">valign top       </td>
        </tr>
        <tr>
          <td>4             </td>
          <td>-               </td>
          <td>Nobody<br>                                 (anonymous) </td>
          <td style="vertical-align:bottom;">valign bottom    </td>
        </tr>
      </tbody>

    `
  }
}
