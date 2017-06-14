<template>
  <div id="app">
    <div class="sample hide">
      <table class="raw" v-html="rawTableHtml" ref="rawTable"></table>
    </div>
    <div class="control">
      <span><input type="text" v-model="row"></span>
      <span><input type="text" v-model="col"></span>
    </div>
    <div class="preview">
      <table cellpadding="0" cellspacing="0">
        <tr v-for="(tdArr,index) in tableArr" :key="index">
          <td
            v-for="(td, tdIndex) in tdArr"
            :colspan='td.colspan'
            :rowspan='td.rowspan'
            :class='td.type.toLowerCase()'
            @click="toEdit(td)">
            
            <div>
              <div class="text">{{td.value}}</div>
              <div class="edit" :style="{display: td.mode == 'edit' ? '' : 'none'}">
                <textarea 
                  name="" id=""
                  v-model='td.value'
                  @focusout="toText(td)">
                </textarea>
                <div class="button">
                  <button @click.stop="toText(td)">×</button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="copy">
      <textarea name="" id="">{{wikiStr}}</textarea>
    </div>
  </div>
</template>
<script>
import templateFactory from './template-factory.js'
import common from './common.js'

export default {
  name: 'app',
  data() {
    return {
      row: 3,
      col: 4,
      rawTableHtml: templateFactory.create(3,4),
      tableArr: []
    }
  },

  mounted(){
    this.tableArr = this._getTableArrFromHtml();
  },

  computed: {
    wikiStr(){
      return this.tableArr.map((tdArr, index) => {
        var lineArr = tdArr.map((td, _index) => {
          var headFlag = td.type == 'TH';
          var colspan = td.colspan;
          var rowspan = td.rowspan;

          var headStr = headFlag ? "_." : "";
          var colspanStr = colspan > 1 ? "\\" + colspan + "." : "";
          var rowspan = rowspan > 1 ? "/" + rowspan + "." : "";
          return [headStr, colspanStr, colspanStr, td.value].join(" ");
        });
        lineArr.push("");
        lineArr.unshift("");
        return lineArr.join("|");
      }).join("\r\n");
    }
  },

  methods: {
    toEdit(td){
      td.mode = "edit";
    },
    toText(td){
      td.mode = 'text';
    },
    _getTableArrFromHtml(){
      var tableArr = [];

      var tableDom = this.$refs.rawTable;
      var trs = tableDom.querySelectorAll("tr");
      var trArr = [];
      trs.forEach((tr) => {
        trArr = [];
        var thtds = tr.querySelectorAll("th,td");
        var rowLen = thtds.length;
        thtds.forEach((thtdItem, _index) => {
          var lineLast = false;
          if((rowLen - 1) === _index){
            lineLast = true;
          }
          var node = {
            type: thtdItem.nodeName,
            rowspan: thtdItem.getAttribute("rowspan") || 1,
            colspan: thtdItem.getAttribute("clospan") || 1,
            lineLast: lineLast,
            value: this._getValue(thtdItem),
            mode: 'text'
          }
          if(tableArr.length > 0){
            tableArr[tableArr.length - 1].next = node;
          }
          trArr.push(node);
          if(lineLast === true){
            tableArr.push(trArr);
            trArr = [];
          }
        })
      });
      return tableArr;
    },
    _trim(value) {
      if(value != null && value != undefined){
        return value.trim();
      }else {
        return value;
      }
    },
    _getValue(tdDom){
      var atag = tdDom.querySelector("a");
      if(atag){
        return "#" + atag.innerHTML;
      }else {
        return tdDom.innerHTML;
      }
    }
  },

  watch:{
    rawTableHtml(html){
      this.tableArr = this._getTableArrFromHtml();
    },
    row(row){
      common.adjustArrSize(this.tableArr,row, this.col);
    },
    col(col){
      common.adjustArrSize(this.tableArr,this.row, col);
    }
  }
}
</script>
<style>
* {
  box-sizing: border-box;
}
.hide {
  display:none;
}
table {
  table-layout: fixed;
  border-collapse: collapse;
  border-left: 1px solid black;
  border-bottom: 1px solid black;
  min-width: 400px;
}

th, td {
  padding: 0px;
  position:relative;
  white-space: pre;
}

th {
  border-top: 1px solid black;
  border-right: 1px solid black;
}

td {
  border-top: 1px solid black;
  border-right: 1px solid black;
}

td div.edit {
  z-index: 100;
  border: 1px solid aliceblue;
  position: absolute;
  left: 0px;
  top: 0px;

  width:100%;
  height: 100%;
}

td div.button {
  position: absolute;
  right:0px;
  bottom: 0px;
  z-index: 100000;
}

td.th {
  font-weight:bold;
}

.edit textarea {
  width: 100%;
  height: 100%;
}

.copy textarea {
  min-width: 400px;
  min-height: 200px;
}
</style>
