# chrome-ext-wikitable

* chrome extension组件

* 方便编辑 [Redmine](http://www.redmine.org/projects/redmine) 的 [TextTile](http://www.redmine.org/projects/redmine/wiki/RedmineTextFormattingTextile) 格式的table

* popup部分使用vuejs 实现

  * 需要在manifest.json中设定如下的CSP 才能运行vuejs

    ```javascript
    "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'"
    ```

* crx 文件

  [wikitable.crx](/crx/wikitable.crx)


