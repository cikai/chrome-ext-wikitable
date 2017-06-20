<template>
  <div id="app">

    <!-- (非显示) 从Redmine读入的table -->
    <div class="sample hide">
      <table class="raw" v-html="rawTableHtml" ref="rawTable"></table>
    </div>

    <!-- 控制按钮部分 -->
    <div class="control margin-bottom-10">
      <button @click="search()">
        <i class="fa fa-search"></i>
        查找
      </button>
      <button @click="copyToClickBoard">
        <i class="fa fa-copy"></i>
        拷贝Texttile
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
            @click="toEdit(td, $event)">
            
            <div>
              <div class="text">{{td.value}}</div>
              <div class="edit" :style="{display: td.mode == 'edit' ? '' : 'none'}">
                <textarea 
                  name="" id=""
                  v-model='td.value'>
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
      row: 0,
      col: 0,
      rawTableHtml: "",
      tableArr: []
    }
  },

  components: {
    SubAddInput
  },

  mounted(){
    this.initRawHtml();
    
    // global event
    var bus = this.$getBus();
    bus.$on("body/click", () => {
      this.tableArr.forEach(tds => {
        tds.forEach(td => {
          td.mode = "text";
        })
      })
    })
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
          return [headStr, rowspan, colspanStr, td.value].filter(item => item != "").join(" ");
        });
        lineArr.push("");
        lineArr.unshift("");
        return lineArr.join("|");
      }).join("\r\n");
    }
  },

  methods: {
    
    initRawHtml(){

      // 开发模式
      if(process.env.NODE_ENV == 'development'){
          this.rawTableHtml = templateFactory.create(3,4)
          this.tableArr = this._getTableArrFromHtml();
          return;
      }

      // chrome extension模式
      chrome.storage.local.get((obj) => {
        var tableArr = obj.tableArr;
        if(tableArr){
          this.tableArr = tableArr;
        }else {
          this.rawTableHtml = templateFactory.create(3,4)
          this.tableArr = this._getTableArrFromHtml();
        }
      })
    },

    toEdit(td, e){ 
      if(td.mode === "edit"){
        return;
      }
      td.mode = "edit";

      // focus
      var target = e.currentTarget;
      setTimeout(() => {
        var ta = target.querySelector("textarea");
        if(ta){
          ta.focus();
        }
      })
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
    appClick(){
      var arr = this.tableArr;
      arr.forEach(tds => {
        tds.forEach(td => {
          td.mode = "text";
        })
      });
    },
    search(){
      if(process.env.NODE_ENV == 'development'){
        this.testBtn();
        return;
      }

      common.sendMsg({
        type: "find_table"
      }, (response) => {
        if(!response){
          return;
        }
        this.rawTableHtml = response;
      })
    },
    testBtn(){
      this.rawTableHtml = templateFactory.getSampleTable();
    },
    copyToClickBoard(){
      var ta = document.querySelector(".copy textarea");
      ta.select();
      document.execCommand("copy");
      ta.blur();
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
            rowspan: thtdItem.rowSpan || 1,
            colspan: thtdItem.colSpan || 1,
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
        // 带有超链接的内容
        // <a href="www.baidu.com">BAIDU</a> => "BAIDU":http://www.baidu.com
        var domStr = tdDom.innerHTML;
        var reg = new RegExp("<a.*?</a>", "g");
        return domStr.replace(reg, (matchATag) => {
          return this._getValueFromATag(matchATag);
        })
      }else {
        // 普通的文本内容
        return tdDom.innerText;
      }
    },
    _getValueFromATag(atagStr){
      var reg = new RegExp(`<a.*?href="(.*?)".*?>(.*?)</a>`)
      var result = reg.exec(atagStr);
      return ` "${result[2]}":${result[1]} `;
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
    tableArr(arr, oldArr){

      console.log("in table arrr",arr, oldArr);
      if(process.env.NODE_ENV == 'development'){
        return;
      }
      
      chrome.storage.local.set({
        "tableArr": arr
      });
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

body {
  width: 1000px;
}

#app {
  position: relative;
  width: 980px;
  margin-left: 10px;
  margin-top: 10px;
}
.edit textarea {
  width: 100%;
  height: 100%;
}

.copy textarea {
  width: 100%;
  min-height: 200px;
}

div.button i.fa-save {
  background-color: white;
}

.preview table .th textarea {
  font-weight: bold;
}
</style>
