# 前端监控 SDK

## 1. 为什么要做前端监控？

- 项目上线时，可以更快的发现问题和解决问题
- 产品根据`pv`和`uv`等数据来做下一步的决策
- 为业务扩展提供更多可能性

## 2. 前端监控目标

| 错误类型                                     | 备注                                                                                           |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Javascript 错误                              | Javascript 执行错误或者 promise 的异常                                                         |
| 资源异常                                     | script、link、图片等资源加载异常                                                               |
| 接口异常                                     | Ajax 或者 Fetch 请求接口异常                                                                   |
| 白屏                                         | 页面空白异常                                                                                   |
| PV(page view)                                | 页面的浏览量或者点击量                                                                         |
| UV(unique visitor)                           | 访问某个站点的不同 IP 地址的人数                                                               |
| 页面停留时间                                 | 用户在每一个页面的停留时间                                                                     |
| 加载时间                                     | 各个阶段的加载时间                                                                             |
| TTFB(time to first byte)(首字节时间)         | 浏览器发起第一个请求到数据返回第一个字节所消耗的时间，这个时间包含了网络请求时间、后端处理时间 |
| FP(first paint)(首次绘制)                    | 包括了任何用户自定义的背景绘制，它是将第一个像素点绘制到屏幕的时刻                             |
| FCP(first content paint)(首次内容绘制)       | 浏览器将第一个 DOM 渲染到屏幕的时间，可以是任何文本、图像、SVG 等的时间                        |
| FMP(fist meaningful paint)(首次有意义的绘制) | 页面可用性的量度标准                                                                           |
| FID(first input delay)(首次输入延迟)         | 用户首次和页面交互到页面响应交互的时间                                                         |
| 卡顿                                         | 超过 50ms 的长任务                                                                             |

## 3. 前端监控流程

- 前端埋点
- 数据上报
- 将采集到的数据进行分析和计算，然后进行加工汇总
- 可视化展示，将数据按各种维度进行展示
- 监控报警，发现问题后按一定的条件触发报警
- 流程图如下

![](/assets/monitor/monitorplatform.jpg)

## 4. 常见的埋点方案

### 4.1 代码埋点

- 以嵌入代码的形式进行埋点，比如需要监控用户的点击事件，会选择在用户点击时，插入一段代码，保存这个监听行为或者直接将监听行为以某一种数据格式直接传递给服务端
- 优点：可以在任意时刻，精确的发送或保存所需要的数据信息
- 缺点：开发者工作量较大

### 4.2 可视化埋点

- 通过可视化交互的手段，代替代码埋点（一般都是产品根据需求自己去做）
- 将业务代码和埋点代码分离，提供一个可视化交互的页面，输入为业务代码，通过可视化系统，可以在业务代码中自定义的增加埋点事件等，最后输出的代码耦合了业务代码和埋点代码
- 可视化埋点其实就是用系统来代替手工插入埋点代码

### 4.3 无痕埋点（全埋点）

- 前端的任意一个事件都被绑定一个标识，将所有的事件都记录下来
- 通过定期上传记录文件，配合文件解析，解析出想要的数据并生成可视化报告供专业人员分析
- 优点：采集全量数据，不会出现漏埋和误埋等现象
- 缺点：给数据传输和服务器增加压力，无法灵活定制数据结构

## 5. 日志服务

- 使用的是阿里云 SLS

## 6. 上报方式

- 可以通过 image
  - 优点：不存在跨域问题
  - 缺点：长度限制
- 可以通过 post 请求
  - 优点：不限长度大小
  - 缺点：可能会存在跨域问题

## 7. 伪代码实现监控 JS 错误

```js
// html文件
<input type="button" value="jsError" onclick="handleJsError()">
<script>
    // 点击会报错
    function handleJsError() {
      console.log(window.someVar.a)
    }
</script>

// 收集错误信息，整合，上报
window.addEventListener('error', event => {
    const lastEvent = getLastEvent() // 获取最后一次的用户事件
    let log = {
        kind: 'stability',// 稳定性指标
        type: 'error',// error
        errorType: 'jsError',// jsError
        message: event.message,// 报错信息
        filename: event.filename,// 报错链接
        position: (event.lineno || 0) + ":" + (event.colno || 0),// 行列号
        stack: getLines(event.error.stack),// 错误堆栈
        selector: lastEvent ? getSelector(lastEvent.path || lastEvent.target) : ''// CSS选择器
    }
    tracker.send(log) // 上报
})
```

- 上报成功截图
  ![](/assets/monitor/上报成功信息.png)

- 阿里云日志截图

  ![](/assets/monitor/阿里云日志成功采集-jsError.png)

## 8. 伪代码实现监控 Promise 错误

```js
// html文件
<input type="button" value="promiseError" onclick="handlePromiseError()">
<script>
    // 点击会报错
    function handlePromiseError() {
      new Promise(() => {
        console.log(window.someVar.a)
      })
    }
</script>

// 收集错误信息，整合，上报
// promise错误
window.addEventListener('unhandledrejection', event => {
    const lastEvent = getLastEvent()
    let message = '';
    let line = 0;
    let column = 0;
    let file = '';
    let stack = '';
    if (typeof event.reason === 'string') {
        message = event.reason;
    } else if (typeof event.reason === 'object') {
        message = event.reason.message;
    }
    let reason = event.reason;
    if (typeof reason === 'object') {
        if (reason.stack) {
            var matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
            if (matchResult) {
                file = matchResult[1];
                line = matchResult[2];
                column = matchResult[3];
            }
            stack = getLines(reason.stack);
        }
    }
    tracker.send({// 未捕获的promise错误
        kind: 'stability',// 稳定性指标
        type: 'error',// jsError
        errorType: 'promiseError',// unhandledrejection
        message: message,// 标签名
        filename: file,
        position: line + ':' + column,// 行列
        stack,
        selector: lastEvent ? getSelector(lastEvent.path || lastEvent.target) : ''
    })
})
```

- 上报成功截图

  ![](/assets/monitor/上报成功信息-promise.png)

- 阿里云日志截图

  ![](/assets/monitor/阿里云日志成功采集-promiseError.png)

## 9. 伪代码实现监控资源错误

```js
// 不存在的资源文件
<script src="error.js"></script>;
// 收集错误信息，整合，上报
window.addEventListener(
  "error",
  (event) => {
    const lastEvent = getLastEvent();
    if (event.target && (event.target.src || event.target.href)) {
      tracker.send({
        // 资源加载错误
        kind: "stability", // 稳定性指标
        type: "error", // resource
        errorType: "resourceError",
        filename: event.target.src || event.target.href, // 加载失败的资源
        tagName: event.target.tagName, // 标签名
        selector: getSelector(event.path || event.target), // 选择器
      });
    } else {
      // js错误
      // ...
    }
  },
  true
);
```

- 上报成功截图

  ![](/assets/monitor/上报成功信息-resource.png)

- 阿里云日志截图

  ![](/assets/monitor/阿里云日志成功采集-resourceError.png)

## 10. 伪代码实现监控接口异常
