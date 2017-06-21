## 说明

* chrome extension组件

* 方便编辑 [Redmine](http://www.redmine.org/projects/redmine) 的 [TextTile](http://www.redmine.org/projects/redmine/wiki/RedmineTextFormattingTextile) 格式的table

## 安装

* 下载crx文件

  [wikitable.crx](/crx/wikitable.crx)

* 安装 & 使用方法

  ![/git/1.gif](/doc/1.gif)

* 其他

  发布到chrome store需要交5美元，交费太麻烦，放弃了  
  不交费想使用的话，只能采用开发者模式了


## MEMO

* popup部分使用vuejs 实现

  * 需要在manifest.json中设定如下的CSP 才能运行vuejs

    ```javascript
    "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'"
    ```