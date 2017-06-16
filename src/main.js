// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import fontawesome from './css/font-awesome.css'
import commoncss from './css/common.css'
import GlobalEvent from './global_event.js';

Vue.config.productionTip = false

Vue.use(GlobalEvent);

/* eslint-disable no-new */
var main = new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})

var bus = main.$getBus();
document.body.addEventListener("click", (e) => {
  var target = e.target;
  if(target.closest("div.preview")) {
    return;
  }
  bus.$emit("body/click");
})




