# Node 个人笔记

## 1. 什么是 Node?

```js
- node不是语言 他是一个让js可以运行在服务端的一个运行时 （内置模块 文件读写 操作系统及的api）
- js语言组成部分 BOM DOM  ECMASCRIPT  node中只包含了ECMASCRIPT + 模块
- node中间层 解决跨域问题  ssr的实现  工具  （egg nest） 后台项目
- 高并发 （单线程 js中主线程是单线程的）

## 非阻塞异步i/o特性
- 非阻塞  异步  单线程和多线程的区别  i/o
- java 多线程同步

## 单线程 和 多线程
- 多线程可能多条线程操作同一个文件 （锁的问题）  单线程没有锁的问题
- 切换线程执行时 会有消耗  （通过切换时间片的方式 达到同时执行多个任务）
- 多线程占用内存 （可以通过线程池来解决） 也是浪费内存
- 同步阻塞 + 多线程 、 异步非阻塞 + 主线是单线程
- node中自己实现了 异步非阻塞的库 libuv(多线程来实现的) 核心是异步

> 多线程的好处是： 可以做压缩合并 大量计算相关的 （cpu密集型）， node适合i/o密集型 （web应用的常见）

## 阻塞非阻塞 、 异步同步
- 我调用一个方法此时我的状态是阻塞还是非阻塞
- 同步阻塞  异步非阻塞

> 当完成任务后会以事件的形式通知我
```

## 2. Node 前的热身

### 2.1 高阶函数

```js
/**
 * 什么是高阶函数?
 * 满足以下2个条件任意一个就是高阶函数
 *      1. 函数的参数是一个函数
 *      2. 函数内部返回一个函数
 * 高阶函数的应用场景:
 *      react中利用高阶函数+受控组件收集数据
 *      基于原来的代码进行扩展 ==> before
 *			自己/第三方封装一些工具类的方法
 */

// before方法 ==> 让所有函数都有这个方法，那么我们在原型上添加这个方法
Function.prototype.before = function(callback) {
  // this ==> formerCode ==> 谁调用before就指向谁
  // callback ==> before传的函数
  // fn ==> before函数返回的新函数
  return (...args) => {
    callback();
    this(...args);
  };
};

// 原来的代码 ==> formerCode
function formerCode(...args) {
  // 人家的逻辑，我们想在调用这个函数前做一些事情
  console.log('我是原来的代码 --- formerCode');
  console.log(args);
}
// 定义before函数
const fn = formerCode.before(() => {
  console.log('我是在原来代码运行前增加的 --- addCode');
});
fn(1, 2, 3, 4, 5);
```

### 2.2 柯里化函数

```js
/**
 * 什么是柯里化函数？
 *    将一个函数的功能更具体一点，分批传入参数
 * 什么时候用柯里化函数？
 *    如果一个函数的参数是固定不变的，那么就使用柯里化函数
 */

// 这是一个求和的函数
function sum(a, b, c, d) {
  return a + b + c + d;
}
// 那么我们调用的时候就是这么传参的
// const res = sum(1, 2, 3, 4)
// console.log(res)

// 我们可以实现一个通用的柯里化函数，自动的将函数转成可以多次传递参数
function currie(fn) {
  function currfn(args = []) {
    // fn.length === sum的形参个数
    // args.length === 每次调用传进来的参数
    return args.length === fn.length
      ? fn(...args)
      : (...subargs) => currfn([...args, ...subargs]);
  }
  return currfn();
}
console.log(currie(sum)(1)(2)(3)(4));
```

### 2.3 回调函数解决并发问题

```js
/**
 * 什么是回调函数?
 *    1. 你自己定义的
 *    2. 外界没有手动调用
 *    3. 最后自己触发了(达到某一个条件内部触发)
 *
 * 回调函数无处不在？
 *    优点: 可以满足大部分的企业需求
 *    缺点: 如果回调函数内部嵌套过多，会造成回调地狱问题
 *
 */
// 使用回调函数解决异步并发问题
// 比如node.js中读取文件我们使用异步读取,最后合并所有的打印结果返回,常规打印是同步的，所以打印可能为空
const fs = require('fs');
const path = require('path');

let saveFn = after(2, (obj) => {
  console.log(obj);
});

function after(count, callback) {
  // 闭包
  let obj = {};
  return function(key, value) {
    obj[key] = value;
    if (--count === 0) {
      callback(obj);
    }
  };
}

fs.readFile(path.resolve(__dirname, './name.txt'), (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  saveFn('name', data.toString());
});
fs.readFile(path.resolve(__dirname, './age.txt'), (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  saveFn('age', data.toString());
});
```

### 2.4 发布订阅模式

```js
/**
 * 什么是发布订阅？
 *    把需要做的事情放入一个容器(订阅),等这件事情你想做的就把容器中的东西取出来然后去执行(发布)
 * 使用场景？
 *		一般的像Vue/React中一些通信手段，比如Vuex/Redux都是采用的发布订阅模式来实现的
 */
const fs = require('fs');
const path = require('path');
const person = {};
const events = {
  arr: [], // 容器
  // 订阅
  on(fn) {
    this.arr.push(fn);
  },
  // 发布
  emit() {
    this.arr.forEach((fn) => fn());
  },
};
events.on(() => {
  if (Object.keys(person).length === 2) {
    console.log(person);
  }
});
fs.readFile(path.resolve(__dirname, './name.txt'), (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  person.name = data.toString();
  events.emit();
});
fs.readFile(path.resolve(__dirname, './age.txt'), (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  person.age = data.toString();
  events.emit();
});
```

### 2.5 观察者模式

```js
/**
 * 什么是观察者模式？
 *    观察者模式一般分为二种
 *        1. 观察者(内部会有一个方法，一旦被观察者状态发生变化，这个方法会被调用，然后传入被观察者的最新状态)
 *        2. 被观察者(内部应该装载着观察者，一旦自己状态改变，应该通知观察者去更新)
 */

// 被观察者
class Observed {
  constructor(name) {
    this.name = name;
    this.status = '难过';
    this.arr = []; // 装载容器
  }
  // 装载函数
  attach(observer) {
    this.arr.push(observer);
  }
  // 改变状态的函数
  setState(newStatus) {
    // 记录旧状态
    const oldVal = this.status;
    // 改变状态,生成新状态
    const newVal = (this.status = newStatus);
    // 通知观察者更新
    this.arr.forEach((fn) => fn.upload(oldVal, newVal, this.name));
  }
}
// 观察者
class Observer {
  constructor(name) {
    this.name = name;
  }
  upload(oldVal, newVal, name) {
    console.log(`${name}之前${oldVal},${this.name}知道了~~`);
    console.log(`${name}现在${newVal},${this.name}知道了~~`);
  }
}
const observed = new Observed('宝宝');
const observer1 = new Observer('爸爸');
const observer2 = new Observer('妈妈');
// 装载观察者
observed.attach(observer1);
observed.attach(observer2);
// 更新宝宝的状态
observed.setState('开心');
setTimeout(() => {
  observed.setState('睡着了');
}, 2000);
```

### 2.6 手写符合 Promise A+规范的 Promise

```js
function corePromise(p2, x, resolve, reject) {
  if (x === p2) {
    reject(new TypeError('孩子,别干傻事'));
  }
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    let called = false;
    try {
      const then = x.then;
      if (typeof then === 'function') {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            corePromise(p2, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        if (called) return;
        called = true;
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}
class Promise {
  static all(values) {
    return new Promise((resolve, reject) => {
      let arr = [],
        count = 0;
      for (let i = 0; i < values.length; i++) {
        const x = values[i];
        if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
          const then = x.then;
          if (typeof then === 'function') {
            then.call(
              x,
              (y) => {
                count++;
                arr[i] = y;
                if (count === values.length) {
                  resolve(arr);
                }
              },
              (r) => {
                reject(r);
              }
            );
          } else {
            count++;
            arr[i] = x;
          }
        } else {
          count++;
          arr[i] = x;
        }
      }
    });
  }
  static promisify(fn) {
    return (...args) => {
      return new Promise((resolve, reject) => {
        fn(...args, (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(data);
        });
      });
    };
  }
  static resolve(value) {
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        value.then(
          (y) => {
            resolve(y);
          },
          (r) => {
            reject(r);
          }
        );
      } else {
        resolve(value);
      }
    });
  }
  static reject(value) {
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        value.then(reject, reject);
      } else {
        reject(value);
      }
    });
  }
  static race(values) {
    return new Promise((resolve, reject) => {
      let called = false;
      for (let i = 0; i < values.length; i++) {
        const x = values[i];
        if (x instanceof Promise) {
          called = true;
          x.then(
            (y) => {
              resolve(y);
            },
            (r) => {
              reject(r);
            }
          );
        } else {
          if (called) return;
          // 普通值
          resolve(x);
        }
      }
    });
  }
  constructor(executor) {
    this._status = 'pending';
    this._value = undefined;
    this._callbacks = {
      onResolved: [],
      onRejected: [],
    };
    const resolve = (value) => {
      if (this._status !== 'pending') return;
      this._status = 'resolved';
      this._value = value;
      this._callbacks.onResolved.forEach((fn) => fn());
    };
    const reject = (reason) => {
      if (this._status !== 'pending') return;
      this._status = 'rejected';
      this._value = reason;
      this._callbacks.onRejected.forEach((fn) => fn());
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onResolved, onRejected) {
    onResolved = typeof onResolved === 'function' ? onResolved : (val) => val;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (err) => {
            throw err;
          };
    let p2 = new Promise((resolve, reject) => {
      if (this._status === 'resolved') {
        setTimeout(() => {
          try {
            const x = onResolved(this._value);
            corePromise(p2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this._status === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this._value);
            corePromise(p2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      }
      if (this._status === 'pending') {
        this._callbacks.onResolved.push(() => {
          setTimeout(() => {
            try {
              const x = onResolved(this._value);
              corePromise(p2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
        this._callbacks.onRejected.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this._value);
              corePromise(p2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          }, 0);
        });
      }
    });
    return p2;
  }
  catch(onRejected) {
    this.then(null, onRejected);
  }
  finally(fn) {
    return this.then(
      (y) => fn() || Promise.resolve(y),
      (r) => fn() || Promise.reject(r)
    );
  }
}
module.exports = Promise;

// 测试我们写的Promise是否符合promise a+ 规范
// promise a+ 规范文档地址: https://promisesaplus.com/
// promise a+ 规范测试文档地址: https://github.com/promises-aplus/promises-tests
// 测试流程: yarn --> 下载包    yarn start 跑测试
Promise.deferred = function() {
  let dot = {};
  // 测试我们的promise,a+规范中只有resolve，reject，并没有其他的一些方法
  dot.promise = new Promise((resolve, reject) => {
    dot.resolve = resolve; // 测试我们自己实现的resolve
    dot.reject = reject; // 测试我们自己实现的reject
  });
  return dot;
};
module.exports = Promise;
```

### 2.7 Promise 实现红绿灯

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    div {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 1px solid #ccc;
      transition: all 0.3s linear;
      margin: 10px;
    }

    .red {
      background-color: red;
    }

    .yellow {
      background-color: yellow;
    }

    .green {
      background-color: green;
    }
  </style>
</head>

<body>
  <div></div>
  <div></div>
  <div></div>
  <script>
    const divList = document.querySelectorAll('div')
    const red = divList[0]
    const yellow = divList[1]
    const green = divList[2]
    !(function light() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (red.className.indexOf('red') === -1) {
            green.classList.remove('green')
            red.classList.add('red')
          }
          resolve()
        }, 3000)
      })
        .then(() => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              if (yellow.className.indexOf('yellow') === -1) {
                red.classList.remove('red')
                yellow.classList.add('yellow')
              }
              resolve()
            }, 2000)
          })
        })
        .then(() => {

          return new Promise((resolve, reject) => {
            setTimeout(() => {
              if (green.className.indexOf('green') === -1) {
                yellow.classList.remove('yellow')
                green.classList.add('green')
              }
              resolve()
            }, 1000)
          })
        })
        .then(() => {
          setTimeout(() => {
            divList.forEach(item => item.className = '')
          }, 1000)
          light()
        })
    })()



  </script>
</body>

</html>
```

### 2.8 环境变量

```js
/**
 *
 * 环境变量:
 *    1. 当前代码的可运行环境，这个可运行环境中的变量(process)就叫做环境变量
 *    2. 一般分为全局环境变量和临时环境变量
 *    3. 全局环境变量: 在电脑中配置死的，比如：window中就在电脑-->高级系统设置-->环境变量
 *    4. 临时环境变量: 比如项目中一般都会有这个功能，根据不同的环境变量去读取不同的配置文件,区分开发、生产、测试、预生产
 *    5. 设置临时环境变量:
 *       windows下命令: set xx=xx
 *       mac下命令: export xx=xx
 *    6. 解决不同系统运行指令不一样的问题 --> 第三方插件(cross-env)
 */

// 根据不同的环境加载不同的配置
let prefix = ''
if (process.env.NODE_ENV === 'dev') {
  // 开发环境
  prefix = '/dev/api'
} else if (process.env.NODE_ENV === 'prod') {
  // 生产环境
  prefix = '/prod/api'
} else if (process.env.NODE_ENV === 'test') {
  // 测试环境
  prefix = '/test/api'
} else if (process.env.NODE_ENV === 'bug') {
  // 提交bug环境
  prefix = '/bug/api'
} else {
  // 预发布环境
  prefix = '/willProd/api'
}
module.exports = prefix

const config = require('./config')
console.log(config)

`package.json文件中`
{
  "name": "varvalid",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "cross-env NODE_ENV=dev node index.js",
    "prod": "cross-env NODE_ENV=prod node index.js",
    "test": "cross-env NODE_ENV=test node index.js",
    "bug": "cross-env NODE_ENV=bug node index.js",
    "willProd": "cross-env NODE_ENV=willProd node index.js",
    "dev:mac": "export NODE_ENV=dev && node index.js",
    "prod:mac": "export NODE_ENV=prod && node index.js",
    "test:mac": "export NODE_ENV=test && node index.js",
    "bug:mac": "export NODE_ENV=bug && node index.js",
    "willProd:mac": "export NODE_ENV=willProd && node index.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cross-env": "^7.0.3"
  }
}
```

### 2.9 自定义全局包

```js
/**
 * 自定义全局包:
 *    1. 需要有一个bin目录
 *    2. 在bin目录中新建一个文件
 *    3. 在该文件的首行指定环境  #! /usr/bin/env node(代表node环境)
 *    4. 初始化一个package.json文件
 *    5. 在package.json中指定bin字段 "bin": {
                        "zcf": "./bin/zcf"
                      },
      6. key为指令名字，value为输入该指令，运行的文件
      7. 通过npm link 链接(会将该文件临时存放到全局npm目录中)
 */
`zcf文件中`
#! /usr/bin/env node
require('colors');
console.log(`
iiiiiiiiiiiiii   iiiiiiiiiiiiii   iiiiiiiiiiiiiii
          iii    ii               ii
       iii       ii               iiiiiiiiiiiiiii
    iii          ii               ii
iiiiiiiiiiiiiii  iiiiiiiiiiiiii   ii
`.cyan);
console.log(`

`)
console.log(`
yyyyyyyyyyyyyyy   yy      yy      yy          yy
yy                  yy  yy        yy          yy
yy                    yy          yyyyyyyyyyyyyy
yy                  yy   yy       yy          yy
yyyyyyyyyyyyyyy  yy         yy    yy          yy
`.cyan)
```

### 3.0 虚拟 dom 渲染成真实 dom

```js
const vDoms = [
  {
    type: 'h1',
    attribute: 'h1',
    content: '你好',
    children: [
      {
        type: 'h2',
        attribute: 'h2',
        content: '你好2',
        children: [
          {
            type: 'h3',
            attribute: 'h3',
            content: '你好3',
          },
        ],
      },
    ],
  },
  {
    type: 'div',
    attribute: 'div',
    content: 'div1111',
  },
  {
    type: 'p',
    attribute: 'p',
    content: 'p1111',
    children: [
      {
        type: 'p',
        attribute: 'p1111',
        content: 'p儿子1111',
      },
      {
        type: 'p',
        attribute: 'p2222',
        content: 'p儿子2222',
      },
    ],
  },
  {
    type: 'span',
    attribute: 'span',
    content: 'span1111',
    children: [],
  },
];
class renderVDom {
  constructor(vDoms) {
    // 初始化文档碎片
    this.fragment = document.createDocumentFragment();
    this.count = 0;
    this.vDoms = vDoms;
    // 开始渲染vDoms
    this.render(vDoms);
  }
  // 渲染成dom节点
  render(vDoms, parentDom) {
    // 判断数据类型
    if (vDoms.constructor.name !== 'Array') {
      console.error('传入数据格式需要为一个数组');
    }
    for (let i = 0; i < vDoms.length; i++) {
      // 每一个虚拟dom对象
      const vDom = vDoms[i];
      // 解构拿到里面的3个属性
      const { type, content, attribute } = vDom;
      // 如果type不存在,输出错误
      if (!type) {
        console.error('类型错误');
      }
      // 开始编译vDom，第一次的parentDom为undefined
      this.compile(vDom, parentDom);
    }
  }
  // 编译成dom
  compile(vDom, parentDom) {
    const { type, content, attribute } = vDom;
    // 判断parentDom是否为undefined，如果为undefiend就代表是一级节点，就应该插入到文档碎片里面，如果不是，就应该插入到父级节点中
    const parentEl = parentDom ? parentDom : this.fragment;
    // 创建标签
    const dom = document.createElement(type);
    // 写入标签内容
    dom.textContent = content;
    // 如果属性存在就设置属性
    if (attribute) {
      this.setDomAttribute(dom, attribute);
    }
    // 如果有children属性并且长度大于0
    if (vDom.children && vDom.children.length > 0) {
      // 递归渲染，这个传的dom就代表是父级了，那parentDom就会有值
      this.render(vDom.children, dom);
    }
    // 如果
    if (parentEl === this.fragment) {
      this.count++;
    }
    this.appendFragment(parentEl, dom);
  }
  // 设置属性
  setDomAttribute(dom, attribute) {
    dom.setAttribute('class', attribute);
  }
  // 插入到文档碎片
  appendFragment(parentDom, dom) {
    parentDom.appendChild(dom);
    if (this.count === this.vDoms.length) {
      this.appendNode(this.fragment);
    }
  }
  // 把文档碎片插入到指定元素中
  appendNode(fragment, node) {
    node = node ? node : document.body;
    node.appendChild(fragment);
  }
}
new renderVDom(vDoms);
```

## 3. EventLoop

```js
默认是先从上到下依次执行代码,
  依次清空每个队列中的回调方法.每调用一个宏任务后都会清空微任务;
// 宏任务 （老版本中 是每清空完毕一个队列后才会去执行微任务）
// timers 存放所有定时器回调的 [fn,fn,fn]
// poll阶段 主要存放的异步的i/o操作 node中基本上所有的异步api的回调都会在这个阶段来处理  []
// check是存放setImmediate的回调  []
// 主栈 => 检测时间又没有到达的定时，有就执行 (清空任务) => 下一个阶段就是poll(i/o操作) => 也是逐一清空 => 看setImmediate队列中是否有内容，如果有内容则清空check阶段， 如果没有就在这阻塞 => 不停的看定时器中有没有到达时间，如果有则回去继续执行
```

## 4. Package.json

```js
依赖分为 开发依赖 项目依赖 同版本依赖 捆绑依赖（打包依赖 npm pack） 可选依赖
开发依赖:devDependencies ==> 开发环境需要用到的包
项目依赖:dependencies ==> 生产环境需要用到的包
同版本依赖:peerDependencies ==> 同一个版本需要的依赖
捆绑依赖:bundledDependencies ==> 下某一个包时对应的捆绑依赖，没有下载会提示
打包依赖命令: npm pack

## scripts
scripts中可以配置命令，然后通过npm/yarn来启动命令

## npx
npx 是node5.2之后赠送给你的
npx 直接运行node_modules/.bin文件夹下命令 多了一个下载功能 用完即删除 方便
```

## 5. Commjs 规范

```js
## 为什么需要模块化？
可以解决冲突、实现高内聚低耦合
1.每一个文件都是一个模块
2.需要通过module.exports 导出需要给别人使用的值
3.通过require 拿到需要的结果

## 实现Commjs规范
const path = require('path');
const fs = require('fs');
const vm = require('vm'); // 虚拟机模块 创建沙箱用的
function Module(id) {
    this.id = id;
    this.exports = {};
}
// 内部可能有n种解析规则
Module._extensions = {
    '.js'(module) {
        let script = fs.readFileSync(module.id, 'utf8'); // 读取文件的内容
        let code = `(function (exports, require, module, __filename, __dirname) {
            ${script}
        })`;
        let func = vm.runInThisContext(code);
        let exports = module.exports;
        let thisValue = exports
        let dirname = path.dirname(module.id);
        func.call(thisValue,exports,req,module,module.id,dirname);
    },
    '.json'(module) {
        let script = fs.readFileSync(module.id, 'utf8');
        module.exports = JSON.parse(script)
    } // 根据不同的后缀 定义解析规则
}
Module._resolveFilename = function(id) {
    let filePath = path.resolve(__dirname, id);
    // 我应该看下这个文件路径是否存在，如果不存在尝试添加后缀
    let isExsits = fs.existsSync(filePath);
    if (isExsits) return filePath; // 文件存在直接返回
    let keys = Object.keys(Module._extensions); // [.js,.json]

    for (let i = 0; i < keys.length; i++) {
        let newFilePath = filePath + keys[i];
        if (fs.existsSync(newFilePath)) return newFilePath
    }
    throw new Error('模块文件不存在')
}
Module.prototype.load = function() {
    // 核心的加载，根据文件不同的后缀名进行加载
    let extname = path.extname(this.id);
    Module._extensions[extname](this);
}
Module._cache = {};
Module._load = function(id) {
    let filename = Module._resolveFilename(id); // 就是将用户的路径变成绝对路径

    if(Module._cache[filename]){
        return Module._cache[filename].exports; // 如果有缓存直接将上次缓存的结果返回即可
    }

    let module = new Module(filename);
    Module._cache[filename] = module;
    module.load(); // 内部会读取文件 用户会给exports对象赋值
    return module.exports;
}
function req(id) { // 根据用户名加载模块
    return Module._load(id);
}
const r = require('./b.js');

// 基本数据类型和 引用类型的区别
setTimeout(() => {
    let  r = require('./b.js');
    console.log(r);
}, 2000);
console.log(r);

// 调试方法
// node --inspect-brk 文件名
// chrome://inspect/
// vscode 直接进行调试  要配置文件，删除跳过源代码那块
```

## 6. Event 使用

```js
const Events = require('./myEvents');
const event = new Events();
/**
 * newListener 是events事件监听器自带的，每次绑定一个事件后都会触发newListener对应的回调函数
 */
// event.on('newListener', (event, listener) => {
//   console.log(event, listener)
// })
// event.on('newListener', (event, listener) => {
//   console.log(event, listener)
// })
event.on('test', (value) => {
  console.log(value);
});
event.once('test2', (...args) => {
  console.log('只触发一次', ...args);
});
event.emit('test2', 1231, 111);
event.emit('test2', 2113, 222);
// event.emit('test', '吃')
// event.emit('test', '喝')
// event.emit('test', '玩')
```

### 6.1 手写 Event

```js
// { eventName1: [fn1, fn2] }
class Events {
  constructor() {
    this.events = {};
  }
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [callback];
    } else {
      this.events[eventName] = [...this.events[eventName], callback];
    }
  }
  emit(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((fn) => fn(...args));
    }
  }
  once(eventName, callback) {
    // 绑定之后被触发一次就解绑
    const fn = (...args) => {
      callback(...args);
      this.off(eventName, fn);
    };
    this.on(eventName, fn);
  }
  off(eventName, callback) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter((fn) => {
        return fn !== callback;
      });
    }
  }
}
module.exports = Events;
```

## 7. 读取和写入(fs)

```js
// node中fs方法分为2种，同步和异步
// 同步操作会阻塞，我们一般都使用异步的方法
// 异步操作node中很常见，一般都是通过回调函数的方法通知我们，第一个参数一般都是为error

// 优点:不会阻塞，读取速度快，适用于小文件(小于64kb的都属于小文件)
// 缺点:不适用大文件读写操作，，因为是把所有的数据都读完在进行写入的，可能会导致内存溢出
// 解决方式: 可以读取一点写入一点，可以通过 fs.open,fs.read,fs.write
```

### 7.1 普通方式读取和写入

```js
const fs = require('fs');
const path = require('path');

fs.readFile(path.resolve(__dirname, './test.md'), (err, data) => {
  if (err) {
    return console.log(err);
  }
  fs.writeFile(path.resolve(__dirname, './copy.md'), data, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('copy success');
  });
});
```

### 7.2 读取部分读取和写入部分数据

#### 7.2.1 普通方式

```js
const fs = require('fs');
const path = require('path');

const buffer = Buffer.alloc(3);
fs.open(path.resolve(__dirname, './test.md'), 'r', 0o666, (err, fd) => {
  if (err) {
    return console.log(err);
  }
  // console.log(fd) // 读取到的是字节 22
  /**
   * fd:文件描述符
   * buffer:写入哪个buffer
   * 0:从buffer的哪个位置开始写
   * 3:每次写入几个
   * 0:读取文件的位置
   */
  fs.read(fd, buffer, 0, 3, 0, (err, bytesRead) => {
    if (err) {
      return console.log(err);
    }
    // console.log(bytesRead) // 读取到的是真实字节的个数 一个中文字符代表3个字节
    // console.log(buffer, 'buffer') // <Buffer e6 83 a0>
    fs.open(path.resolve(__dirname, './copy.md'), 'w', (err, wfd) => {
      if (err) {
        return console.log(err);
      }
      fs.write(wfd, buffer, (err, written) => {
        if (err) {
          return console.log(err);
        }
        console.log(written, 'written'); // 写入字节的个数
        // 关闭
        fs.close(fd, () => {});
        fs.close(wfd, () => {});
      });
    });
  });
});
```

#### 7.2.2 递归写入

```js
const fs = require('fs');
const path = require('path');

let position = 0;
let size = 1;
let buffer = Buffer.alloc(size);

// 可以基于流来实现 大文件的读取
// fs中 createReadStream createWriteStream  基于stream模块来实现的
fs.open(path.resolve(__dirname, './test.md'), 'r', (err, rfd) => {
  fs.open(path.resolve(__dirname, './copy.md'), 'w', (err, wfd) => {
    function next() {
      fs.read(rfd, buffer, 0, size, position, (err, bytesRead) => {
        if (bytesRead > 0) {
          // 读到了内容
          fs.write(wfd, buffer, 0, bytesRead, position, (err, written) => {
            // 写入成功,修正下次读取位置
            position += bytesRead;
            next();
          });
        } else {
          // 读取完毕
          fs.close(rfd, () => {});
          fs.close(wfd, () => {});
        }
      });
    }
    next();
  });
});
```

### 7.3 可读流使用

```js
const fs = require('fs');
const path = require('path');
const arr = [];
const rs = fs.createReadStream(path.resolve(__dirname, './test.md'), {
  flags: 'r',
  encoding: null,
  mode: 0o666,
  autoClose: true,
  start: 0,
  highWaterMark: 3, // 每次读取3个字节
});
rs.on('open', (fd) => {
  console.log(fd, 'fd');
});
rs.on('data', (chunk) => {
  arr.push(chunk);
  console.log(chunk, 'chunk');
});
rs.on('end', () => {
  console.log('end');
  console.log(Buffer.concat(arr).toString());
});
rs.on('close', () => {
  console.log('close');
});
```

### 7.4 手写可读流

```js
const fs = require('fs');
const Event = require('events');
class ReadStream extends Event {
  // 初始化参数
  constructor(path, options) {
    super(); // 继承父类Event的方法和属性
    this.path = path;
    this.encoding = options.encoding || null;
    this.fd = options.fd || null;
    this.flags = options.flags || 'r';
    this.mode = options.mode || 0o666;
    this.autoClose = options.autoClose || true;
    this.start = options.start || 0;
    this.end = options.end || undefined;
    this.highWaterMark = options.highWaterMark || 64 * 1024; // 每次读取64kb
    this.offset = 0;
    this.open(); // 打开文件
    // 每次绑定事件都会触发此事件
    this.on('newListener', (type) => {
      if (type === 'data') {
        // 说明外界有绑定消费(data)事件
        this.read(); // 读取文件
      }
    });
  }
  // 打开文件
  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) {
        this.destroy(err);
        return;
      }
      if (!this.fd) {
        this.fd = fd;
      }
      this.emit('open', fd);
    });
  }
  // 消费
  read() {
    if (!this.fd) {
      this.once('open', () => this.read());
    } else {
      // 如果外界传了end，就要和highWaterMark进行比较
      const readBytes = this.end
        ? Math.min(this.highWaterMark, this.end - this.offset + 1)
        : this.highWaterMark;
      const buffer = Buffer.alloc(readBytes);
      fs.read(this.fd, buffer, 0, readBytes, this.offset, (err, bytesRead) => {
        if (err) {
          this.destroy(err);
          return;
        }
        if (bytesRead > 0) {
          // 正在读取
          this.emit('data', buffer);
          // 修正下次读取的偏移量
          this.offset += bytesRead;
          // 递归读取
          this.read();
        } else {
          // 读完了
          this.destroy();
        }
      });
    }
  }
  // 错误或者关闭
  destroy(err) {
    if (err) {
      // 分发错误事件
      this.emit('error', err);
    } else {
      this.emit('end'); // 分发读取结束事件
      if (this.autoClose) {
        fs.close(this.fd, () => {
          this.emit('close'); // 分发关闭事件
        });
      }
    }
  }
}

module.exports = ReadStream;
```

### 7.5 可写流使用

```js
const fs = require('fs');
const path = require('path');

const ws = fs.createWriteStream(path.resolve(__dirname, './copy.md'), {
  flags: 'w',
  encoding: null,
  mode: 0o666,
  autoClose: true,
  highWaterMark: 3, // 期望写入的字节数，默认为16kb,如果达到期望值，会触发drain事件，并且write返回值为false
});
ws.on('drain', () => {
  console.log('我触发了');
  write();
});
let index = 0;
function write() {
  let writting = true;
  while (index < 10) {
    writting = ws.write(index + '');
    index++;
    if (!writting) break;
  }
}
write();
```

### 7.6 手写可写流

```js
```

## 8. 链表

### 8.1 单向链表

```js
/**
 * 链表是什么?
 * 链表是一种线性链式的存储结构
 * 简单理解:
 *    用一根链子把一个个的元素串起来
 *    比如我们有一个数组，数组中有一万个元素,[1,2,3,...,10000],那么此时我们如果把1给删了，那么后面的9999个元素
 *    都需要向前移动一位，性能开销比较大,此时我们如果换成链表的方式
 *    head:链子头
 *    el:链子上的元素
 *    next:链子上的当前元素的下一个元素
 *
 *    head
 *    el:1    el:2    el:3    el:...  el:10000
 *    next ==>next ==>next ==>next ==>next ==> null
 *    此时我们如果要把2给删了，我们只需要让1的next指向3是不是就ok了，更改指针的方式来软删除元素
 */

// 元素类
class Node {
  constructor(el, next) {
    this.el = el;
    this.next = next;
  }
}

// 链表(数据结构中一定要有增删改查)
class LinkedList {
  constructor() {
    // { el: 10, next: null }
    // { el: 20: next: { el: 10, next: null } }
    // { el: 30, next: { 20: next: { el: 10, next: null } } }
    this.head = null; // 链子头，一开始没有元素，所以我们的链子头是null
    this.size = 0; // 链子的长度
  }
  /**
   *
   * @param {*} index 根据索引去查询元素
   */
  _getNode(index) {
    let node = this.head;
    for (let i = 0; i < index; i++) {
      node = node.next;
    }
    return node;
  }
  /**
   *
   * @param {*} index 元素索引
   * @param {*} el 元素
   * 如果参数只有1个，那么就默认为向后增加元素
   */
  add(index, el) {
    if (arguments.length === 1) {
      el = index;
      index = this.size;
    }
    if (index === 0) {
      this.head = new Node(el, this.head);
    } else {
      // 应该根据传进来的索引找到当前元素的上一项，让上一项的指针指向当前元素，当前元素的指针指向之前上一项的指针指向的元素
      // 查到当前元素对应索引的上一项，根据索引去查元素
      const preNode = this._getNode(index - 1);
      // console.log(preNode)
      preNode.next = new Node(el, preNode.next);
    }
    this.size++;
  }
  /**
   *
   * @param {*} index 删除指定位置索引
   */
  remove(index) {
    let removeNode;
    if (index === 0) {
      // 移除头部节点
      // 直接让指针指向原来链子头的下一个元素
      const head = (removeNode = this.head);
      this.head = head.next;
    } else {
      // 查找到索引对应的元素的上一个元素,让上一个元素的指针指向当前元素的下一个
      const preNode = this._getNode(index - 1);
      removeNode = preNode.next;
      preNode.next = preNode.next.next;
    }
    this.size--;
    return removeNode.el;
  }

  /**
   *
   * @param {*} index 元素索引
   * @param {*} el 想修改的值
   */
  set(index, el) {
    const node = this._getNode(index);
    node.el = el;
    return node;
  }

  /**
   *
   * @param {*} index 元素索引
   */
  get(index) {
    return this._getNode(index).el;
  }

  // 清空链表
  clear() {
    this.size = 0;
    this.head = null;
  }
}

const ll = new LinkedList();
// ll.add(10)
// ll.add(20)
// ll.add(30)
// ll.add(40)
ll.add(0, 10);
ll.add(1, 20);
ll.add(2, 30);
ll.add(3, 40);
// ll.add(3, 100)
// console.log(ll.set(0, 'set40'))
// console.log(ll.remove(3))
// console.log(ll.get(3))
// ll.set(3, 'set10')
// ll.clear()
console.dir(ll, { depth: 1000 });
// new FormData
```

### 8.2 反转单向链表(递归实现)

```js
class Node {
  constructor(el, next) {
    this.el = el;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  _getNode(index) {
    let node = this.head;
    for (let i = 0; i < index; i++) {
      node = node.next;
    }
    return node;
  }

  add(index, el) {
    if (arguments.length === 1) {
      el = index;
      index = this.size;
    }
    if (index === 0) {
      this.head = new Node(el, this.head);
    } else {
      const preNode = this._getNode(index - 1);
      preNode.next = new Node(el, preNode.next);
    }
    this.size++;
  }

  remove(index) {
    let removeNode;
    if (index === 0) {
      const head = (removeNode = this.head);
      this.head = head.next;
    } else {
      const preNode = this._getNode(index - 1);
      removeNode = preNode.next;
      preNode.next = preNode.next.next;
    }
    this.size--;
    return removeNode.el;
  }

  set(index, el) {
    const node = this._getNode(index);
    node.el = el;
    return node;
  }

  get(index) {
    return this._getNode(index).el;
  }

  clear() {
    this.size = 0;
    this.head = null;
  }

  // 反转链表
  reverseLinkedList() {
    // 链表结构 10 => 20 => 30 => 40 => null
    // 反转链表 40 => 30 => 20 => 10 => null
    // 递归思路: 找到最底层节点，两两交换
    function reverse(head) {
      // 如果找到最底层，递归结束，从下往上依次返回
      if (head.next === null) return head;
      // 递归找到最底层
      const newHead = reverse(head.next);
      // newHead 是最后一个，head是最后一个的上一个
      // 让最后一个的next指向上一个，让上一个的next指向null
      head.next.next = head;
      head.next = null;
      // console.log(newHead, 'newHead')
      // console.log(head, 'head')
      return newHead;
    }
    this.head = reverse(this.head);
    return this.head;
  }
}

const ll = new LinkedList();
ll.add(10);
ll.add(20);
ll.add(30);
ll.add(40);
// ll.add(3, 100)

console.dir(ll, { depth: 1000 });
ll.reverseLinkedList();
console.dir(ll, { depth: 1000 });
```

### 8.3 反转单向链表(循环实现)

```js
class Node {
  constructor(el, next) {
    this.el = el;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  _getNode(index) {
    let node = this.head;
    for (let i = 0; i < index; i++) {
      node = node.next;
    }
    return node;
  }

  add(index, el) {
    if (arguments.length === 1) {
      el = index;
      index = this.size;
    }
    if (index === 0) {
      this.head = new Node(el, this.head);
    } else {
      const preNode = this._getNode(index - 1);
      preNode.next = new Node(el, preNode.next);
    }
    this.size++;
  }

  remove(index) {
    let removeNode;
    if (index === 0) {
      const head = (removeNode = this.head);
      this.head = head.next;
    } else {
      const preNode = this._getNode(index - 1);
      removeNode = preNode.next;
      preNode.next = preNode.next.next;
    }
    this.size--;
    return removeNode.el;
  }

  set(index, el) {
    const node = this._getNode(index);
    node.el = el;
    return node;
  }

  get(index) {
    return this._getNode(index).el;
  }

  clear() {
    this.size = 0;
    this.head = null;
  }

  // 反转链表
  reverseLinkedList() {
    // 循环实现
    // 10 => 20 => 30 => null
    // 10 => null
    // 20 => 10 => null
    // 30 => 20 => 10 => null
    let head = this.head;
    let newHead = null;
    while (head !== null) {
      // 拿到每一个头的指针
      let temp = head.next;
      newHead = new Node(head.el, newHead);
      head = temp;
    }
    this.head = newHead;
    return newHead;
  }
}

const ll = new LinkedList();
ll.add(10);
ll.add(20);
ll.add(30);
ll.add(40);
// ll.add(3, 100)
console.dir(ll, { depth: 1000 });
ll.reverseLinkedList();
console.dir(ll, { depth: 1000 });
```

## 9. 树的遍历

## 10. 文件夹递归删除

```js
```

## 11. http 概念

```js
const http = require('http');
const url = require('url');
// curl可以发送请求
const server = http.createServer((req, res) => {
  // --------------  请求首行 -------------
  console.log(req.method); // 请求方式默认是大写的 GET
  console.log(req.url); // /test?a=b
  const { pathname, query } = url.parse(req.url, true); // true会将query变成对象格式
  console.log(pathname, query); // pathname = /test  query = { a: 'b' }
  console.log(req.httpVersion); // http协议版本，http本质是基于tcp协议的，在tcp的基础上增加了内容，然后进行分割，放到req/res上面的

  // --------------  请求头 -------------
  console.log(req.headers); // key都是小写的

  // --------------  请求体 -------------
  // console.log(req.body)
  // req是一个可读流
  // res是一个可写流

  // 因为chrome浏览器采用的是gbk编码，后台返回的是utf-8编码，所以会乱码
  // 解决乱码方式：设置响应头告诉浏览器要采用utf-8的方式
  // 这里的utf-8也可以简写utf8,但是ie不支持这么写
  res.setHeader('Content-type', 'text/html;charset=utf-8');
  res.write('你好啊啊');
  res.write('你好啊啊');
  res.write('你好啊啊');
  // end中不能写入数字，因为res是一个可写流，可写流内部是读取buffer进行拼接，buffer内部不可以放入数字
  res.end('112123123123');
});

server.listen(3000);
```

## 12. 手写 ejs 模板引擎

```js
```

## 13. http 搭建静态服务

#### 13.1 目录结构如下:

bin/ 全局命令目录

​ config.js 终端参数配置

​ hhz 命令启动文件

​ utils.js 工具函数文件

404.html 404 页面

index.js 核心代码

template.html ejs 模板页面

package.json 包描述文件

#### 13.2 bin/config.js 文件代码如下:

```js
module.exports = {
  // 端口号
  port: {
    option: '-p,--port <n>',
    default: 3000,
    desc: 'set server port',
    usage: 'hhz -p/--port <n>',
  },
  // 运行目录
  directory: {
    option: '-d,--directory <n>',
    default: process.cwd(),
    desc: 'set server directory',
    usage: 'hhz -d/--directory <n>',
  },
  // 缓存
  cache: {
    option: '-c,--cache <n>',
    default: 'no-cache',
    desc: 'set server cache',
    usage: 'hhz -c/--cache <n>',
  },
};
```

#### 13.3 bin/hhz 文件代码如下:

```js
#! /usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const Server = require('../index.js');
const config = require('./config');
const { mergeObj } = require('./utils');
let usageList = [],
  terminalOps = {}; // 终端默认参数
Object.entries(config).forEach(([key, value]) => {
  program.option(value.option, value.desc); // 设置终端help打印
  terminalOps[key] = value.default;
  usageList.push(value.usage);
});
// 监听用户--help事件
program.on('--help', () => {
  console.log('Examples:');
  // 提示用法
  usageList.forEach((line) => {
    console.log('  ' + chalk.green(`${line}`));
  });
});
program.parse(process.argv); // 解析用户执行时的参数
// console.log(program._optionValues) // 用户执行参数
// 合并配置
terminalOps = mergeObj(terminalOps, program._optionValues);

const server = new Server(terminalOps);
server.start();
```

#### 13.4 bin/utils.js 文件代码如下:

```js
// 合并对象
// o1 => 02
const mergeObj = (o1, o2) => {
  const obj = {};
  for (let key in o1) {
    if (key === 'port' && key in o2) {
      o2[key] = o2[key] >>> 0;
    }
    obj[key] = key in o2 ? o2[key] : o1[key];
  }
  return obj;
};
module.exports = {
  mergeObj,
};
```

#### 13.5 404.html 文件代码如下:

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>404-对不起！您访问的页面不存在</title>
    <style type="text/css">
      .head404 {
        width: 580px;
        height: 234px;
        margin: 50px auto 0 auto;
        background: url(https://www.daixiaorui.com/Public/images/head404.png) no-repeat;
      }

      .txtbg404 {
        width: 499px;
        height: 169px;
        margin: 10px auto 0 auto;
        background: url(https://www.daixiaorui.com/Public/images/txtbg404.png) no-repeat;
      }

      .txtbg404 .txtbox {
        width: 390px;
        position: relative;
        top: 30px;
        left: 60px;
        color: #eee;
        font-size: 13px;
      }

      .txtbg404 .txtbox p {
        margin: 5px 0;
        line-height: 18px;
      }

      .txtbg404 .txtbox .paddingbox {
        padding-top: 15px;
      }

      .txtbg404 .txtbox p a {
        color: #eee;
        text-decoration: none;
      }

      .txtbg404 .txtbox p a:hover {
        color: #FC9D1D;
        text-decoration: underline;
      }
    </style>

  </head>



  <body bgcolor="#494949">
    <div class="head404"></div>
    <div class="txtbg404">
      <div class="txtbox">
        <p>对不起，您请求的页面不存在、或已被删除、或暂时不可用</p>
      </div>
    </div>
  </body>

  </html>
</body>

</html>
```

#### 13.6 index.js 文件代码如下:

```js
const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const path = require('path');
const mime = require('mime');
const chalk = require('chalk');
const ejs = require('ejs');
const crypto = require('crypto');
const { createReadStream } = require('fs');
class Server {
  constructor(options) {
    this.port = options.port;
    this.directory = options.directory;
    this.cache = options.cache;
  }
  // 处理请求
  async handleRequest(req, res) {
    let { pathname } = url.parse(req.url);
    // 解决中文路径转成buffer问题
    pathname = decodeURIComponent(pathname);
    // 拼接文件路径
    const filePath = path.join(this.directory, pathname);
    try {
      // 读取文件信息
      const statObj = await fs.stat(filePath);
      // 如果是目录
      if (statObj.isDirectory()) {
        // 读取目录
        const dirs = await fs.readdir(filePath);
        const strHtml = await ejs.renderFile(
          path.resolve(__dirname, './template.html'),
          {
            dirs: dirs.map((item) => {
              return {
                pathname: item,
                path: path.join(pathname, item),
              };
            }),
          }
        );
        // 返回目录列表
        this.sendDirectory(strHtml, res);
        // 服务端渲染
      } else {
        // 如果是文件
        return this.sendFile(filePath, res, req, statObj);
      }
    } catch (error) {
      this.sendError(error, res);
    }
  }

  // 缓存文件
  async cacheFile(file, res, req, statObj) {
    /**
     * 思路:
     *    强制缓存 + 协商缓存
     *    如果没超过强制缓存的时间，就不发请求，如果超过强制缓存的时间，就对比文件修改时间和etag标识，如果都一样，继续走缓存，如果不一样，就返回最新的资源
     */
    res.setHeader('Cache-Control', 'max-age=5');
    const cTime = statObj.ctime.toUTCString();
    const Etag = crypto
      .createHash('md5')
      .update(await fs.readFile(file))
      .digest('base64');
    res.setHeader('Last-Modified', cTime);
    res.setHeader('Etag', Etag);
    const IfModifiedSice = req.headers['if-modified-since'];
    const IfNoneMatch = req.headers['if-none-match'];
    if (Etag !== IfNoneMatch) {
      return false;
    }
    if (cTime !== IfModifiedSice) {
      return false;
    }
    return true;
  }

  // 返回文件
  async sendFile(file, res, req, statObj) {
    // 获取文件类型
    const fileType = mime.getType(file);
    // 设置缓存
    if (await this.cacheFile(file, res, req, statObj)) {
      res.statusCode = 304;
      return res.end();
    }
    // 设置响应头
    res.setHeader('Content-type', `${fileType};charset=utf-8`);
    // 返回
    createReadStream(file).pipe(res);
  }

  // 返回目录
  sendDirectory(html, res) {
    res.setHeader('Content-type', 'text/html;charset=utf-8');
    res.end(html);
  }

  // 返回错误
  sendError(err, res) {
    res.statusCode = 404;
    createReadStream(path.resolve(__dirname, './404.html')).pipe(res);
  }

  // 启动服务
  start() {
    const server = http.createServer(this.handleRequest.bind(this));
    server.listen(this.port, () => {
      console.log(chalk.yellow('Server is Running...'));
      console.log(`http://127.0.0.1:${chalk.green(this.port)}`);
    });
  }
}

module.exports = Server;
```

#### 13.7 template.html 文件代码如下:

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    .live {
      overflow: hidden;
    }

    .live>li {
      list-style: none;
      position: relative;
      padding: 0 0 0 2em;
      margin: 0 0 .5em 10px;
      -webkit-transition: .12s;
      transition: .12s;
    }

    .live>li::before {
      position: absolute;
      content: '\2022';
      font-family: Arial;
      color: #FFF;
      top: 0;
      left: 0;
      text-align: center;
      font-size: 2em;
      opacity: .5;
      line-height: .75;
      -webkit-transition: .5s;
      transition: .5s;
    }

    .live>li:hover {
      color: #FFF;
    }

    .live>li:hover::before {
      -webkit-transform: scale(2);
      -ms-transform: scale(2);
      transform: scale(2);
      opacity: 1;
      text-shadow: 0 0 4px;
      -webkit-transition: .1s;
      transition: .1s;
    }

    .live.type2>li::before {
      content: '';
      width: 10px;
      height: 10px;
      background: #FFF;
      border-radius: 3px;
      line-height: 0;
      top: .27em;
      left: 5px;
    }

    .live.type2>li:hover::before {
      -webkit-transform: none;
      -ms-transform: none;
      transform: none;
      border-radius: 5px;
      width: 25px;
      left: -10px;
      background: #BA5353;
    }

    .live.numbers {
      counter-reset: xxx 0;
    }

    .live.numbers>li::before {
      content: counter(xxx, decimal) ".";
      counter-increment: xxx 1;
      font-family: 'Roboto Condensed';
      font-size: 1em;
      opacity: .5;
      line-height: 1.4;
      -webkit-transition: .5s;
      transition: .5s;
    }

    .live.numbers>li:hover:before {
      opacity: 1;
      left: -10px;
      -webkit-transform: none;
      -ms-transform: none;
      transform: none;
      text-shadow: none;
      -webkit-transition: .12s;
      transition: .12s;
    }

    html {
      height: 100%;
    }

    body {
      height: 100%;
      font: 1.33em 'Roboto Condensed', arial;
      color: #FFF;
      text-align: center;
      background-image: -webkit-radial-gradient(circle, #3c3b52 0%, #252233 80%);
      background-image: radial-gradient(circle, #3c3b52 0%, #252233 80%);
    }

    h1 {
      margin: .5em 0 0;
      padding: 0;
      text-shadow: 0 4px rgba(0, 0, 0, 0.2);
    }

    * {
      -moz-box-sizing: padding-box;
      box-sizing: padding-box;
    }

    ol,
    ul {
      width: 28%;
      display: inline-block;
      text-align: left;
      vertical-align: top;
      background: rgba(0, 0, 0, 0.2);
      color: rgba(255, 255, 255, 0.5);
      border-radius: 5px;
      padding: 1.5em;
      margin: 2%;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
    }

    a {
      color: #ccc;
    }
  </style>
</head>

<body>
  <h1>惠惠子,撒拉嗨哟</h1>
  <ul class="live">
    <% dirs.forEach(dir =>{%>
    <li><a href="<%=dir.path%>"><%=dir.pathname%></a></li>
    <%}) %>
  </ul>
</body>

</html>
```

#### 13.8 package.json 文件代码如下:

```js
{
  "name": "hhz",
  "bin": {
    "hhz": "./bin/hhz"
  },
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "dependencies": {
    "chalk": "^4.1.0",
    "commander": "^7.0.0",
    "ejs": "^3.1.5",
    "mime": "^2.5.0"
  }
}
```

## 14. 缓存(cache)

### 14.1 缓存介绍

```js
// cache: 服务端主要的功能是告诉浏览器需不需要缓存
// 浏览器会将访问过的资源缓存起来
// 我希望引用的资源在没有变化的情况下，去使用默认的浏览器缓存就行了
```

### 14.2 强制缓存

```js
/**
 * 强制缓存:服务端设置缓存主要就是用来告诉浏览器被引用资源需不需要被缓存，因为浏览器默认可以缓存文件
 *    优点: 减少请求，直接读取本地已经缓存的资源，速度很快
 *    缺点: 如果缓存的资源被修改过，客户端不知道，导致用的还是老的
 */
const http = require('http');
const url = require('url');
const { createReadStream } = require('fs');
const path = require('path');
const mime = require('mime');

const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);
  const filePath = path.join(__dirname, pathname);
  // 强制缓存(memory-cache),设置特定字段- Cache-Control,10s内不要访问服务器了，只有被引用资源才会被缓存，直接访问的资源不会被强制缓存
  res.setHeader('Cache-Control', 'max-age=10');
  res.setHeader('Content-type', `${mime.getType(filePath)};charset=utf-8`); // utf8也可以，但是ie不支持
  createReadStream(filePath).pipe(res);
});

server.listen(3000, (err) => {
  if (err) return console.log(err);
  else console.log('server is running...');
});
```

### 14.3 协商缓存

```js
/**
 * 协商缓存: 由服务器告诉浏览器是否要访问本地缓存的资源
 *     优点: 服务端资源更新，客户端也能访问到最新的资源
 *     缺点: 客户端每次都要发送请求给服务端
 */
const http = require('http');
const url = require('url');
const fs = require('fs').promises;
const { createReadStream } = require('fs');
const path = require('path');
const mime = require('mime');

const server = http.createServer(async (req, res) => {
  const { pathname } = url.parse(req.url);
  const filePath = path.join(__dirname, pathname);
  const fileType = mime.getType(filePath);
  // 告诉浏览器每次都要发请求，因为浏览器有默认的强制缓存时间
  // no-cache :  每次都是需要发送请求给服务端
  // no-store :  客户端不缓存
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-type', `${fileType};charset=utf-8`);
  const statInfo = await fs.stat(filePath);
  if (statInfo.isFile()) {
    const ctime = statInfo.ctime.toUTCString();
    if (req.headers['if-modified-since'] === ctime) {
      // 说明修改时间一样，就让客户端走缓存
      res.statusCode = 304;
      return res.end();
    }
    /**
     * 设置响应头Last-Modified，下次客户端请求会携带一个请求头 if-modified-since,服务端会用if-modified-since的值和Last-Modified值进行比较，如果一样，说明文件没
     * 动过，就可以让客户端访问本地缓存的资源,如果动过，就返回最新的资源，然后在设置新的响应头Last-Modified覆盖之前的
     */
    res.setHeader('Last-Modified', ctime);
    createReadStream(filePath).pipe(res);
  } else {
    res.statusCode = 404;
    return res.end('not found');
  }
});

server.listen(3000, (err) => {
  if (err) return console.log(err);
  else console.log('server is running...');
});
```

### 14.4 协商缓存-1

```js
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs').promises;
const { createReadStream } = require('fs');
const crypto = require('crypto'); // node中所有的加密包
const mime = require('mime');

const server = http.createServer(async (req, res) => {
  const { pathname } = url.parse(req.url);
  const filePath = path.join(__dirname, pathname);
  const fileType = mime.getType(filePath);
  const statInfo = await fs.stat(filePath);
  if (statInfo.isFile()) {
    // 创建MD5摘要算法，不可逆的
    const etag = crypto
      .createHash('md5')
      .update(await fs.readFile(filePath))
      .digest('base64');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Etag', etag);
    // 因为if-modified-since时间不一定很准确，因为假设文件没变，时间变了就不行，假如在文件里面写了一些代码，然后又删除了，文件其实没变，但是时间变了
    if (req.headers['if-none-match'] === etag) {
      res.statusCode = 304;
      res.end();
    } else {
      res.setHeader('Content-type', `${fileType};charset=utf-8`);
      createReadStream(filePath).pipe(res);
    }
  } else {
    res.statusCode = 404;
    res.end('not found');
  }
});

server.listen(3000, (err) => {
  if (err) return console.log(err);
  console.log('server is running...');
});
```

### 14.5 强制缓存搭配协商缓存

```js
浏览`13.http搭建静态服务`;
```

## 15.cookie

### 15.1 cookie 介绍

```js
/**
 * cookie:因为http是无状态协议，cookie是用来识别身份的，每次发送请求，客户端都会自动携带所有cookie，要合理设置cookie，不要设置太多，可能会造成页面白屏
 */
const http = require('http');

const server = http.createServer((req, res) => {
  const url = req.url;
  if (url === '/read') {
    const value = req.headers['cookie'];
    res.end(value);
  } else if (url === '/write') {
    // httpOnly设置为true只能防止代码的方式（document.cookie）不能修改
    // 如果直接在Application中更改我们是没办法阻止的，不安全
    res.setHeader('Set-Cookie', [
      'name=zcf; max-age=10; httpOnly=true',
      'age=19',
    ]);
    res.end('write ok');
  } else {
    res.end('not found');
  }
});

server.listen(3000);
```

### 15.2 cookie 派发校验签名

```js
/**
 * 思路:
 *    派发生成一个签名（加盐摘要算法），客户端每次发送请求的时候会携带这些cookie，然后服务端根据签名进行校验，如果两次结果都一样，
 *    说明没有被篡改，可以通过，jsonwebtoken原理也是一样
 *  优点: 客户端不能通过代码或者Application篡改，相对来说，比较安全
 *  缺点: 还是以明文的方式展现在客户端中，所以不能有一些敏感信息
 */
const http = require('http');
const queryString = require('querystring');
const crypto = require('crypto');
const key = 'zcf';
// 加盐签名
function signed(value) {
  return crypto
    .createHmac('sha256', key)
    .update(value.toString())
    .digest('base64');
}
const server = http.createServer((req, res) => {
  let cookies = [];
  req.getCookie = function(key, options) {
    if (req.headers['cookie']) {
      const cookieObj = queryString.parse(req.headers['cookie'], '; ');
      if (options.signed && cookieObj[key]) {
        // 同样的盐值摘要会得到相同的结果
        const [value, sign] = cookieObj[key].split('.');
        if (signed(value) === sign) {
          // 说明没有被修改
          return value;
        } else {
          return '';
        }
      }
      return cookieObj[key] || '';
    }
    return '';
  };
  res.setCookie = function(key, value, options) {
    let opts = [];
    if (options.maxAge) {
      opts.push(`max-age=${options.maxAge}`);
    }
    if (options.httpOnly) {
      opts.push(`httpOnly=${options.httpOnly}`);
    }
    // 派发签名
    if (options.signed) {
      value = value + '.' + signed(value);
    }
    let cookieValue = `${key}=${value}`;
    cookies.push(`${cookieValue}; ${opts.join('; ')}`);
    res.setHeader('Set-Cookie', cookies);
  };
  const url = req.url;
  if (url === '/read') {
    const value = req.getCookie('name', { signed: true });
    res.end(value);
  } else if (url === '/write') {
    // httpOnly设置为true只能防止代码的方式（document.cookie）不能修改
    // 如果直接在Application中更改我们是没办法阻止的，不安全
    res.setCookie('name', 'zcf', {
      maxAge: 10,
      httpOnly: true,
      signed: true, // 是否进行签名
    });
    res.setCookie('age', '19', {
      httpOnly: true,
      signed: true, // 是否进行签名
    });
    res.end('write ok');
  } else {
    res.end('not found');
  }
});

server.listen(3000);
```

### 15.3 session + cookie

```js
const http = require('http');
const queryString = require('querystring');
const crypto = require('crypto');
const uuid = require('uuid');
const key = 'zcf';
const cardName = 'connect.sid'; // 卡片名字
const session = {}; // 会话空间内存
// 加盐签名
function signed(value) {
  return crypto
    .createHmac('sha256', key)
    .update(value.toString())
    .digest('base64');
}
const server = http.createServer((req, res) => {
  let cookies = [];
  req.getCookie = function(key, options) {
    if (req.headers['cookie']) {
      const cookieObj = queryString.parse(req.headers['cookie'], '; ');
      if (options.signed && cookieObj[key]) {
        const [value, sign] = cookieObj[key].split('.');
        if (signed(value) === sign) {
          return value;
        } else {
          return '';
        }
      }
      return cookieObj[key] || '';
    }
    return '';
  };
  res.setCookie = function(key, value, options) {
    let opts = [];
    if (options.maxAge) {
      opts.push(`max-age=${options.maxAge}`);
    }
    if (options.httpOnly) {
      opts.push(`httpOnly=${options.httpOnly}`);
    }
    if (options.signed) {
      value = value + '.' + signed(value);
    }
    let cookieValue = `${key}=${value}`;
    cookies.push(`${cookieValue}; ${opts.join('; ')}`);
    res.setHeader('Set-Cookie', cookies);
  };
  const url = req.url;
  if (url === '/buy') {
    const value = req.getCookie(cardName, {});
    if (value && session[value]) {
      // 第二次进来
      session[value].money -= 20;
      res.end(`money ${session[value].money}`);
    } else {
      // 第一次进来
      const uid = uuid.v4();
      session[uid] = { money: 100 };
      res.setCookie(cardName, uid, { httpOnly: true });
      res.end('money 100');
    }
  } else {
    res.end('not found');
  }
});

server.listen(3000);
```

## 16.手写 Express 框架

### 16.1 express-介绍

```js
Express是基于Node.js平台，快速、开放、极简的Web开发框架。使用 Express 可以快速地搭建一个完整功能的网站
Express 框架核心特性：

1. 可以设置中间件来响应 HTTP 请求
2.定义了路由表用于执行不同的 HTTP 请求动作
3.可以通过向模板传递参数来动态渲染 HTML 页面
```

### 16.2 express-用法介绍

```js
const express = require('express')
// express 本身是一个函数，函数调用返回一个应用app
const app = express()
// 路由1
app.get('/', function (req, res) {
	res.end('home')
})
// 路由2
app.get('/login', function (req, res) {
	res.end('login ok')
})

app.listen(3000, err => {
  if (err) return console.log(err)
  else console.log('server is running')
})
这样的话，我们就写好了最基本的一个express应用
当我们去访问localhost:3000的时候会返回home
访问localhost:3000/login的时候会返回login ok
```

### 16.3 目录结构说明

```js
lib / router / index.js; // 路由管理
route.js; // 匹配请求方法
layer.js; // 中间桥梁
application.js; // app应用层
express.js; // express函数
index.js; // 入口文件
```

### 16.4 express-简单实现

#### 16.4.1 index.js 文件代码如下:

```js
module.exports = require('./express');
```

#### 16.4.2 express.js 文件代码如下:

```js
const Application = require('./application');
// express应用
function createApplication() {
  return new Application();
}
module.exports = createApplication;
```

#### 16.4.3 application.js 文件代码如下:

```js
const Router = require('./router');
function Application() {
  // 初始化路由实例
  this._router = new Router();
}
Application.prototype.get = function(path, callback) {
  this._router.get(path, callback);
};
Application.prototype.listen = function(...args) {
  this._router.handle(this.toErrorResponse, ...args);
};
Application.prototype.toErrorResponse = function(req, res) {
  res.end(`Error ${req.method} ${req.url}`);
};
module.exports = Application;
```

#### 16.4.4 router/index.js 文件代码如下:

```js
const http = require('http');
const url = require('url');
function Router() {
  // 存放路由信息的栈
  this.stack = [];
}
Router.prototype.get = function(path, callback) {
  this.stack.push({
    path,
    method: 'get',
    callback,
  });
};
Router.prototype.handle = function(done, ...args) {
  const server = http.createServer((req, res) => {
    const { pathname } = url.parse(req.url);
    const requestMethod = req.method.toLowerCase();
    for (let i = 0; i < this.stack.length; i++) {
      const { path, callback, method } = this.stack[i];
      if (path === pathname && method === requestMethod) {
        return callback(req, res);
      }
    }
    done(req, res);
  });
  server.listen(...args);
};
module.exports = Router;
```

### 16.5 express-路由分离控制

```js
`express框架的一个特点,’洋葱模型’，具体我们来看以下代码`
const express = require('express')
// express 本身是一个函数，函数调用返回一个应用app
const app = express()
// 路由1
app.get('/', function (req, res, next) {
console.log(1)
next()
console.log(2)
}, function (req, res, next) {
console.log(3)
next()
console.log(4)
}, function (req, res, next) {
console.log(5)
next()
console.log(6)
})
app.get('/', function (req, res) {
// 打印结果为1、3、5、6、4、2，服务端返回ok
res.end('ok'
})

app.listen(3000, err => {
if (err) return console.log(err)
else console.log('server is running')
})
```

#### 16.5.1 application.js 代码变动如下:

```js
// app 应用模块
const http = require('http');
const Router = require('./router');
function Application() {
  // express()调用之后就送一个路由系统实例
  this._router = new Router();
}
// app.get
/**
 *
 * @param {*} path 接口路径
 * @param  {...any} handles 接口回调，可能是一个或者多个，不确定
 */
Application.prototype.get = function(path, ...handles) {
  // 统一让路由系统去管理
  this._router.get(path, handles);
};
// app.listen
Application.prototype.listen = function(...args) {
  const server = http.createServer((req, res) => {
    this._router.handle(req, res, this.toErrorResponse.bind(this));
  });
  server.listen(...args);
};
Application.prototype.toErrorResponse = function(req, res) {
  res.end(`Error ${req.method} ${req.url}`);
};
module.exports = Application;
```

#### 16.5.2 router/index.js 代码变动如下:

```js
/**
 * 路由系统:
 *      思路:
 *          此栈中存放Layer实例,实例中包含真实路径和触发用户真实回调的方法(dispatch),因为可能用户有多个回调
 */
const url = require('url');
const Layer = require('./layer');
const Route = require('./route');
function Router() {
  // 存放请求路径和触发用户回调(dispatch)的栈
  this.stack = [];
}
Router.prototype.route = function(path) {
  const route = new Route();
  const layer = new Layer(path, route.dispatch.bind(route));
  this.stack.push(layer);
  return route;
};
Router.prototype.get = function(path, handles) {
  // 让layer和route建立关系，外层layer检测路径，里层layer检测方法回调
  const route = this.route(path);
  route.get(handles);
};
Router.prototype.handle = function(req, res, toError) {
  let index = 0;
  const { pathname } = url.parse(req.url);
  const next = () => {
    if (index >= this.stack.length) return toError(req, res);
    const layer = this.stack[index++];
    // 如果路径相等，就去route实例层去比对方法，如果方法一样，就调用回调
    if (pathname === layer.path) {
      layer.dispatch(req, res, next); // next传递过去主要是为了让里层route可以拥有匹配下一个路由路径的权限
    } else {
      // 匹配下一个路由路径
      next();
    }
  };
  next();
};
module.exports = Router;
```

#### 16.5.3 router/layer.js 文件代码如下:

```js
/**
 *
 * @param {*} path 路径
 * @param {*} dispatch 触发route.dispatch的方法或者触发用户真实回调的方法
 */
function Layer(path, dispatch) {
  this.path = path;
  this.dispatch = dispatch;
}
module.exports = Layer;
```

#### 16.5.4 router/route.js 文件代码如下:

```js
const Layer = require('./layer');
function Route() {
  // 存放用户真实回调的栈
  this.stack = [];
}
/**
 *
 * @param {*} handles 用户真实的回调
 */
Route.prototype.get = function(handles) {
  for (let i = 0; i < handles.length; i++) {
    const callback = handles[i];
    // 这个路径无所谓，因为外层layer已经处理路径了，这里我们只需要处理用户回调即可
    const layer = new Layer('*', callback);
    layer.method = 'get';
    this.stack.push(layer);
  }
};
Route.prototype.dispatch = function(req, res, next) {
  let index = 0;
  const callbacks = () => {
    if (index >= this.stack.length) return next(); // 如果方法都没有匹配到，那就出去匹配下一个路径
    const method = req.method.toLowerCase();
    const layer = this.stack[index++];
    // 这里的dispatch是请求方法
    if (layer.method === method) {
      // 这里调用的是外层用户真实的回调,外层用户函数中的next === callbacks
      layer.dispatch(req, res, callbacks);
    } else {
      callbacks();
    }
  };
  callbacks();
};
module.exports = Route;
```

### 16.6 express-其他请求方法完善

```js
请求方法完善就比较简单了，有一个methods包，包中内容很简单，存放了各种方法的一个数组，我们的代码只需要循环这个数组添加动态添加方法即可，因为我们之前下载了express框架，所以express帮我们内置了这个包，我们打印看一下methods内容，内容如下:
[
  'acl',         'bind',       'checkout',
  'connect',     'copy',       'delete',
  'get',         'head',       'link',
  'lock',        'm-search',   'merge',
  'mkactivity',  'mkcalendar', 'mkcol',
  'move',        'notify',     'options',
  'patch',       'post',       'propfind',
  'proppatch',   'purge',      'put',
  'rebind',      'report',     'search',
  'source',      'subscribe',  'trace',
  'unbind',      'unlink',     'unlock',
  'unsubscribe'
]
我们把代码稍微变动一下
application.js中get方法代码变动如下:
old Code:
get (path, ...handles) {
this._router.get(path, handles)
}
new Code:
methods.forEach(method => {
Application.prototype[method] = function (path, ...handles) {
this._router[method](path, handles)
}
})
其他文件代码同理，只要是之前是get的都需要转换成上面这种循环遍历添加的
```

### 16.7 express-中间件实现

#### 16.7.1 中间件介绍

```js
`Express还有一个特点就是可以通过中间件的方法进行扩展自己的方法，先看以下代码，认识一下中间件`;
const express = require('express');
// express 本身是一个函数，函数调用返回一个应用app
const app = express();
/**
 * 中间件可以做拦截功能，可以处理公共参数/解决公共问题，比如跨域
 * 中间件路径不是完全匹配，路由路径是完全匹配
 * 中间件第一个参数如果不写，那么默认就是/,/可以匹配所有路径
 * 中间件函数也可以写多个
 */
app.use(
  '/',
  function(req, res, next) {
    req.a = 1;
    console.log(111);
    next();
  },
  function(req, res, next) {
    req.b = 2;
    next();
  }
);
app.use('/path', function(req, res, next) {
  console.log(333);
});
app.get('/', function(req, res, next) {
  console.log(req.a); // 1
  console.log(req.b); // 2
  console.log(222);
  res.end('ok');
});
// 打印 111 1 2 222
app.listen(3000, (err) => {
  if (err) return console.log(err);
  else console.log('server is running');
});
```

#### 16.7.2 application.js 文件中新增 use 方法:

```js
Application.prototype.use = function(path, ...handles) {
  // 中间件匹配路径开头，不需要去匹配方法
  this._router.use(path, handles);
};
```

#### 16.7.3 router/index.js 文件中新增 use 方法:

```js
Router.prototype.use = function(path, handles) {
  if (!handles.length) {
    // 说明外面只传了一个参数
    handles = path;
    path = '/';
    if (!Array.isArray(handles)) {
      handles = [handles];
    }
  }
  handles.forEach((handle) => {
    const layer = new Layer(path, handle);
    layer.route = false;
    this.stack.push(layer);
  });
};
```

#### 16.7.4 router/layer.js 中 match 方法修改:

```js
Layer.prototype.match = function(pathname) {
  // 路径完全一样，路由是完全匹配，中间件是包含
  if (this.path === pathname) {
    return true;
  }
  if (!this.route) {
    // 中间件,开头如果是/,可以匹配所有路径
    if (this.path === '/') {
      return true;
    } else {
      // 如果不是/,那么就判断pathname是否以this.path开头
      // 还要防止这种请求,假设路径是 /home1 ,写的路径是/home/user,也是匹配不到的，所以我们直接在path后面拼接/去比对
      return pathname.startsWith(this.path + '/');
    }
  }
  // 如果都没有匹配上，就返回false
  return false;
};
```

### 16.8 express-错误处理中间件实现

#### 16.8.1 错误中间件介绍

```js
错误中间件介绍:
  可以集中错误处理，非常的方便，一旦一个路由或者一个中间件出错，会跳过所有的中间件函数或者路由处理函数，直接抛错，返回错误。
  特点: 本身是一个中间件，唯一不同的是它接收4个参数，分别是err:错误信息,request:请求对象信息,response:响应对象信息,next:控制器函数
  例子:

   	const express = require('express')
    const app = express()
    app.use('/', function (req, res, next) {
      next('错误')
    })
    app.get('/', function (req, res, next) {
      res.end('ok')
    })
    // 错误处理
    app.use(function (err, req, res, next) {
      res.setHeader('Content-type', 'text/plain;charset=utf-8')
      res.end(JSON.stringify(err))
    })
    app.listen(3000, err => {
      if (err) return console.log(err)
      else console.log('server is running')
    })

也就是说，一般我们都会把错误处理中间件放在最下面，一旦 路由/中间件 中next函数传了参数，那么这个参数就会被当成错误解析，然后触发我们的错误处理中间件
实现思路:
判断一下next函数中是否传了参数，如果传递了参数，那么我们就应该去找错误中间件，错误中间件的特点是有4个参数，所以我们只需要判断stack中的函数是否为4个参数即可，如果找到了，就调用它，并且把错误信息传递过去，如果没有找到，我们也应该返回一个错误的响应，把错误信息告诉客户端，那么我们去实现一下
```

#### 16.8.2 router/index.js 中 handle 方法修改如下:

```js
Router.prototype.handle = function(req, res, toError) {
  const { pathname } = url.parse(req.url);
  let index = 0;
  const next = (err) => {
    if (index >= this.stack.length) return toError(req, res);
    const layer = this.stack[index++];
    if (err) {
      // 找错误处理中间件
      if (!layer.route) {
        // 参数为4个就认为是错误处理中间件
        if (layer.handle.length === 4) {
          layer.handle(err, req, res, next);
        } else {
          // 不是4个就跳过，进行下一个路由/中间件判断
          next(err);
        }
      } else {
        next(err);
      }
    } else {
      if (layer.match(pathname)) {
        // 这里的方法路由和中间件都会走，如果是路由走，会调用dispatch函数，如果是中间件走，调用的就是真实的用户回调
        layer.handle(req, res, next);
      } else {
        next();
      }
    }
  };
  next();
};
```

#### 16.8.3 router/route.js 文件中 dispatch 方法修改如下:

```js
Route.prototype.dispatch = function(req, res, out) {
  let index = 0;
  const method = req.method.toLowerCase();
  const next = (err) => {
    if (err) return out(err);
    if (index >= this.stack.length) return out();
    const layer = this.stack[index++];
    if (layer.method === method) {
      layer.handle(req, res, next);
    } else {
      next();
    }
  };
  next();
};
```

### 16.9 express-动态参数路由实现

#### 16.9.1 动态路由介绍

```js
我们在实际开发过程中，常常会遇到这样的请求url :http://xxxxxxx/xxx/随意/随意/xxx,也就是随意部分是用户携带动态参数的，那么这种路径我们后台需要怎么处理呢？我们的Express中提供了动态路径匹配参数的方式，:为动态占位符，看以下代码
const express = require('./06.动态参数路由实现-express/lib')
// const express = require('express')
// const pathToRegExp = require('path-to-regexp')
const app = express()
// 支持路由动态匹配,那么我们怎么去实现呢?
app.get('/home/:id/:key/zcf', function (req, res) {
  console.log(req.params) // { id: '1', key: '2' }
  res.end(JSON.stringify(req.params))
})

// 实现代码
// const keys = []
// const strReg = '/home/:id/:key/zcf'.replace(/\/:([^\/]+)/gi, function () {
//   keys.push(arguments[1])
//   return '/([^\\/]+)'
// })
// const url = '/home/1/2/zcf'
// const [, ...matches] = url.match(new RegExp(strReg))
// console.log(matches)// ['1', '2']
// const params = keys.reduce((p, c, i) => {
//   p[c] = matches[i]
//   return p
// }, {})
// console.log(params, 'params') // { id: '1', key: '2' }
// console.log(strReg, 'strReg') // /home/([^\/]+)/([^\/]+)/zcf
// console.log(keys, 'keys') // [ 'id', 'key' ]
// const reg = /^\/home\/([^\/]+)\/([^\/]+)\/zcf$/i
// const url = '/home/1/2/zcf'
// console.log(url.match(str))


/**
 * 实现原理:
 *    将路径转成正则去匹配
 *    1.把动态路径转换成正则
 *      const strReg = '/home/:id/:key/zcf'.replace(/\/:([^\/]+)/gi, function () {
          keys.push(arguments[1])
          return '/([^\\/]+)'
        })
        console.log(strReg, 'strReg') // /home/([^\/]+)/([^\/]+)/zcf
 *    2.然后根据转换后的正则匹配路径，提取里面的参数
        const url = '/home/1/2/zcf'
        const [, ...matches] = url.match(new RegExp(strReg))
        console.log(matches)['1', '2']
      3.通过方法处理一下，挂载到req.params上即可
        const params = keys.reduce((p, c, i) => {
          p[c] = matches[i]
          return p
        }, {})
        console.log(params, 'params') // { id: '1', key: '2' }
      4.像这种动态路由匹配路径获取参数的，有一个库已经做好了以上我们实现的，库名:path-to-regexp
        const keys = []
        const strReg = pathToRegExp('/home/:id/:key/zcf', keys)
        console.log(keys, 'keys') // [{ name: 'id', optional: false, offset: 7 }, { name: 'key', optional: false, offset: 22 }]
        console.log(strReg, 'strReg') // /^\/home\/(?:([^\/]+?))\/(?:([^\/]+?))\/zcf\/?$/i
 */
app.listen(3000)
```

#### 16.9.2 router/layer.js 文件中 match 方法修改如下:

```js
Layer.prototype.match = function(pathname) {
  // 路径完全一样，路由是完全匹配，中间件是包含
  if (this.path === pathname) {
    return true;
  }
  if (!this.route) {
    // 中间件,开头如果是/,可以匹配所有路径
    if (this.path === '/') {
      return true;
    } else {
      // 如果不是/,那么就判断pathname是否以this.path开头
      // 还要防止这种请求,假设路径是 /home1 ,写的路径是/home/user,也是匹配不到的，所以我们直接在path后面拼接/去比对
      return pathname.startsWith(this.path + '/');
    }
  } else {
    // 路由
    // 动态路由匹配
    // console.log(this.keys, 'keys') // [{ name: 'id', optional: false, offset: 7 },{ name: 'key', optional: false, offset: 22 }]
    // console.log(this.regExp, 'regexp') // /^\/home\/(?:([^\/]+?))\/(?:([^\/]+?))\/zcf\/?$/i
    const [, ...matches] = pathname.match(this.regExp);
    // console.log(matches, 'matches') // [ '1', '2' ]
    if (matches.length) {
      this.params = this.keys.reduce((p, c, i) => {
        p[c.name] = matches[i];
        return p;
      }, {});
      // console.log(this.params, 'this.params') // { id: '1', key: '2' }
      return true;
    }
  }
  // 如果都没有匹配上，就返回false
  return false;
};
```

#### 16.9.3 router/layer.js 文件中函数修改如下:

```js
function Layer(path, handle) {
  this.path = path;
  this.regExp = pathToRegExp(this.path, (this.keys = []));
  this.handle = handle;
}
```

#### 16.9.4 req.params

```js
router/index.js 文件中handle方法中将layer.params属性挂载到req.params上即可
```

### 16.10 express-二级路由匹配实现

#### 16.10.1 实现思路讲解:

```js
* express.Router() 返回的是一个函数，这个函数被放在use函数的参数中，可以实现分离，语义化更好
* 最后通过app.use加载函数，实现2级路由
* 如下:
* app.use('/user', user)
* 那么我们的路由一级路径为/user,二级路径为user函数中的/add或/remove
* 那么我们需要访问/add或/remove的话，需要在地址栏输入http://localhost:3000/user/add 或者http://localhost:3000/user/remove才能匹配到
* comment也是同理,需要在地址栏输入http://localhost:3000/comment/add 或者 http://localhost:3000/comment/remove才能匹配到

* 我们如果要实现,要怎么实现呢?
* 中间件之前我们已经实现了，无非是进行路径的模糊匹配，如果匹配到就直接调用函数.
实现思路:
如果中间件路径匹配上了，那么就应该调用函数，然后再次进行匹配，匹配的时候跟路由一个个比对，那么我们需要把中间件的路径给移除掉，然后在进行匹配即可，实现代码如下:
```

#### 16.10.2 express.js 代码修改如下:

```js
const Application = require('./application');
const Router = require('./router');
function createApplication() {
  return new Application();
}
// express.router 返回的是一个函数,function(req,res,next){}
// 因为可以调用路由的所有方法，所以我们这里可以修改一下原型链
createApplication.Router = function() {
  const route = new Router();
  const router = function(req, res, next) {
    console.log(22222);
    route.handle(req, res, next);
  };
  router.__proto__ = route;
  return router;
};
module.exports = createApplication;
```

#### 16.10.3 router/index.js 文件中 handle 方法修改如下

```js
handle (req, res, toError) {
    const { pathname } = url.parse(req.url)
    let index = 0
    const next = (err) => {

      if (index >= this.stack.length) {
        // 如果外界没有写中间件，我们也应该手动返回一个错误的响应
        return err ? toError(req, res, err) : toError(req, res)
      }

      const layer = this.stack[index++]
      if (err) {
        // 我们需要去找错误处理中间件
        // 先排除掉路由
        if (!layer.route) {
          // 函数.length === 参数的个数
          if (layer.handle.length === 4) {
            // 触发中间件
            layer.handle(err, req, res, next)
          } else {
            next(err)
          }
        } else {
          // 是路由就跳过进行下一个，把错误向下传递
          next(err)
        }
      } else {
        console.log(pathname, 'pathname')
        if (pathname !== null && layer.match(pathname)) { // layer.path = '/user' pathname= '/user/add'
          req.params = layer.params || {} // 挂载到req上
          // 如果是中间件并且不是错误中间件并且路径不是/
          if (!layer.route && layer.handle.length !== 4 && layer.path !== '/') {
            // 移除中间件路径，然后调用dispatch方法进去匹配路由，此时路由就可以匹配上了
            // 保存要删除的路径
            this.removePath = layer.path
            req.url = req.url.slice(this.removePath.length) // 删除路径 /user/add会删除/user
          }
          // 如果是二级路由，那么这里调用的其实是express.Router()函数，这个函数会让我们再次调用handle方法，然后进来
          // 如果路由经过这里，那么走的是dispatch进里面继续比对方法，如果是中间件走，那么这个handle就是真实的用户回调，直接调用即可
          layer.handle(req, res, next)
        } else {
          next(err)
        }
      }
    }
    next()
  }
```

#### 16.10.4 总结

```js
至此，我们手写完成了Express框架90%的功能，还有10%的功能无非是对request,response对象进行扩展了，比如,response.send/response.json这种，相信如果大家认真看完了以上代码，剩下10%实现起来都很简单了，我们手写这些代码的主要目的是带大家去理解代码的背后思想，去理解背后团队遇到问题的一种解决思路及方案。
```
