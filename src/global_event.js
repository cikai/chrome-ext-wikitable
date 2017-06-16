import Vue from 'Vue';

var GlobalEvent = {}

GlobalEvent.install = function(Vue, options){

  Vue.bus = new Vue();

  Vue.prototype.$getBus = function(){
    return Vue.bus;
  }
}

export default GlobalEvent;