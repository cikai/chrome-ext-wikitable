<template>
  <div id="app">

    <!-- (非显示) 从Redmine读入的table -->
    <div class="sample">
      <table class="raw" v-html="rawTableHtml" ref="rawTable"></table>
    </div>

    <!-- 控制按钮部分 -->
    <div class="control margin-bottom-10">
      <button @click="search()">
        <i class="fa fa-search"></i>
        查找
      </button>
      <sub-add-input :value="row" @changeValue="changeRow"></sub-add-input>
      <sub-add-input :value="col" @changeValue="changeCol"></sub-add-input>
    </div>

    <!-- 预览 & 可编辑 table 部分 -->
    <div class="preview margin-bottom-10">
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
                  <i class="fa fa-save" @click.stop="toText(td)"></i>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Redmine Texttile 显示部分 -->
    <div class="copy">
      <textarea name="" id="">{{wikiStr}}</textarea>
    </div>

  </div>
</template>
<script>
import templateFactory from './template-factory.js'
import common from './common.js'
import SubAddInput from './components/SubAddInput.vue'

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

  components: {
    SubAddInput
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
          return [headStr, colspanStr, colspanStr, td.value].filter(item => item != "").join(" ");
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
    changeRow(value){
      this.row += value;
    },
    changeCol(value){
      this.col += value;
    },
    search(){
      common.sendMsg({
        type: "find_table"
      }, (response) => {
        if(!response){
          return;
        }
        this.rawTableHtml = response;
      })

      // this.rawTableHtml = `
      // <tr><td>111111111</td></tr>
      // `
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
      setTimeout(() => {
        var tableArr = this.tableArr = this._getTableArrFromHtml();
        this.row = tableArr.length || 0;
        this.col = (tableArr[0] && tableArr[0].length) || 0;
      },100)
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
  font-size: 16px;
  font-family: sans-serif;
}

i.fa {
  cursor:pointer;
}
i.fa:hover {
  color: cadetblue;
}

.hide {
  display:none;
}

.margin-bottom-10 {
  margin-bottom: 10px;
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

div.button i.fa-save {
  background-color: white;
}
</style>
