var Koa = require("koa")
var KoaStatic = require("koa-static");
var path = require("path");

var app = new Koa();
app.use(KoaStatic(path.resolve(__dirname, "dist")));

app.listen(3000, function(){
  console.log("started on 3000");
});
