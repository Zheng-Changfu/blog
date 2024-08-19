# Vue2 个人笔记

## 01.手写 Vue 数据代理、数据劫持、模板编译、挂载

### 1.package.json

```json
{
  "name": "mvvm",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "serve": "rollup -c -w"
  },
  "devDependencies": {
    "@babel/core": "^7.13.1",
    "@babel/preset-env": "^7.13.5",
    "rollup": "^2.39.1",
    "rollup-plugin-babel": "^4.4.0"
  }
}
```

### 2.rollup.config.js

```js
import babel from 'rollup-plugin-babel';
export default {
  input: './lib/index.js',
  output: {
    format: 'umd',
    name: 'Vue',
    file: 'dist/vue.js',
    sourcemap: true,
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
```

### 3.index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <div
      id="root"
      name="zhengchangfu"
      style="color: red;background-color: #fff;"
    >
      <p>
        <span>我叫{{ name }}哈哈</span>
      </p>
    </div>
    <script src="./dist/vue.js"></script>
    <script>
      const vm = new Vue({
        el: '#root',
        data() {
          return {
            arr: [1, { b: 2 }],
            name: '郑常富',
            age: 18,
            sex: {
              a: 1,
              b: 2,
              c: {
                d: 3,
              },
            },
          };
        },
      });
      console.log(vm.name);

      const obj = {
        name: 'zcf',
      };
      const fn = new Function(`with(this){return name}`);
      console.log(fn.call(obj));
    </script>
  </body>
</html>
```

### 4.lib 目录介绍

| 文件夹/文件       | 含义                                          |
| ----------------- | --------------------------------------------- |
| compile 目录      | 编译层                                        |
| observe 目录      | 响应式处理层                                  |
| vdom 目录         | 虚拟 dom 处理/diff 算法层                     |
| index.js 文件     | 入口文件                                      |
| init.js 文件      | 初始化方法                                    |
| lifecycle.js 文件 | 挂载组件                                      |
| render.js 文件    | 调用 render 函数、创建虚拟对象                |
| state.js 文件     | 初始化 props/methods/data/computed/watch...等 |
| utils.js 文件     | 通用工具方法                                  |

### 5.index.js 文件代码

```js
import { initMixin } from './init';
import { renderMixin } from './render';
import { lifecycleMixin } from './lifecycle';
function Vue(options) {
  // 初始化方法
  this._init(options);
}
initMixin(Vue);
renderMixin(Vue);
lifecycleMixin(Vue);
export default Vue;
```

### 6. init.js 文件代码

```js
import { initState } from './state';
import { mountComponent } from './lifecycle';
import { CompileToFunction } from './compile/index';
export function initMixin(Vue) {
  // 初始化调用了这个方法
  Vue.prototype._init = function(options) {
    const vm = this;
    vm.$options = options;
    // 调用state方法
    initState(vm);
  };
  // 组件挂载的方法
  Vue.prototype.$mount = function(vm) {
    let el = vm.$options.el;
    if (!vm.$options.render) {
      el = document.querySelector(el);
      vm.$el = el;
      el = el.outerHTML;
      // 将字符串编译成函数
      let render = CompileToFunction(el);
      console.log(render, 'render');
      vm.$options.render = render;
    }
    // 挂载组件
    mountComponent(vm, el);
  };
}
```

### 7. state.js 文件代码

```js
import { observe } from './observe/index';
import { isFunction } from './utils';
export function initState(vm) {
  initData(vm);
  // 挂载
  if (vm.$options.el) {
    vm.$mount(vm);
  }
}

function proxy(vm, source, key) {
  Object.c(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newVal) {
      vm[source][key] = newVal;
    },
  });
}
function initData(vm) {
  let data = vm.$options.data;
  data = vm._data = isFunction(data) ? data.call(vm) : data;
  // 所有的数据现在都在_data中，那么我们做一层数据代理，外界访问vm.xxx的时候我们去vm._data中读取xxx
  for (let key in data) {
    proxy(vm, '_data', key);
  }
  // 响应式处理
  observe(data);
}
```

### 8.observe/index.js 文件代码

```js
import { isArray, isObject } from '../utils';
import { arrayMethods } from './array';
class Observe {
  constructor(data) {
    // 响应式属性里都会有一个__ob__属性
    // data.__ob__ = this // 这么写会导致爆栈，因为一直在调用walk方法，然后一直在循环调用new Observe
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false, // 不可被枚举(遍历)
    });
    // 如果数据为一个数组，那么也会进来，此时我们要改写数组中的方法
    if (isArray(data)) {
      // 改写数组的7个方法
      data.__proto__ = arrayMethods;
      this.observeArray(data); // 对数组中是对象的定义成响应式
    } else {
      this.walk(data);
    }
  }
  observeArray(data) {
    data.forEach((item) => {
      observe(item);
    });
  }
  walk(data) {
    Object.keys(data).forEach((key) => {
      const value = data[key];
      defineReactive(data, key, value);
    });
  }
}

function defineReactive(data, key, value) {
  // 如果对象嵌套对象，继续进行递归观测
  observe(value);
  Object.defineProperty(data, key, {
    get() {
      return value;
    },
    set(newVal) {
      // 如果用户新赋值一个对象，那么新对象也要进行观测
      observe(newVal);
      value = newVal;
    },
  });
}

export function observe(data) {
  if (!isObject(data)) return;
  if (data.__ob__) return;
  return new Observe(data);
}
```

### 9.observe/array.js 文件代码

```js
const oldArrayProto = Array.prototype;
export const arrayMethods = Object.create(oldArrayProto);
let methods = ['shift', 'unshift', 'sort', 'pop', 'splice', 'push', 'reverse'];

methods.forEach((method) => {
  // 对数组方法进行重写
  arrayMethods[method] = function(...args) {
    oldArrayProto[method].call(this, ...args);
    let ob = this.__ob__; // 拿到Observe实例

    // 如果方法是新增属性的，那么我们要对新增的属性再次进行响应式处理
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
      default:
        break;
    }

    if (inserted) {
      // 说明调用了push/unshift/splice等方法
      // 将新增的数据定义成响应式
      ob.observeArray(inserted);
    }
  };
});
```

### 10.compile/index.js 文件代码

```js
import { parserHtml } from './parser';
import { generate } from './generate';
export function CompileToFunction(html) {
  // 将html编译成ast语法树
  let root = parserHtml(html);
  // 将ast语法树转换成代码
  let code = generate(root);
  console.log(code, 'code');
  // 将code代码串转成函数
  let render = new Function(`with(this){return ${code}}`);
  // console.log(render, 'render')
  /**
   * ƒ anonymous(){
      with(this){
        return _c(
          'div',
          {
            id:"root",
            name:"zhengchangfu",
            style:{
              "color":" red",
              "background-color":" #fff"
            }
          },
          _c(
            'p',
            undefined,
            _c(
              'span',
              undefined,
              _v(
                "我叫"+name+"哈哈"
                )
              )
            )
          )
       }
    }
   */
  return render;
}
```

### 11.compile/parser.js 文件代码

```js
import { compileTemplate } from '../utils';

// 树根
let root = null;
// 栈
const stack = [];
// 创建ast语法树
function createAstElement(tag, attrs) {
  return {
    tag,
    parent: null,
    children: [],
    attrs,
    type: 1,
    text: '',
  };
}
function start(tag, attributes) {
  // console.log('标签开始', tag, attributes)
  // 取出栈中最后一个
  const parent = stack[stack.length - 1];
  // 创建ast元素
  const element = createAstElement(tag, attributes);
  // 如果没有根元素，那么创建出来的ast元素就是根元素
  if (!root) {
    root = element;
  }
  if (parent) {
    // 有父级元素
    parent.children.push(element);
    element.parent = parent;
  }
  stack.push(element);
}
function chars(text) {
  // console.log('标签文本', text)
  const parent = stack[stack.length - 1];
  text = text.replace(/\s/g, '');
  if (text) {
    parent.children.push({
      type: 3,
      text,
    });
  }
}
function end(tag) {
  // console.log('标签结束', tag)
  const element = stack.pop();
  if (element.tag !== tag) {
    throw new Error('标签有误');
  }
}
export function parserHtml(html) {
  /**
   * 用正则匹配标签开始，标签名，然后提取标签名放入容器中，然后移除掉匹配的部分
   * 用正则匹配标签属性，然后提取属性放入容器中，然后移除掉匹配的部分
   * 用正则匹配标签结束，然后移除掉匹配的部分
   * 用正则匹配标签中的文本，然后提取文本放入容器中，然后移除掉匹配的部分
   * 用正则匹配标签结束，然后提取标签结束名和标签开始的标签名进行匹配，如果相同，说明标签相同，不相同，抛错
   */
  function advance(len) {
    html = html.substring(len);
  }
  // 解析开始标签
  function parseStartTag() {
    let startTag = compileTemplate.startTag(html);
    if (startTag) {
      advance(startTag[0].length);
      let match = {
        tag: startTag[1],
        attrs: [],
      };
      let text, end;
      // 匹配属性,只要没有到结束标签并且一直都可以匹配到属性，就一直循环
      while (
        !(end = compileTemplate.tagClose(html)) &&
        (text = compileTemplate.tagAttributes(html))
      ) {
        match.attrs.push({
          key: text[1],
          value: text[2] || text[3] || text[4],
        });
        advance(text[0].length);
      }
      if (end) {
        advance(end[0].length);
      }
      return match;
    }
    return false;
  }
  // 解析结束标签
  function parseEndTag() {
    let endTag = compileTemplate.closeTag(html);
    if (endTag) {
      advance(endTag[0].length);
      return endTag[1];
    }
    return false;
  }
  while (html) {
    let index = html.indexOf('<');
    if (index === 0) {
      // 不是标签开始位置就是标签结束位置
      // 解析开始标签
      let startMatch = parseStartTag();
      if (startMatch) {
        start(startMatch.tag, startMatch.attrs);
        continue;
      }
      let endMatch = parseEndTag();
      if (endMatch) {
        end(endMatch);
        continue;
      }
    }
    // 拿到文本的所有内容
    let text = html.slice(0, index);
    if (text) {
      chars(text);
      advance(text.length);
    }
  }
  return root;
}
```

### 12.compile/generate.js 文件代码

```js
import { compileTemplate } from '../utils';
function gen(c) {
  if (c.type === 1) {
    // 元素
    return generate(c);
  } else {
    // 文本 _v('hello')
    const text = c.text;
    const regRes = compileTemplate.qn(text);
    // 如果没有匹配到插值语法 hello {{name}} world  ==> 'hello' + name + 'world'
    if (!regRes) {
      return `_v('${text}')`;
    } else {
      const reg = compileTemplate.qn(text, 0);
      let tokens = [];
      let lastIndex = 0;
      text.replace(reg, function(...args) {
        if (text.slice(lastIndex, args[2])) {
          tokens.push(JSON.stringify(text.slice(lastIndex, args[2])));
        }
        if (lastIndex < text.length - 1) {
          tokens.push(args[1].trim());
        }
        lastIndex = args[2] + args[0].length;
      });
      if (lastIndex < text.length) {
        if (text.slice(lastIndex)) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
      }
      return `_v(${tokens.join('+')})`;
    }
  }
}
function genChildren(root) {
  const children = root.children;
  if (children && children.length) {
    const res = children.map((c) => gen(c)).join('+');
    return res;
  }
  return false;
}
function genProps(props) {
  let str = '';
  for (let i = 0; i < props.length; i++) {
    let { key, value } = props[i];
    if (key === 'style') {
      let styleObj = {};
      // "color: red;background-color: #fff"; 转成对象
      value.replace(/([^:;]+):([^:;]+)/g, function(p, s1, s2) {
        styleObj[s1] = s2;
      });
      value = styleObj;
    }
    str += `${key}:${JSON.stringify(value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}
export function generate(root) {
  // 将ast语法树拼接成字符串
  /**
   * _c('div',{id:'root',name:'zhengchangfu'},'hello')
   * new Function + with语法
   */
  const children = genChildren(root);
  let code = `_c('${root.tag}',${
    root.attrs.length ? genProps(root.attrs) : 'undefined'
  }${children ? `,${children}` : ''})`;
  //code ==>  _c('div',{id:"root",name:"zhengchangfu",style:{"color":" red","background-color":" #fff"}},_c('p',undefined,_c('span',undefined,_v("我叫"+name+"哈哈"))))
  return code;
}
```

### 13.render.js 文件代码

```js
import { createElement, createText } from './vDom/index';
export function renderMixin(Vue) {
  // 创建元素
  Vue.prototype._c = function(...args) {
    return createElement(this, ...args);
  };
  // 创建文本
  Vue.prototype._v = function(text) {
    return createText(this, text);
  };
  Vue.prototype._render = function() {
    const vm = this;
    const render = vm.$options.render;
    // 让render函数中的this指向this，所以我们在模板中不需要写vm.xxxx
    let vNode = render.call(vm);
    console.log(vNode);
    return vNode;
  };
}
```

### 14. vdom/index.js 文件代码

```js
export function createElement(vm, tag, data = {}, ...children) {
  return createVDom(vm, tag, data, data.key, children, undefined);
}
export function createText(vm, text) {
  return createVDom(vm, undefined, undefined, undefined, undefined, text);
}
function createVDom(vm, tag, data, key, children, text) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text,
  };
}
```

### 15. vdom/patch.js 文件代码

```js
export function patch(oldVnode, vNode) {
  // 新旧虚拟dom比较,暂时不做
  const parent = oldVnode.parentNode;
  if (parent.nodeType === 1) {
    // 真实元素
    const elm = createEl(vNode);
    parent.insertBefore(elm, oldVnode.nextSibling);
    parent.removeChild(oldVnode);
  } else {
  }
}

function createEl(vNode) {
  const { vm, text, key, children, tag, data } = vNode;
  console.log(vNode, '~~');
  let elm = '';
  if (tag) {
    // 标签
    elm = document.createElement(tag);
    console.log(elm, 'elm');
    if (children && children.length) {
      for (let i = 0; i < children.length; i++) {
        const item = children[i];
        elm.appendChild(createEl(item));
      }
    }
  } else {
    // 文本
    elm = document.createTextNode(text);
  }
  return elm;
}
```

### 16. utils.js 文件代码

```js
export const isFunction = (val) => {
  return typeof val === 'function';
};
export const isObject = (val) => {
  return typeof val === 'object' && val !== null;
};
export const isArray = (val) => {
  return Array.isArray(val);
};

export let compileTemplate = {
  // 匹配标签名
  tag: `[a-zA-Z][0-9a-zA-Z]*`,
  // 匹配标签开始
  startTag: (html) => {
    const reg = new RegExp(`^<(${compileTemplate.tag})`);
    return html.match(reg);
  },
  // 匹配标签属性
  tagAttributes: (text) => {
    // 标签属性有3种,a=b a='b' a="b",前后可能有多个空格
    const reg = /\s*([^=\s'"\/<>]+)\s*=\s*(?:"([^"]+)")|(?:'([^']+)')|([^\s"'=<>`]+)?/;
    return text.match(reg);
  },
  // 匹配标签结束
  tagClose: (text) => {
    // 可能为自结束标签，可以为> ,/>
    const reg = /^\s*(\/?)>/;
    return text.match(reg);
  },
  // 匹配结束标签
  closeTag: (text) => {
    // </div >
    const reg = new RegExp(`^<\/(${compileTemplate.tag})*>`);
    return text.match(reg);
  },
  // 匹配插值语法
  qn: (text, count = 1) => {
    const reg = /\{\{([\s\S]*?)\}\}/g;
    return count ? text.match(reg) : reg;
  },
};
```

## 02.手写响应式原理(Dep 和 Watcher)

### 1.lib 目录新增文件

| 文件夹/文件          | 含义             |
| -------------------- | ---------------- |
| observe/dep 文件     | 依赖收集文件     |
| observe/watcher 文件 | 通知视图更新文件 |

### 2.lifecycle 文件代码改动如下

```js
import { patch } from './vDom/patch';
import Watcher from './compile/watcher';
export function mountComponent(vm, el) {
  const updateComponent = () => {
    // 生成虚拟dom
    const vNode = vm._render();
    // 更新
    vm._update(vNode);
  };
  // updateComponent() ==> 更新组件
  // 这里渲染的时候我们创建一个Watcher，在Watcher中更新组件
  new Watcher(
    vm,
    updateComponent,
    () => {
      console.log('update view');
    },
    true
  ); // true代表是一个渲染Watcher
}
export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vNode) {
    const vm = this;
    vm.$el = patch(vm.$el, vNode);
  };
}
```

### 3. observe/index 文件代码改动如下

```js
import { isArray, isObject } from '../utils';
import { arrayMethods } from './array';
import Dep from '../compile/dep';
class Observe {
  constructor(data) {
    // 响应式属性里都会有一个__ob__属性
    // data.__ob__ = this // 这么写会导致爆栈，因为一直在调用walk方法，然后一直在循环调用new Observe
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false, // 不可被枚举(遍历)
    });
    // 如果数据为一个数组，那么也会进来，此时我们要改写数组中的方法
    if (isArray(data)) {
      // 改写数组的方法
      data.__proto__ = arrayMethods;
      this.observeArray(data); // 对数组中是对象的定义成响应式
    } else {
      this.walk(data);
    }
  }
  observeArray(data) {
    data.forEach((item) => {
      observe(item);
    });
  }
  walk(data) {
    Object.keys(data).forEach((key) => {
      const value = data[key];
      defineReactive(data, key, value);
    });
  }
}
function defineReactive(data, key, value) {
  // 如果对象嵌套对象，继续进行递归观测
  observe(value);
  // 每个属性都有自己的dep

  let dep = new Dep();
  Object.defineProperty(data, key, {
    get() {
      // 先执行的是pushTarget方法存放了watcher，然后挂载组件，模板中使用了vm上的属性，会触发get，进来
      if (Dep.target) {
        dep.depend(); // 存放watcher
      }
      return value;
    },
    set(newVal) {
      if (value !== newVal) {
        // 如果用户新赋值一个对象，那么新对象也要进行观测
        observe(newVal);
        value = newVal;
        // 通知watcher去更新
        dep.notify();
      }
    },
  });
}

export function observe(data) {
  if (!isObject(data)) return;
  if (data.__ob__) return;
  return new Observe(data);
}
```

### 4.observe/dep 文件代码

```js
let id = 0;
class Dep {
  constructor() {
    this.id = id++;
    this.subs = [];
  }
  depend() {
    if (Dep.target) {
      // Dep.target就是watcher
      Dep.target.addDeps(this); // this是当前实例dep
    }
  }
  addSubs(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach((watcher) => watcher.update());
  }
}

Dep.target = null;

export function pushTarget(watcher) {
  Dep.target = watcher;
}
export function popTarget() {
  Dep.target = null;
}
export default Dep;
```

### 5.observe/watcher 文件代码

```js
import { pushTarget, popTarget } from './dep';

let id = 0;
class Watcher {
  /**
   *
   * @param {*} vm Vue实例
   * @param {*} updateFnOrExpr 更新的方法或者表达式
   * @param {*} cb 自定义回调函数
   * @param {*} options 其他选项配置
   */
  constructor(vm, updateFnOrExpr, cb, options) {
    this.vm = vm;
    this.id = id++; // 每个watcher都是单独的，用id来区分一下
    this.updateFnOrExpr = updateFnOrExpr;
    this.cb = cb;
    this.options = options;
    this.deps = [];
    this.depsId = new Set();
    this.get();
  }
  get() {
    pushTarget(this);
    // 这个方法会触发Object.defineProperty中的get，会去vm上面取值
    this.updateFnOrExpr();
    popTarget(); // 在外面用vm上的属性是不需要收集Watcher的
  }
  // Vue中是异步更新的，主要是做一个缓存等待
  addDeps(dep) {
    const id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      // 调用dep的addSubs方法来存放watcher
      dep.addSubs(this);
    }
  }
  update() {
    this.get();
  }
}

export default Watcher;
```

### 6.index.html 文件如下

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <div
      id="root"
      name="zhengchangfu"
      style="color: red;background-color: #fff;"
    >
      <p>
        <span>我叫{{ name }}哈哈 {{ age }}</span>
      </p>
    </div>
    <script src="./dist/vue.js"></script>
    <script>
      const vm = new Vue({
        el: '#root',
        data() {
          return {
            arr: [1, { b: 2 }],
            name: '郑常富',
            age: 18,
          };
        },
      });
      // setTimeout(() => {
      //   vm.name = '程小惠'
      //   vm._update(vm._render())
      // }, 1000)

      setTimeout(() => {
        vm.name = 'z';
        vm.name = 'c';
        vm.name = 'f';
        vm.name = '程小惠';
        vm.age = 2;
      }, 1000);
      /*
      如果更新的话，我们重新调用vm._update(vm._render即可)
      在_render里面我们做了什么事？
        1. 将ast生成的语法树转换成了代码 _c('div',{key:value},'哈哈')
        2. 通过new Function + with语法将代码变成了render函数
        3. 调用render函数生成虚拟dom对象
      在_update里面我们做了什么事?
        1. patch进行diff算法对比，现在我们还没有比对
        2. 将虚拟dom对象转换成真实dom，实现页面更新
    */

      /*
     我们更新的时候肯定是不需要用户主动去调用vm._update(vm._render())
     Vue中是这么做的:
        1. 每个组件都会有一个渲染Watcher，专门是渲染页面用的
        2. 一个页面中的所有属性都有一个dep，dep中存放当前页面的watcher
        3. 当前页面中的watcher存放当前页面中所有的dep
        4. 当用户想要更新时，会触发Object.defineProperty中的set方法
        5. 我们在set中通知dep去更新watcher
        6. 组件化的代码中，一个组件就会对应一个Watcher,那么多个组件就会对应多个Watcher
        7. 而有时候我们的属性会被共享到多个组件中，又因为每个属性都有一个自己的dep,所以也就是一个dep可以有多个Watcher的情况
        8. 而一个页面中可能有多个属性，每个属性又有自己的dep，所以也就是一个Watcher可能有多个dep
        9. 所以Dep和Watcher的关系可能会属于1 => 1 , 1 => 多, 多 = 1 , 多 => 多
    */

      vm.name = 2;
    </script>
  </body>
</html>
```

## 03.手写异步更新原理

### 1.lib 目录新增文件

| 文件夹/文件            | 含义             |
| ---------------------- | ---------------- |
| observe/scheduler 文件 | watcher 调度文件 |

### 2.observe/watcher 文件代码改动如下

```js
import { pushTarget, popTarget } from './dep';
import { queueWatcher } from './scheduler';
let id = 0;
class Watcher {
  /**
   *
   * @param {*} vm Vue实例
   * @param {*} updateFnOrExpr 更新的方法或者表达式
   * @param {*} cb 自定义回调函数
   * @param {*} options 其他选项配置
   */
  constructor(vm, updateFnOrExpr, cb, options) {
    this.vm = vm;
    this.id = id++; // 每个watcher都是单独的，用id来区分一下
    this.updateFnOrExpr = updateFnOrExpr;
    this.cb = cb;
    this.options = options;
    this.deps = [];
    this.depsId = new Set();
    this.get();
  }
  get() {
    pushTarget(this);
    // 这个方法会触发Object.defineProperty中的get，会去vm上面取值
    this.updateFnOrExpr();
    popTarget(); // 在外面用vm上的属性是不需要收集Watcher的
  }
  // 存放dep,如果模板中使用了2次 {{ name }} {{ name }},他们其实用的是一个id，那么我们就不需要存放到数组中，需要进行去重
  addDeps(dep) {
    const id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      // 调用dep的addSubs方法来存放watcher
      dep.addSubs(this);
    }
  }
  // Vue中是异步更新的，主要是做一个缓存等待
  // 如果watcher的id都是一样，那么要进行去重，而且只需要更新一次即可 (防抖) ，同一个页面多个dep公共一个watcher
  // 所以Vue内部更新原理是: 去重 + 防抖
  update() {
    queueWatcher(this);
  }
  run() {
    console.log(111);
    this.get();
  }
}

export default Watcher;
```

### 3.observe/scheduler 文件代码

```js
import { nextTick } from '../utils';
let queue = [];
let obj = {};
let pending = false;
export function queueWatcher(watcher) {
  const id = watcher.id;
  if (!obj[id]) {
    queue.push(watcher);
    obj[id] = true;
    if (!pending) {
      pending = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

function flushSchedulerQueue() {
  for (let i = 0; i < queue.length; i++) {
    queue[i].run();
  }
  queue = [];
  obj = {};
  pending = false;
}
```

### 4.utils 文件中新增方法(nextTick)代码如下

```js
let callbacks = [];
let watting = false;
export function nextTick(cb) {
  // 按照正常情况来说，肯定是内部源码调用的nextTick先进来，然后再是函数，因为代码是一行行执行的
  callbacks.push(cb);
  // 也要做防抖，不能每次调用nextTick都循环一次
  if (!watting) {
    watting = true;
    // 这里我就不写兼容代码了，vue2中写了兼容
    Promise.resolve().then(flushCallbacks);
  }
}
function flushCallbacks() {
  for (let i = 0; i < callbacks.length; i++) {
    const cb = callbacks[i];
    cb();
  }
  callbacks = [];
  watting = false;
}
```

## 04.手写 watch

### 1.index.html 文件代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <div id="root">
      <p>{{ hobby.a }}</p>
    </div>
    <script src="./dist/vue.js"></script>
    <script>
      /*
     watch的原理:
        其实就是一个用户Watcher，当key值发生变化的时候，会调用key对应的handler函数
        其实在watch对象中书写和手动调用vm.$watch其实原理都是一样，watch对象中的handler函数
        都会被转换成vm.$watch
        watch中的key(表达式)其实最后会在vm中取值，然后当key值发生变化，会通知watcher去更新，
    */
      const vm = new Vue({
        el: '#root',
        data() {
          return {
            name: 'zcf',
            hobby: {
              a: 1,
            },
          };
        },
        methods: {
          fn(newVal, oldVal) {
            console.log(newVal, oldVal, '6');
          },
        },
        watch: {
          // watch写法有好几种
          // 第一种:
          // name(newVal, oldVal) {
          //   console.log(newVal, oldVal, '1')
          // },
          // 第二种,可以写表达式,比如想监听hobby.a的变化 'hobby.a'(){}
          'hobby.a'(newVal, oldVal) {
            console.log(newVal, oldVal, '2');
          },
          // 第三种,数组的形式，当name值发生变化的时候，会循环依次调用数组中的每一个函数
          name: [
            function(newVal, oldVal) {
              console.log(newVal, oldVal, '3');
            },
            function(newVal, oldVal) {
              console.log(newVal, oldVal, '4');
            },
          ],
          // 第四种
          // name: {
          //   handler: function (newVal, oldVal) {
          //     console.log(newVal, oldVal, '5')
          //   },
          //   immediate: true, // 是否立即触发
          //   deep: true // 是否深度监视 ... 还有一系列参数
          // },
          // // 第五种，可以抽取函数到methods中
          // name: 'fn' // 当name值发生变化时，会调用methods中的fn函数
        },
      });
      // 第六种
      vm.$watch(
        'name',
        function(newVal, oldVal) {
          console.log(newVal, oldVal, '7');
        },
        {
          /* 可以传入一些配置项 */
        }
      );

      setTimeout(() => {
        // vm.name = 'cxh'
        vm.hobby.a = 2;
      }, 1000);
    </script>
  </body>
</html>
```

### 2.state.js 文件代码改动如下

```js
import { observe } from './observe/index';
import { isFunction } from './utils';
import Watcher from './observe/watcher';
export function stateMixin(Vue) {
  Vue.prototype.$watch = function(key, handler, options = {}) {
    const vm = this;
    options.user = true; // 表示是一个用户Watcher
    new Watcher(vm, key, handler, options);
  };
}
export function initState(vm) {
  if (vm.$options.data) {
    initData(vm);
  }
  if (vm.$options.watch) {
    initWatch(vm);
  }
  if (vm.computed) {
    initComputed(vm);
  }
  // 挂载
  if (vm.$options.el) {
    vm.$mount(vm);
  }
}
function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newVal) {
      vm[source][key] = newVal;
    },
  });
}
function initData(vm) {
  let data = vm.$options.data;
  data = vm._data = isFunction(data) ? data.call(vm) : data;
  // 所有的数据现在都在_data中，那么我们做一层数据代理，外界访问vm.xxx的时候我们去vm._data中读取xxx
  for (let key in data) {
    proxy(vm, '_data', key);
  }
  observe(data);
}
function initWatch(vm) {
  const watch = vm.$options.watch;
  Object.keys(watch).forEach((key) => {
    const handler = watch[key];
    // handler可能是数组，可能是字符串，可能是对象,可能是函数
    // 暂时没实现methods和对象,所以先不考虑这两种
    // 那就先考虑数组和函数的情况
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        const fn = handler[i];
        // 没一个函数都是一个watcher，只不过这个watcher是用户的
        createWatcher(vm, key, fn);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  });
}

function createWatcher(vm, key, handler) {
  vm.$watch(key, handler);
}
```

### 3.observe/watcher.js 代码改动如下

```js
import { pushTarget, popTarget } from './dep';
import { queueWatcher } from './scheduler';
let id = 0;
class Watcher {
  /**
   *
   * @param {*} vm Vue实例
   * @param {*} updateFnOrExpr 更新的方法或者表达式
   * @param {*} cb 自定义回调函数
   * @param {*} options 其他选项配置
   */
  constructor(vm, updateFnOrExpr, cb, options = {}) {
    this.vm = vm;
    this.id = id++; // 每个watcher都是单独的，用id来区分一下
    this.user = !!options.user; // 区分是否为用户Watcher
    this.cb = cb;
    this.options = options;
    this.deps = [];
    this.depsId = new Set();
    if (typeof updateFnOrExpr === 'string') {
      // 表示为一个表达式，因为等下要调用this.get，get方法中会调用updateFnOrExpr，所以我们这里重写updateFnOrExpr
      // 等下调用this.get会存储用户Watcher,然后调用this.updateFnOrExpr会触发我们下面的函数，然后会触发响应式中的get方法
      // 会去收集用户Watcher，然后返回vm.name的值
      // 当我们去改变name值的时候，会通知Watcher更新，我们收集新值和老值然后去调用用户回调即可
      this.updateFnOrExpr = function() {
        // return vm[updateFnOrExpr]

        // 外界可能传入这种格式,'hobby.a'(),我们需要取到a的值,就不能按照上面那种写法了
        let obj = vm;
        const arr = updateFnOrExpr.split('.');
        for (let i = 0; i < arr.length; i++) {
          obj = obj[arr[i]]; // {a}
        }
        return obj;
      };
    } else {
      // 表示为渲染Watcher
      this.updateFnOrExpr = updateFnOrExpr;
    }
    this.value = this.get();
  }
  get() {
    pushTarget(this);
    // 这个方法会触发Object.defineProperty中的get，会去vm上面取值,第一次的值就是最早的值，第二次的值就是最新的值
    const value = this.updateFnOrExpr();
    popTarget(); // 在外面用vm上的属性是不需要收集Watcher的
    return value;
  }
  // 存放dep,如果模板中使用了2次 {{ name }} {{ name }},他们其实用的是一个id，那么我们就不需要存放到数组中，需要进行去重
  addDeps(dep) {
    const id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      // 调用dep的addSubs方法来存放watcher
      dep.addSubs(this);
    }
  }
  // Vue中是异步更新的，主要是做一个缓存等待
  // 如果watcher的id都是一样，那么要进行去重，而且只需要更新一次即可 (防抖) ，同一个页面多个dep公共一个watcher
  // 所以Vue内部更新原理是: 去重 + 防抖
  update() {
    queueWatcher(this);
  }
  run() {
    // 更新
    const newVal = this.get();
    if (this.user) {
      const oldValue = this.value;
      // 下一次的老值是这一次的新值
      this.value = newVal;
      // 表示是用户watcher
      this.cb.call(this.vm, newVal, oldValue);
    }
  }
}
export default Watcher;
```

## 05.手写 computed

### 1. index.html 文件如下

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <div id="root">
      <p>{{ fullName }}</p>
    </div>
    <script src="./dist/vue.js"></script>
    <script>
      /*
     computed的原理:
        本质其实也是一个Watcher,但是具有缓存功能，默认是不触发的，computed中的每一个key都是被定义在vm上的
        对应的value其实就是Object.defineProperty中的get或者get/set,当依赖的值发生变化的时候，会重新执行
        如果依赖的值没有发生变化，不会重新执行，会返回上一次的值(缓存)

        计算属性中的key是没有收集渲染Watcher的，只有计算Watcher,计算属性中所依赖的值都有一个Dep，我们应该让这些Dep去收集渲染Watcher
        这样的话，当依赖的值发生了变化，会通知渲染Watcher去更新

        因为当我们去定义计算属性的时候，默认并不会调用watcher中的get方法,也就不会再Dep.target上面存放任何Watcher,
        接着当我们去挂载组件的时候，我们会去new一个渲染Watcher，然后在Dep.target上面存放了渲染Watcher,接着去渲染模板的
        时候，会在vm上面取计算属性中的key值，然后又在Dep.target上面存放了计算Watcher，此时计算Watcher覆盖了渲染Watcher
        所以当我们去修改计算属性依赖值的时候，页面并不会重新渲染

        解决方案:
          每次在Dep.target上面赋值的时候，在重新维护一个栈结构，把Watcher存放进去，当我们的计算Watcher覆盖了渲染Watcher的时候，
          让计算属性依赖的值去收集渲染Watcher即可

    */
      const vm = new Vue({
        el: '#root',
        data() {
          return {
            firstName: 'zcf',
            lastName: 'cxh',
          };
        },
        computed: {
          // 第一种写法，就是默认的get
          fullName() {
            console.log('我进来了');
            return this.firstName + '-' + this.lastName;
          },
          // 第二种写法，当需要set方法时，要这么写
          // fullName:{
          //   get(){

          //   },
          //   set(){

          //   }
          // }
        },
      });
      // console.log(vm.fullName)
      // console.log(vm.fullName)
      // console.log(vm.fullName)
      // console.log(vm.fullName)

      // 当我们去修改计算属性中所依赖数据的值时，计算属性中的get要重新执行
      setTimeout(() => {
        vm.firstName = 'ZCF';
      }, 1000);
    </script>
  </body>
</html>
```

### 2.state.js 文件代码改动如下

```js
function initComputed(vm) {
  const computed = vm.$options.computed;
  vm._computedWatchers = {};
  Object.keys(computed).forEach((key) => {
    const value = computed[key];
    // value有2种，一种是对象，一种是函数
    let getter = typeof value === 'function' ? value : value.get;
    // 这个getter就是用户getter
    // vm._computedWatchers用于做一个映射表，方便后面我们拿到Watcher
    // getter函数内部的this是指向vm的
    vm._computedWatchers[key] = new Watcher(vm, getter.bind(vm), () => {}, {
      lazy: true,
    });
    defineComputed(vm, key, value);
  });
}

/**
 *
 * @param {*} key 计算属性对象中的每一个key，上面已经做了映射表
 */
function createComputedGetter(key) {
  // 返回后的get回调
  return function() {
    // 这里的this是vm调用的，因为我们定义了Object.defineProperty,第一个参数是vm
    // 因为我们的getter函数也被存到了Watcher中，所以我们需要拿到Watcher然后在特定时机调用即可
    const watcher = this._computedWatchers[key];
    // 计算属性的缓存
    if (watcher.dirty) {
      // 说明是脏的，需要调用用户的回调
      watcher.computedFn();
    }
    // 此时的计算Watcher已经覆盖了渲染Watcher,栈中存放了2个Watcher，一个计算，一个渲染
    if (Dep.target) {
      // 向上收集渲染Watcher
      // 找到相关依赖dep
      watcher.depend();
    }
    return watcher.value;
  };
}
function defineComputed(vm, key, value) {
  let shareComputed = {};
  if (typeof value === 'function') {
    // 因为计算属性具有缓存功能，所以我们这里用高阶函数返回一个getter，getter是否能被调用取决于dirty属性
    shareComputed.get = createComputedGetter(key);
  } else {
    shareComputed.get = createComputedGetter(key);
    shareComputed.set = value.set;
  }
  // 把key定义到vm上面，用于渲染模板
  Object.defineProperty(vm, key, shareComputed);
}
```

### 3.observe/dep 文件代码改动如下

```js
let id = 0;
class Dep {
  constructor() {
    this.id = id++;
    this.subs = [];
  }
  depend() {
    if (Dep.target) {
      // Dep.target就是watcher
      Dep.target.addDeps(this); // this是当前实例dep
    }
  }
  addSubs(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach((watcher) => watcher.update());
  }
}

Dep.target = null;
let stack = [];
export function pushTarget(watcher) {
  Dep.target = watcher;
  stack.push(watcher);
}
export function popTarget() {
  // Dep.target = null
  stack.pop();
  Dep.target = stack[stack.length - 1];
}
export default Dep;
```

### 4.observe/watcher 文件代码改动如下

```js
import { pushTarget, popTarget } from './dep';
import { queueWatcher } from './scheduler';
let id = 0;
class Watcher {
  /**
   *
   * @param {*} vm Vue实例
   * @param {*} updateFnOrExpr 更新的方法或者表达式
   * @param {*} cb 自定义回调函数
   * @param {*} options 其他选项配置
   */
  constructor(vm, updateFnOrExpr, cb, options = {}) {
    this.vm = vm;
    this.id = id++; // 每个watcher都是单独的，用id来区分一下
    this.user = !!options.user; // 区分是否为用户Watcher
    this.lazy = !!options.lazy; // 区分是否为计算Watcher，默认不执行
    this.dirty = !!options.lazy; // 区分是否需要调用计算属性中的get回调
    this.cb = cb;
    this.options = options;
    this.deps = [];
    this.depsId = new Set();
    if (typeof updateFnOrExpr === 'string') {
      // 表示为一个表达式，因为等下要调用this.get，get方法中会调用updateFnOrExpr，所以我们这里重写updateFnOrExpr
      // 等下调用this.get会存储用户Watcher,然后调用this.updateFnOrExpr会触发我们下面的函数，然后会触发响应式中的get方法
      // 会去收集用户Watcher，然后返回vm.name的值
      // 当我们去改变name值的时候，会通知Watcher更新，我们收集新值和老值然后去调用用户回调即可
      this.updateFnOrExpr = function() {
        // return vm[updateFnOrExpr]

        // 外界可能传入这种格式,'hobby.a'(),我们需要取到a的值,就不能按照上面那种写法了
        let obj = vm;
        const arr = updateFnOrExpr.split('.');
        for (let i = 0; i < arr.length; i++) {
          obj = obj[arr[i]];
        }
        return obj;
      };
    } else {
      // 表示为渲染Watcher
      this.updateFnOrExpr = updateFnOrExpr;
    }

    this.value = this.lazy ? undefined : this.get();
  }
  get() {
    pushTarget(this);
    // 这个方法会触发Object.defineProperty中的get，会去vm上面取值,第一次的值就是最早的值，第二次的值就是最新的值
    const value = this.updateFnOrExpr();
    popTarget(); // 在外面用vm上的属性是不需要收集Watcher的
    return value;
  }
  // 存放dep,如果模板中使用了2次 {{ name }} {{ name }},他们其实用的是一个id，那么我们就不需要存放到数组中，需要进行去重
  addDeps(dep) {
    const id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      // 调用dep的addSubs方法来存放watcher
      dep.addSubs(this);
    }
  }
  // Vue中是异步更新的，主要是做一个缓存等待
  // 如果watcher的id都是一样，那么要进行去重，而且只需要更新一次即可 (防抖) ，同一个页面多个dep公共一个watcher
  // 所以Vue内部更新原理是: 去重 + 防抖
  update() {
    if (this.lazy) {
      this.dirty = true;
    } else {
      queueWatcher(this);
    }
  }
  run() {
    // 更新
    const newVal = this.get();
    if (this.user) {
      const oldValue = this.value;
      // 下一次的老值是这一次的新值
      this.value = newVal;
      // 表示是用户watcher
      this.cb.call(this.vm, newVal, oldValue);
    }
  }
  // 计算属性的缓存
  computedFn() {
    this.dirty = false;
    // get函数的返回值就是外面用户在get函数中return的值
    this.value = this.get();
  }
  depend() {
    // 因为我们在计算属性中取了值，所以会去收集dep
    let i = this.deps.length;
    while (i--) {
      const dep = this.deps[i];
      dep.depend();
    }
  }
}

export default Watcher;
```

## 06.手写生命周期原理和手写 mixin 原理

### 1.index.html 文件代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <div id="root"></div>
    <script src="./dist/vue.js"></script>
    <script>
      /*
      mixin原理:
        Vue源码中在Vue上增加了一个静态属性options,默认为一个空对象,当我们去调用mixin函数进行混合的时候
        内部会进行合并策略，不同的属性会应用不同的合并策略，内部使用了策略模式(设计模式)来解决if/else过多的
        问题

      生命周期原理:
        用了策略模式，将所有的钩子函数以字符串的方式放入一个数组中，然后合并的时候会将外部存在的钩子重写成函数,
        采用先进先出的方式来进行管理钩子函数，当外部调用钩子的时候，会触发callHooks函数，内部会按顺序依次调用,
        并且将钩子函数内部的this修改为Vue的实例

      主要的生命周期(8个)执行顺序:
        beforeCreate: 在初始化数据之前，数据还没有被处理成响应式前调用
        created: 初始化数据之后，初始化数据包括且不限于 初始化watch,computed,data,里面的数据已经是响应式了
        beforeMount: 即将挂载组件之前，调用_render之前
        mounted: 挂载完组件之后，页面渲染完毕，在触发mounted，只执行一次
        beforeUpdate: 更新组件之前被调用
        updated: 更新组件之后
        beforeDestroy: 组件卸载之前
        destroyed: 组件卸载之后

        mixin中生命周期的合并策略:
          将mixin配置对象中使用的钩子函数全部放入到一个数组中，先调用mixin函数的先放，调用的时候也是先进先出,
          new Vue里面的配置项也会进行合并
    */
      Vue.mixin({
        beforeCreate() {
          console.log('beforeCreate 1');
        },
      });
      Vue.mixin({
        beforeCreate() {
          console.log('beforeCreate 2');
        },
      });
      new Vue({
        el: '#root',
        data() {
          return {
            a: 1,
          };
        },
        beforeCreate() {
          console.log('beforeCreate 3');
        },
      });
    </script>
  </body>
</html>
```

### 2.lib 目录新增文件

| global-api 目录 | 全局 Api 定义   |
| --------------- | --------------- |
| index.js 文件   | 新增 mixin 方法 |

### 3.global/index 文件代码

```js
/**
 * Vue的全局方法模块
 */
import { mergeOptions } from '../utils';
export function globalMixin(Vue) {
  Vue.options = {};
  Vue.mixin = function(options) {
    // 每次调用mixin方法都会进行合并，然后记录下来，放到Vue.options属性上
    this.options = mergeOptions(this.options, options);
  };
}
```

### 4.utils 文件新增代码

```js
const hooks = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
];
const stracts = {};
for (let i = 0; i < hooks.length; i++) {
  const hook = hooks[i];
  stracts[hook] = mergeHook;
}

function mergeHook(parentValue, childValue) {
  if (parentValue) {
    // 有值说明是类似这样{hook:[fn]},我们直接合并就行
    // parentValue就是 [fn]
    return parentValue.concat(childValue);
  } else {
    // 第一个parentValue是空对象，那么我们需要编程{hook:[fn]}
    return [childValue];
  }
}

export function mergeOptions(parent, child) {
  let obj = {};
  for (let key in parent) {
    mergeField(key);
  }
  for (let key in child) {
    mergeField(key);
  }
  function mergeField(key) {
    /**
     *
     * 情况:
     *  parent : {a:1} child : {a:2} ==> {a:2}
     *  parent : {a:1,data:{c:1}} child : {b:2,data:{d:2}} ==> {a:1,data:{c:1,d:2},b:2}
     *  parent : {}  child : {beforeCreated:fn} ==> {beforeCreated:[fn]}
     *  parent : {beforeCreated:[fn]} child : {beforeCreated:fn} ==> {beforeCreated:[fn1,fn2]}
     * **/
    const parentValue = parent[key];
    const childValue = child[key];
    // 生命周期策略
    if (stracts[key]) {
      obj[key] = stracts[key](parentValue, childValue);
    } else {
      // 如果value是对象，暂时不考虑递归合并，浅拷贝
      // 如果value不是对象，那么以child数据为准
      if (isObject(parentValue) && isObject(childValue)) {
        obj[key] = { ...parentValue, ...childValue };
      } else {
        // 如果子没值，就取父的值
        obj[key] = childValue || parentValue;
      }
    }
  }
  return obj;
}
```

### 5.init 文件代码改动如下

```js
import { initState } from './state';
import { mountComponent } from './lifecycle';
import { CompileToFunction } from './compile/index';
import { callHooks } from './lifecycle';
import { mergeOptions } from './utils';
export function initMixin(Vue) {
  Vue.prototype._init = function(options) {
    const vm = this;
    // vm.$options = options
    // 将$options中的选项和Vue.options进行合并，这样的话，mixin中就可以混入数据到组件中
    vm.$options = mergeOptions(vm.constructor.options, options);
    // 初始化数据之前调用beforeCreate
    callHooks(vm, 'beforeCreate');
    initState(vm);
    // 初始化数据之后调用created
    callHooks(vm, 'created');
    // 挂载
    if (vm.$options.el) {
      vm.$mount(vm);
    }
  };
  Vue.prototype.$mount = function(vm) {
    let el = vm.$options.el;
    if (!vm.$options.render) {
      el = document.querySelector(el);
      vm.$el = el;
      el = el.outerHTML;
      let render = CompileToFunction(el);
      vm.$options.render = render;
    }
    // 挂载组件
    mountComponent(vm, el);
  };
}
```

### 6.lifecycle 文件代码改动如下

```js
import { patch } from './vDom/patch';
import { nextTick } from './utils';
import Watcher from './observe/watcher';
export function mountComponent(vm, el) {
  // 挂载组件之前调用beforeMount钩子
  callHooks(vm, 'beforeMount');
  const updateComponent = () => {
    // 生成虚拟dom
    const vNode = vm._render();
    // 更新
    vm._update(vNode);
  };
  // updateComponent() ==> 更新组件
  // 这里渲染的时候我们创建一个Watcher，在Watcher中更新组件
  new Watcher(
    vm,
    updateComponent,
    () => {
      console.log('update view');
    },
    true
  ); // true代表是一个渲染Watcher
  callHooks(vm, 'mounted');
}
export function lifecycleMixin(Vue) {
  Vue.prototype._update = function(vNode) {
    const vm = this;
    vm.$el = patch(vm.$el, vNode);
  };
  Vue.prototype.$nextTick = nextTick;
}

// 调用指定的钩子函数
export function callHooks(vm, hook) {
  // 拿到Vue.options上经过mixin合并的hook
  // const handlers = vm.constructor.options[hook]
  // 因为我们将Vue.options和vm.$options进行了合并，让mixin中的数据可以混入到组件中，所以我们直接调用组件的$options中的钩子就行(已经被合并过了)
  const handlers = vm.$options[hook];
  // console.log(handlers, hook)
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      const handler = handlers[i];
      // 钩子内部的this指向的是当前组件实例
      handler.call(vm);
    }
  }
}
```

## 07.手写子组件渲染原理和手写 extend 原理

### 1.index.html 文件代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <div id="root">
      <my-button></my-button>
    </div>
    <script src="./dist/vue.js"></script>
    <script>
      /*

      extend原理:
        传入一个对象，可以返回一个类，类名叫VueComponent，这个类继承自Vue，可以拥有Vue原型上所有的方法
        传入的配置项会和Vue.options进行合并

      子组件渲染流程:
        子组件会被Vue.extend包装成一个类，这个类继承Vue，然后当我们创建虚拟dom的时候，判断是否是原生标签，如果
        是原生标签，就创建原生标签的虚拟dom，如果不是原生原生标签，就创建组件的虚拟节点，在转换成真实dom时，判断
        是否为组件，如果是组件，会调用data.init方法，这个方法内部就会调用类(被Vue.extend包装的),然后在类中调用
        组件初始化方法,_init(),然后渲染子组件的template模板，template模板的优先级比el的优先级高

    */

      // 会被放入到Vue.options.componnets
      Vue.component('my-button', {
        template: '<button>click me 2</button>',
      });
      new Vue({
        el: '#root',
        beforeCreate() {
          console.log('parent beforeCreate');
        },
        mounted() {
          console.log('parent mounted');
        },
        // 这种方式创建的组件和全局创建的组件都会被extend包装成一个类，类继承Vue，他们彼此不会覆盖，会按照原型链的方式串联起来
        // 如果组件内部没有，会去全局查找
        components: {
          'my-button': {
            template: '<button>click me1</button>',
            beforeCreate() {
              console.log('child beforeCreate');
            },
            mounted() {
              console.log('child mounted');
            },
          },
        },
      });
    </script>
  </body>
</html>
```

### 2.utils 文件新增代码

```js
// 组件的合并策略
/**
 * 会按照原型链的方式进行合并，如果自身上找不到，在找原型上的(Vue.component)
 */
stracts.components = function(parentValue, childValue) {
  // options.__proto__ = parentValue
  let options = Object.create(parentValue);
  if (childValue) {
    for (let key in childValue) {
      options[key] = childValue[key];
    }
  }
  return options;
};

/**
 * 判断是否为原生标签
 * @param {*} tag 标签
 */
export function isReverseTag(tag) {
  // 这里我们意思一下就行
  const str = 'a,b,i,img,p,ul,li,div,button';
  return str.includes(tag);
}
```

### 3.global/index 文件新增代码

```js
// 为了让以后所有的组件都可以拿到这个属性
Vue.options._base = Vue;
// 用component方法注册的组件会被放到这里
Vue.options.components = {};
Vue.component = function(id, options) {
  options = this.options._base.extend(options);
  this.options.components[id] = options;
};
Vue.extend = function(options) {
  const Super = this;
  let Sub = function VueComponent(options) {
    this._init(options);
  };
  // 继承
  // 相当于Sub.prototype.__proto__ = Super.prototype
  Sub.prototype = Object.create(Super.prototype);
  // 修正此继承bug
  Sub.prototype.constructor = Sub;
  // 合并,每个组件都有一个自己的options选项，options选项会和Vue.options选项进行合并操作
  Sub.options = mergeOptions(Super.options, options);
  return Sub;
};
```

### 4.vdom/index 文件改动如下

```js
import { isReverseTag, isObject } from '../utils';
export function createElement(vm, tag, data = {}, ...children) {
  // 判断是否为原生标签，如果是原生标签，就渲染原生的虚拟节点
  // 反之，渲染组件的虚拟节点
  if (isReverseTag(tag)) {
    return createVDom(vm, tag, data, data.key, children, undefined);
  } else {
    // 说明是组件，应该返回组件的虚拟节点
    const Ctor = vm.$options.components[tag];
    return createComponent(vm, tag, data, data.key, children, Ctor);
  }
}

function createComponent(vm, tag, data, key, children, Ctor) {
  if (isObject(Ctor)) {
    // 外面在new Vue中传入的components也会被extend，等同于Vue.component()
    Ctor = vm.$options._base.extend(Ctor);
  }
  data.hook = {
    init(vNode) {
      // 调用子组件
      if (Ctor) {
        let vm = (vNode.componentInstance = new Ctor({ isComponent: true }));
        vm.$mount();
      }
    },
  };
  // 组件的虚拟节点
  // console.log(createVDom(vm, `vue-componnet-${tag}`, data, key, undefined, undefined, { Ctor, children }))
  return createVDom(
    vm,
    `vue-componnet-${tag}`,
    data,
    key,
    undefined,
    undefined,
    { Ctor, children }
  );
}

export function createText(vm, text) {
  return createVDom(vm, undefined, undefined, undefined, undefined, text);
}
function createVDom(vm, tag, data, key, children, text, componentOptions) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text,
    componentOptions,
  };
}
```

### 5.vdom/patch 文件改动如下

```js
export function patch(oldVnode, vNode) {
  if (!oldVnode) {
    return createEl(vNode);
  }
  // 新旧虚拟dom比较,暂时不做
  const parent = oldVnode.parentNode;
  if (parent.nodeType === 1) {
    // 真实元素
    const elm = createEl(vNode);
    parent.insertBefore(elm, oldVnode.nextSibling);
    parent.removeChild(oldVnode);
    return elm;
  }
}

function createComponent(vNode) {
  let i = vNode.data;
  if ((i = i.hook) && (i = i.init)) {
    // 调用vNode.data.hook.init
    i(vNode);
  }
  if (vNode.componentInstance) {
    // 有属性说明子组件new完毕了，并且组件对应的真实DOM挂载到了componentInstance.$el
    return true;
  }
}

function createEl(vNode) {
  const { vm, text, key, children, tag, data } = vNode;
  let elm = '';
  if (typeof tag === 'string') {
    if (createComponent(vNode)) {
      // 返回组件对应的真实节点
      return vNode.componentInstance.$el;
    }
    // 标签
    elm = document.createElement(tag);
    if (children && children.length) {
      for (let i = 0; i < children.length; i++) {
        const item = children[i];
        elm.appendChild(createEl(item));
      }
    }
  } else {
    // 文本
    elm = document.createTextNode(text);
  }
  return elm;
}
```

## 08.手写 diff 算法

### 1.index.html 文件代码

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <div id="app">
      <ul>
        <li key="A">{{a}}</li>
      </ul>
    </div>
    <script src="./dist/vue.js"></script>
    <script>
      /*
      diff算法:
        diff算法采用分层求异的方式，来控制粒度的最小变化，目的就是尽可能复用老的节点
        只对比同层级节点，不会跨层级比较

        注意:
          初始化挂载不会进行diff算法比较，因为diff算法依赖的是新旧的虚拟dom，第一次挂载只会生成一次虚拟dom
          在更新时会生成新的虚拟dom,这时候新旧虚拟dom会进行比较，差别化更新
    */
      const vm = new Vue({
        el: '#app',
        data: {
          a: 'hello',
        },
      });
      setTimeout(() => {
        vm.a = 'zcf';
      }, 3000);
    </script>
  </body>
</html>
```

### 2.index.js 文件模板

> import { CompileToFunction } from './compile/index'

> import { createEl, patch } from './vDom/patch'

> 第一种:如果标签不一样，直接用新的标签替换掉老的标签

> // let oldTemplate = `<p>message</p>`

> 第二种:比对属性

> let oldTemplate = `<div a="1" style="font-size:14px;">1</div>`

> 第三种:如果没有标签，文本不一样，直接替换文本

> // let oldTemplate = `message`

> 第四种:如果标签一样，老的有孩子,新的没孩子

> let oldTemplate = `<div><li>A</li></div>`

> 第五种:如果标签一样，老的没孩子,新的有孩子

> let oldTemplate = `<div></div>`

> 第六种:都有孩子

> let oldTemplate = `<div> // <li>A</li> // <li>B</li> // <li>C</li> // </div>`

> 第七种:新增一个孩子(尾部添加)的情况

> let oldTemplate = `<div> // <li>A</li> // <li>B</li> // <li>C</li> // </div>`

> 第八种:新增一个孩子(头部添加)的情况

> let oldTemplate = `<div> // <li key="A">A</li> // <li key="B">B</li> // <li key="C">C</li> // </div>`

> 第九种:老头和新尾相同情况

> let oldTemplate = `<div> // <li key="A">A</li> // <li key="B">B</li> // <li key="C">C</li> // <li key="D">D</li> // </div>`

> 第十种:老尾和新头相同情况

> let oldTemplate = `<div> // <li key="A">A</li> // <li key="B">B</li> // <li key="C">C</li> // <li key="D">D</li> // </div>`

> 第十一种:删除一个的情况

> let oldTemplate = `<div> // <li key="A">A</li> // <li key="B">B</li> // <li key="C">C</li> // <li key="D">D</li> // </div>`

> 第十二种:乱序

> let oldTemplate = `<div> // <li key="A">A</li> // <li key="B">B</li> // <li key="C">C</li> // <li key="D">D</li> // </div>`

```js
let render1 = CompileToFunction(oldTemplate);

let vm1 = new Vue({
  data: {
    // message: 1,
  },
});
const oldNode = render1.call(vm1);
document.body.appendChild(createEl(oldNode));
```

> 第一种:如果标签不一样，直接用新的标签替换掉老的标签

> // let newTemplate = `<div>message</div>`

> 第二种: 标签一样，对比属性

> let newTemplate = `<div a="b" style="color:red;">1</div>`

> 第三种:如果没有标签，文本不一样，直接替换文本

> // let newTemplate = `message`

> 第四种:如果标签一样，老的有孩子,新的没孩子

> let newTemplate = `<div></div>`

> 第五种:如果标签一样，老的没孩子,新的有孩子

> let newTemplate = `<div><li>A</li></div>`

> 第六种:都有孩子

> let newTemplate = `<div> // <li>A</li> // <li>D</li> // <li>C</li> // </div>`

> 第七种:新增一个孩子(尾部添加)的情况

> let newTemplate = `<div> // <li>A</li> // <li>B</li> // <li>C</li> // <li>D</li> // </div>`

> 第八种:新增一个孩子(头部添加)的情况

> let newTemplate = `<div> // <li key="D">D</li> // <li key="E">E</li> // <li key="A">A</li> // <li key="B">B</li> // <li key="C">C</li> // </div>`

> 第九种:老头和新尾相同情况

> let newTemplate = `<div> // <li key="B">B</li> // <li key="C">C</li> // <li key="D">D</li> // <li key="A">A</li> // </div>`

> 第十种:老尾和新头相同情况

> let newTemplate = `<div> // <li key="D">D</li> // <li key="A">A</li> // <li key="B">B</li> // <li key="C">C</li> // </div>`

> 第十一种:删除一个的情况

> let newTemplate = `<div> // <li key="A">A</li> // <li key="B">B</li> // <li key="C">C</li> // </div>`

> 第十二种:乱序

> let newTemplate = `<div> // <li key="B">B</li> // <li key="F">F</li> // <li key="D">D</li> // <li key="E">E</li> // </div>`

```js
let render2 = CompileToFunction(newTemplate);

let vm2 = new Vue({
  data: {
    // message: 2,
  },
});
const newNode = render2.call(vm2);

setTimeout(() => {
  patch(oldNode, newNode);
}, 2000);
```

### 3.vdom/patch 文件代码

```js
export function patch(oldVnode, vNode) {
  if (!oldVnode) {
    return createEl(vNode);
  }
  const parent = oldVnode.parentNode;
  if (parent && parent.nodeType === 1) {
    // 真实元素
    const elm = createEl(vNode);
    parent.insertBefore(elm, oldVnode.nextSibling);
    parent.removeChild(oldVnode);
    return elm;
  } else {
    // diff算法比较
    // console.log(oldVnode, vNode)
    // 第一种，如果标签名不一样，直接新的覆盖老的
    if (oldVnode.tag !== vNode.tag) {
      return oldVnode.el.parentNode.replaceChild(createEl(vNode), oldVnode.el);
    }
    // 说明标签肯定一样，复用老的节点
    let el = (vNode.el = oldVnode.el);
    // 如果文本不一样,用新的文本替换老的文本
    if (oldVnode.tag === undefined) {
      if (oldVnode.text !== vNode.text) {
        el.textContent = vNode.text;
      }
      return;
    }
    // 比对属性
    patchProps(vNode, oldVnode.data);
    // 比对孩子
    const oldChildren = oldVnode.children || [];
    const newChildren = vNode.children || [];
    // 都有孩子
    if (oldChildren.length > 0 && newChildren.length > 0) {
      // 比对孩子
      patchChildren(el, oldChildren, newChildren);
    } else if (oldChildren.length > 0) {
      // 老节点有孩子，新节点没孩子,应该删除孩子
      el.innerHTML = '';
    } else if (newChildren.length > 0) {
      // 新节点有孩子，老节点没孩子,应该添加孩子
      for (let i = 0; i < newChildren.length; i++) {
        el.appendChild(createEl(newChildren[i]));
      }
    }
    return el;
  }
}

function patchChildren(el, oldChildren, newChildren) {
  // 双指针
  let oldStartIndex = 0;
  let oldStartNode = oldChildren[oldStartIndex];
  let oldEndIndex = oldChildren.length - 1;
  let oldEndNode = oldChildren[oldEndIndex];

  let newStartIndex = 0;
  let newStartNode = newChildren[newStartIndex];
  let newEndIndex = newChildren.length - 1;
  let newEndNode = newChildren[newEndIndex];

  // 乱序情况的映射表
  const makeIndexForKey = oldChildren.reduce((p, c, i) => {
    // 用户key
    const key = c.key;
    p[key] = i;
    return p;
  }, {}); // {A:0,B:1,C:2,D:3}

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 只要新老节点 有一方没有，循环就结束
    // 如果老节点没值，说明已经被移动走了，直接跳过即可
    if (!oldStartNode) {
      oldStartNode = oldChildren[++oldStartIndex];
    } else if (!oldEndNode) {
      oldEndNode = oldChildren[--oldEndIndex];
    }

    if (isSameNode(oldStartNode, newStartNode)) {
      // 头头比较
      // 递归比较文本,标签,属性,子节点
      patch(oldStartNode, newStartNode);
      // 移动指针,更改节点
      oldStartNode = oldChildren[++oldStartIndex];
      newStartNode = newChildren[++newStartIndex];
    } else if (isSameNode(oldEndNode, newEndNode)) {
      // 尾尾比较
      patch(oldEndNode, newEndNode);
      oldEndNode = oldChildren[--oldEndIndex];
      newEndNode = newChildren[--newEndIndex];
    } else if (isSameNode(oldStartNode, newEndNode)) {
      // 老头和新尾比较
      // 如果一样，应该插入到最后一个元素的下一项元素前面reverse
      patch(oldStartNode, newEndNode);
      el.insertBefore(oldStartNode.el, oldEndNode.el.nextSibling);
      oldStartNode = oldChildren[++oldStartIndex];
      newEndNode = newChildren[--newEndIndex];
    } else if (isSameNode(oldEndNode, newStartNode)) {
      // 老尾和新头比较
      // 如果一样，应该插入到第一个元素的前面
      patch(oldEndNode, newStartNode);
      el.insertBefore(oldEndNode.el, oldStartNode.el);
      oldEndNode = oldChildren[--oldEndIndex];
      newStartNode = newChildren[++newStartIndex];
    } else {
      // 乱序比较
      // 将老的节点形成一个映射表，然后用新元素去老的里面找，如果找到了，就给他插入到老开头指针的前面，没找到，就在老指针前面插入一个元素
      // 找到了，就在映射表里面将找到的那一项填个坑，赋值为null,然后递归比较子节点
      const newKey = newStartNode.key;
      // 如果newKey在映射表里面不存在，就说明是新节点，要创建的，创建的节点要放在老节点开始的前面
      if (!makeIndexForKey[newKey]) {
        el.insertBefore(createEl(newStartNode), oldStartNode.el);
      } else {
        const moveIndex = makeIndexForKey[newKey];
        const moveNode = oldChildren[moveIndex];
        // oldChildren中的这项值填充null，表示被移动走了,也防止数组塌陷
        oldChildren[moveIndex] = null;
        // 移动
        el.insertBefore(moveNode.el, oldStartNode.el);
        // 递归比较子节点
        patch(moveNode, newStartNode);
      }
      // 移动新指针
      newStartNode = newChildren[++newStartIndex];
    }
  }
  // 新增一个的情况,可能是头部增加，可能是尾部增加，这个时候我们就需要用key来进行判断了
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // insertBefore可能实现appendChild功能
      // 看尾指针元素的下一个元素是否存在，如果存在，就代表是往前追加，如果不存在，代表是往后追加
      const nextNode = newChildren[newEndIndex + 1];
      const anthor = nextNode ? nextNode.el : null;
      el.insertBefore(createEl(newChildren[i]), anthor);
    }
  }
  // 删除一个的情况
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      if (oldChildren[i]) {
        el.removeChild(oldChildren[i].el);
      }
    }
  }
}

function isSameNode(oldNode, newNode) {
  return oldNode.tag === newNode.tag && oldNode.key === newNode.key;
}

function patchProps(vNode, oldProps = {}) {
  let el = vNode.el;
  let newProps = vNode.data || {};
  let newStyle = newProps.style || {};
  let oldStyle = oldProps.style || {};

  for (let key in oldStyle) {
    // 如果老的样式在新的上面没有，应该删除老的样式
    if (!newStyle[key]) {
      el.style[key] = '';
    }
  }

  for (let key in oldProps) {
    // 如果老的属性新的上面没有，应该删除老的
    if (!newProps[key]) {
      if (key === 'style') {
        for (let attr in oldProps[key]) {
          el.style[attr] = '';
        }
      } else {
        el.removeAttribute(key);
      }
    }
  }

  // 循环添加新属性
  for (let key in newProps) {
    if (key === 'style') {
      for (let attr in newProps[key]) {
        el.style[attr] = newProps[key][attr];
      }
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}

function createComponent(vNode) {
  let i = vNode.data;
  if ((i = i.hook) && (i = i.init)) {
    // 调用vNode.data.hook.init
    i(vNode);
  }
  if (vNode.componentInstance) {
    // 有属性说明子组件new完毕了，并且组件对应的真实DOM挂载到了componentInstance.$el
    return true;
  }
}

export function createEl(vNode) {
  const { vm, text, key, children, tag, data } = vNode;
  let elm = '';
  if (typeof tag === 'string') {
    if (createComponent(vNode)) {
      // 返回组件对应的真实节点
      return vNode.componentInstance.$el;
    }
    // 标签
    elm = vNode.el = document.createElement(tag); // 虚拟节点上面都有一个el属性，对应真实元素，在做diff算法比较的时候有用
    patchProps(vNode);
    if (children && children.length) {
      for (let i = 0; i < children.length; i++) {
        const item = children[i];
        elm.appendChild(createEl(item));
      }
    }
  } else {
    // 文本
    elm = vNode.el = document.createTextNode(text);
  }
  return elm;
}
```

## 09.手写 vue-lazyload

### 1.使用 vue-cli 创建项目模板

### 2.随便写一个组件，使用 v-lazy 指令进行图片懒加载

### 3.v-lazy 指令代码如下

```js
let plugin = {
  install(Vue, options) {
    const LazyClass = lazy(Vue);
    const instance = new LazyClass(options);
    Vue.directive('lazy', {
      bind: instance.add.bind(instance),
      unbind: instance.remove.bind(instance),
    });
  },
};

const render = (instance, status) => {
  let el = instance.el;
  let src = '';
  // 根据状态设置不同src
  switch (status) {
    case 'loading':
      src = instance.options.loading;
      break;
    case 'loaded':
      src = instance.src;
      break;
    case 'error':
      src = instance.options.error;
  }
  el.setAttribute('src', src);
};

const loadImg = (src, resolve, reject) => {
  const img = new Image();
  img.src = src;
  img.onload = resolve;
  img.onerror = reject;
};

const lazy = (Vue) => {
  class ReactiveImg {
    constructor({ el, src, options }) {
      this.el = el;
      this.options = options;
      this.src = src;
      this.state = { loading: false };
    }
    checkInView() {
      const { top } = this.el.getBoundingClientRect();
      return top < window.innerHeight * this.options.preload;
    }
    load() {
      // 图片加载中...
      // 图片加载成功显示真实图片，图片加载失败显示失败信息
      render(this, 'loading');
      setTimeout(() => {
        loadImg(
          this.src,
          () => {
            this.state.loading = true;
            render(this, 'loaded');
          },
          () => {
            this.state.loading = true;
            render(this, 'error');
          }
        );
      }, 1000);
    }
  }

  return class LazyClass {
    constructor(options) {
      this.options = options;
      this.handler = false;
      this.listerens = [];
    }
    add(el, bindings) {
      Vue.nextTick(() => {
        const listeren = new ReactiveImg({
          el,
          src: bindings.value,
          options: this.options,
        });
        // 找到父级元素，绑定滚动事件
        const elm = scrollParent(el);
        this.listerens.push(listeren);
        if (!this.handler) {
          elm.addEventListener('scroll', this.scroll.bind(this));
          this.handler = true;
        }
        // 初始化显示图片
        this.scroll();
      });
    }
    scroll() {
      this.listerens.forEach((listeren) => {
        if (listeren.state.loading) return;
        // 判断是否需要显示
        listeren.checkInView() && listeren.load();
      });
    }
    remove() {}
  };
};

const scrollParent = (el) => {
  let parentNode = el.parentNode;
  // 找到滚动元素，这里我意思一下，只要找到overflow属性我就默认找到了
  while (parentNode) {
    if (/scroll/.test(getComputedStyle(parentNode)['overflow'])) {
      return parentNode;
    }
    parentNode = parentNode.parentNode;
  }
  return parentNode;
};

export default plugin;
```

## 10.ssr(待更新)

## 11.手写 vuex

### 1.vuex 核心目录如下

| vuex 目录/文件                | 含义                        |
| ----------------------------- | --------------------------- |
| modules 目录                  | 循环模块/重新整合模块       |
| module/module 文件            | 模块信息/循环模块           |
| module/module-collection 文件 | 重新整合模块/namespace 拼接 |
| helpers 文件                  | 辅助函数相关                |
| index 文件                    | 入口文件                    |
| install 文件                  | 插件的 install 方法         |
| store 文件                    | 核心逻辑模块                |
| utils 文件                    | 通用工具方法                |

### 2.install 文件代码

```js
export let _Vue;
export default function insall(Vue) {
  _Vue = Vue;
  // 给每个组件都混入一个钩子函数,目的是给每个组件都提供一个$store选项
  Vue.mixin(initMixin());
}

function initMixin() {
  return {
    beforeCreate() {
      let options = this.$options;
      if (options.store) {
        // 根组件
        this.$store = options.store;
      } else {
        // 子组件
        if (this.$parent && this.$parent.$store) {
          this.$store = this.$parent.$store;
        }
      }
    },
  };
}
```

### 3.index 文件代码如下

```js
import install from './install';
import Store from './store';
import { mapState, mapActions, mapMutations, mapGetters } from './helpers';
export { mapState, mapActions, mapMutations, mapGetters };
export default {
  install,
  Store,
};
```

### 4.utils 文件代码如下

```js
export function forEachValue(obj, fn) {
  Object.keys(obj).forEach((key) => {
    fn(obj[key], key);
  });
}
export function isArray(data) {
  return Array.isArray(data);
}
```

### 5.module/module 文件代码如下

```js
import { forEachValue } from '../utils';
export default class Module {
  constructor({ _raw, state, _children }) {
    this._raw = _raw;
    this.state = state;
    this._children = _children;
  }
  get namespaced() {
    return !!this._raw.namespaced;
  }
  getChild(name) {
    return this._children[name];
  }
  forEachGetters(cb) {
    this._raw.getters && forEachValue(this._raw.getters, cb);
  }
  forEachMutaions(cb) {
    this._raw.mutations && forEachValue(this._raw.mutations, cb);
  }
  forEachActions(cb) {
    this._raw.actions && forEachValue(this._raw.actions, cb);
  }
  forEachChild(cb) {
    this._children && forEachValue(this._children, cb);
  }
}
```

### 6.module/module-collection 文件代码如下

```js
import { forEachValue } from '../utils';
import Module from './module';
// 格式化模块
export default class ModuleCollection {
  constructor(options) {
    this.root = null;
    this.register([], options);
  }

  getNameSpace(path) {
    let module = this.root;
    return path.reduce((p, c) => {
      module = module.getChild(c);
      return module.namespaced ? p + c + '/' : p;
    }, '');
  }

  /**
   *
   * @param {*} path 区分父子关系
   * @param {*} options 模块
   */
  register(path, module) {
    let newModule = new Module({
      _raw: module, // 当前模块
      state: module.state, // 当前模块的状态
      _children: {}, // 当前模块的子模块集合
    });
    if (path.length === 0) {
      // 根模块
      this.root = newModule;
    } else {
      // 子模块
      // 找到父级模块
      // 比如[a,c] 注册c模块的时候应该插入到a里面
      // 递归回去的时候会把路径重置
      let parent = path.slice(0, -1).reduce((p, c) => {
        return p.getChild(c);
      }, this.root);
      parent._children[path[path.length - 1]] = newModule;
    }

    if (module.modules) {
      // 递归注册模块
      forEachValue(module.modules, (module, key) => {
        this.register(path.concat(key), module);
      });
    }
  }
}
```

### 7.store 文件代码如下

```js
import { _Vue } from './install';
import { forEachValue } from './utils';
import ModuleCollection from './module/module-collection';
export default class Store {
  constructor(options) {
    // 格式化模块
    this._modules = new ModuleCollection(options);
    this.wrapperGetters = {};
    this.getters = {};
    this.mutations = {};
    this.actions = {};
    const computed = {};
    const state = options.state;

    // 安装模块
    installModule(this, state, [], this._modules.root);
    forEachValue(this.wrapperGetters, (getter, key) => {
      computed[key] = getter;
      Object.defineProperty(this.getters, key, {
        get: () => this._vm[key],
      });
    });
    this._vm = new _Vue({
      data: {
        $$state: state,
      },
      computed,
    });
  }
  get state() {
    return this._vm._data.$$state;
  }
  commit(type, payload) {
    this.mutations[type] &&
      this.mutations[type].forEach((mutation) => mutation(payload));
  }
  dispatch() {
    this.actions[type] &&
      this.actions[type].forEach((action) => action(payload));
  }
}

function installModule(store, state, path, module) {
  const ns = store._modules.getNameSpace(path);

  // 子模块状态要安装到对应的父级模块中
  if (path.length > 0) {
    // [a]
    let newState = path.slice(0, -1).reduce((p, c) => {
      return p[c];
    }, state);
    newState[path[path.length - 1]] = module.state;
  }

  module.forEachGetters((fn, key) => {
    key = ns + key;
    store.wrapperGetters[key] = function() {
      // 用户getter函数绑定this指向实例，传入模块状态
      return fn.call(store, module.state);
    };
  });

  module.forEachMutaions((fn, key) => {
    key = ns + key;
    // mutations和actions会被合并成数组，依次调用
    store.mutations[key] = store.mutations[key] || [];
    store.mutations[key].push((payload) => {
      return fn.call(store, module.state, payload);
    });
  });

  module.forEachActions((fn, key) => {
    key = ns + key;
    store.actions[key] = store.actions[key] || [];
    store.actions[key].push((payload) => {
      return fn.call(store, store, payload);
    });
  });

  module.forEachChild((childModule, childKey) => {
    return installModule(store, state, path.concat(childKey), childModule);
  });
}
```

### 8.helpers 文件代码如下

```js
import { isArray } from './utils';

export function mapState(states) {
  let obj = {};
  if (isArray(states)) {
    for (let i = 0; i < states.length; i++) {
      const stateName = states[i];
      obj[stateName] = function() {
        return this.$store.state[stateName];
      };
    }
  } else {
    // 对象格式
    Object.keys(states).forEach((stateName) => {
      const fn = states[stateName];
      obj[stateName] = function() {
        return fn(this.$store.state);
      };
    });
  }
  return obj;
}
export function mapGetters(getters) {
  let obj = {};
  if (isArray(getters)) {
    for (let i = 0; i < getters.length; i++) {
      const getterName = getters[i];
      obj[getterName] = function() {
        return this.$store.getters[getterName];
      };
    }
  } else {
    // 对象格式
    Object.keys(getters).forEach((getterName) => {
      const fn = getters[getterName];
      obj[getterName] = function() {
        return fn(this.$store.state);
      };
    });
  }
  return obj;
}
export function mapMutations(mutations) {
  let obj = {};
  if (isArray(mutations)) {
    for (let i = 0; i < mutations.length; i++) {
      const mutationName = mutations[i];
      obj[mutationName] = function(...args) {
        return this.$store.commit(mutationName, args);
      };
    }
  } else {
    // 对象格式
    Object.keys(mutations).forEach((methodName) => {
      const type = mutations[methodName];
      obj[methodName] = function(...args) {
        return this.$store.commit(type, args);
      };
    });
  }
  return obj;
}
export function mapActions(actions) {
  let obj = {};
  if (isArray(actions)) {
    for (let i = 0; i < actions.length; i++) {
      const actionName = actions[i];
      obj[actionName] = function(...args) {
        return this.$store.dispatch(actionName, args);
      };
    }
  } else {
    // 对象格式
    Object.keys(actions).forEach((methodName) => {
      const type = actions[methodName];
      obj[methodName] = function(...args) {
        return this.$store.dispatch(type, args);
      };
    });
  }
  return obj;
}
```

## 12.手写 vue-router

### 1.目录介绍

| 目录/文件             | 含义                              |
| --------------------- | --------------------------------- |
| components 目录       | 全局组件(router-view/router-link) |
| history 目录          | 路由模式                          |
| create-matcher 文件   | 包含 addRoute,match 等方法        |
| create-route-map 文件 | 扁平化路由,路由映射表             |
| index 文件            | 核心                              |
| install 文件          | 插件入口                          |

### 2.install 文件代码如下

```js
import RouterLink from './components/link';
import RouterView from './components/view';
export let _Vue;
export default function install(Vue) {
  _Vue = Vue;
  Vue.mixin({
    beforeCreate() {
      const router = this.$options.router;
      if (router) {
        // 根组件
        this._router = router;
        this._routerRoot = this;
        this._router.init(this);
        // 响应式属性current
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        // 子孙组件
        if (this.$parent && this.$parent._routerRoot) {
          this._routerRoot = this.$parent._routerRoot;
        }
      }
    },
  });
  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      // 方法
      return this._routerRoot._router;
    },
  });
  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      // 属性current
      return this._routerRoot._route;
    },
  });
  Vue.component('router-link', RouterLink);
  Vue.component('router-view', RouterView);
}
```

### 3.create-matcher 文件代码如下

```js
import createRouteMap from './create-route-map';

export default function createMatcher(routes) {
  let { pathMap } = createRouteMap(routes);
  console.log(pathMap, '处理后的');
  function match(path) {
    return pathMap[path];
  }

  function addRoutes(routes) {
    createRouteMap(routes, pathMap);
  }
  return {
    match,
    addRoutes,
  };
}
```

### 4.create-route-map 文件代码如下

```js
export default function createRouteMap(routes, oldPathMap) {
  let pathMap = oldPathMap ? oldPathMap : {};
  routes.forEach((route) => {
    createRouteRecord(route);
  });
  function createRouteRecord(route, parent) {
    let path = parent ? `${parent.path}/${route.path}` : route.path;
    let record = {
      path,
      component: route.component,
      props: route.props || {},
      parent,
    };
    pathMap[path] = record;
    if (route.children && route.children.length > 0) {
      route.children.forEach((cRoute) => createRouteRecord(cRoute, record));
    }
  }
  return {
    pathMap,
  };
}
```

### 5.history/base 文件代码如下

```js
function createRoute(record, location) {
  let matched = [];
  if (record) {
    while (record) {
      if (record) {
        matched.unshift(record);
      }
      record = record.parent;
    }
  }
  return {
    ...location,
    matched,
  };
}
export default class History {
  constructor(router) {
    this.router = router;
    this.current = createRoute(null, {
      path: '/',
    }); // {path:'/',matched:[]}
  }
  listen(cb) {
    this.callback = cb;
  }
  // 核心方法
  transtionTo(path, cb) {
    // 当路径发生变化，渲染组件,那我们要收集匹配到的组件
    // 比如跳转到/about/a，我们要收集/about和/aboutA组件
    // 找到匹配的记录
    const record = this.router.match(path);

    // current属性变化，要渲染视图，所以我们要将current属性变成响应式属性
    const route = createRoute(record, { path });

    // 防止重复跳转
    if (
      route.path === this.current.path &&
      route.matched.length === this.current.matched.length
    )
      return;
    this.current = route;
    this.callback && this.callback(this.current);
    cb && cb();
  }
}
```

### 6.history/hash 文件代码如下

```js
import History from './base';
function ensurehash() {
  if (!window.location.hash) {
    window.location.hash = '/';
  }
}
function gethash() {
  return window.location.hash.slice(1);
}
export default class HashHistory extends History {
  constructor(router) {
    super(router);
    ensurehash();
  }
  getCurrentLocation() {
    return gethash();
  }
  setUplisten() {
    window.addEventListener('hashchange', () => {
      // 当路径发生变化后，要跳转
      this.transtionTo(gethash());
    });
  }
}
```

### 7.history/html5 文件代码如下

```js
import History from './base';
export default class HTML5History extends History {
  constructor(router) {
    super(router);
  }
  getCurrentLocation() {}
  setUplisten() {}
}
```

### 8.index 文件代码如下

```js
import install from './install';
import createMatcher from './create-matcher';
import HTML5History from './history/html5';
import HashHistory from './history/hash';
export default class VueRouter {
  constructor(options) {
    this.mode = options.mode || 'hash';
    console.log(options.routes, '原来的');
    // 扁平化数据
    // matcher上面有match方法和addRoutes方法
    this.matcher = createMatcher(options.routes || []);
    switch (this.mode) {
      case 'history':
        this.history = new HTML5History(this);
        break;
      case 'hash':
        this.history = new HashHistory(this);
        break;
      default:
        console.error(`invalid mode: ${this.mode}`);
        break;
    }
  }
  init(app) {
    // 默认要跳转
    const history = this.history;
    // 根据模式不同，要调用不同的方法
    const setUpListen = () => {
      history.setUplisten();
    };
    history.transtionTo(history.getCurrentLocation(), setUpListen);
    history.listen((route) => {
      app._route = route;
    });
  }
  match(path) {
    return this.matcher.match(path);
  }
  push(path) {
    this.history.transtionTo(path, () => {
      window.location.hash = path;
    });
  }
}
VueRouter.install = install;
```

### 9.components/link 文件代码如下

```js
export default {
  functional: true,
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  render: (h, context) => {
    const click = () => {
      // 点击a标签,要跳转
      context.parent.$router.push(context.props.to);
    };
    return <a onClick={click}>{context.slots().default}</a>;
  },
};
```

### 10.components/view 文件代码如下

```js
export default {
  functional: true,
  render: (h, { parent, data }) => {
    let route = parent.$route;
    let depth = 0;
    while (parent) {
      // $vnode ==> 组件占位符
      const vnodeData = parent.$vnode ? parent.$vnode.data : {};
      if (vnodeData.routerView) {
        // 找到父级router-view就加1,就渲染下一个组件
        depth++;
      }
      parent = parent.$parent;
    }

    let record = route.matched[depth];
    if (!record) {
      // 没有匹配到,空渲染
      return h();
    }
    data.routerView = true;
    return h(record.component, data);
  },
};
```

## 13.树形结构的增删改查

### 1.index.html 文件代码如下

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <script type="module">
      import DelayerTree from './index.js';
      const treeList = [
        {
          title: '菜单1',
          id: '11111',
          parentId: '0',
          children: [
            {
              title: '菜单1-1',
              parentId: '11111',
              id: '222222',
            },
          ],
        },
        {
          title: '菜单2',
          id: '333',
          parentId: '0',
          children: [
            {
              title: '菜单2-1',
              id: '444',
              parentId: '333',
              children: [
                {
                  title: '菜单2-1-1',
                  id: '6666',
                  parentId: '444',
                },
              ],
            },
            {
              title: '菜单2-2',
              id: '555',
              parentId: '333',
            },
          ],
        },
      ];
      // 格式化后的树实例
      const _tree1 = new DelayerTree(treeList);
      // console.log(_tree1)
      // 增加一条数据
      const _tree2 = _tree1.add('222222', {
        title: '我是新增的数据1',
      });
      // console.log(_tree2)
      // 增加一条数据
      const _tree3 = _tree1.add('6666', {
        title: '我是新增的数据2',
      });
      const _tree4 = _tree1.add('555', {
        title: '我是新增的数据3',
      });
      const _tree5 = _tree1.add('555', {
        title: '我是新增的数据4',
      });
      // console.log(_tree3)
      // 重新状态成树形结构
      const tree5 = _tree1.resetLoad(_tree5);
      console.log(tree5);
    </script>
  </body>
</html>
```

### 2.index.js 文件代码如下

```js
/**
 * 很多时候，后台都会返回给我们一个树形结构的数据，前端递归渲染
 * 那如果这个渲染出来的树要进行增删改查，我们怎么操作呢?
 *
 * 常规思路:
 *  增的时候递归找到当前的父级元素，在父级元素中增加一条数据
 *  查的时候递归查找当前元素，返回当前元素信息
 *  删的时候递归查找到当前元素id
 *  改的时候递归找到当前元素
 *
 * 以上可得:
 *  性能开销非常大，当我们树形结构嵌套越深，数据越多，开销就越大，可能会导致卡死/崩溃/缓慢的效果
 *
 * 优化思路:
 *  当我们前端递归渲染菜单的时候，对递归的数据进行扁平化处理，形成映射表，那么这样的话就方便很多了
 */

class DelayerTree {
  /**
   *
   * @param {*} options 后台返回的数据
   */
  constructor(options) {
    this.options = options;
    this._treeMap = {};
    this.dirty = false; // 为true就表示脏了，就重新装载树，false就返回老树
    this.delayerTree(options);
  }

  /**
   *
   * @param {string} parentId 要添加到哪个父级菜单中
   * @param  {...any} rest 额外参数
   */
  add(parentId, { ...rest }) {
    this.dirty = true;
    const uid = new Date() + Math.floor(Math.random() * 10000);
    // 找到对应的父级
    let parent = this._treeMap[parentId];
    const record = {
      id: uid,
      parentId,
      parent,
      isAdd: true, // 标识是新增的节点
      ...rest,
    };
    parent.children = parent.children ? parent.children : [];
    parent.children.push(record);
    this._treeMap[uid] = record;
    // 修改父级引用
    let topParent = this._treeMap[parent.parentId];
    if (typeof topParent.parent === 'undefined') {
      topParent.children[parent.inx] = parent;
      topParent = this._treeMap[topParent.parentId];
      parent = topParent;
    } else {
      while (topParent && typeof topParent.parent !== 'undefined') {
        // debugger
        topParent.children[parent.inx] = parent;
        topParent = this._treeMap[topParent.parentId];
        parent = topParent;
      }
    }
    return this._treeMap;
  }

  /**
   *
   * @param {*} id 要删除子项的id
   */
  remove(id) {
    this.dirty = true;
    delete this._treeMap[id];
    return this._treeMap;
  }

  /**
   *
   * @param {*} id 要更新子项的id
   * @param  {...any} rest 其他参数
   */
  update(id, ...rest) {
    this.dirty = true;
    const record = this._treeMap[id];
    this._treeMap[id] = {
      ...record,
      ...rest,
    };
    return this._treeMap;
  }

  /**
   *
   * @param {*} id 获取对应子项id的匹配记录
   */
  get(id) {
    return this._treeMap[id];
  }
  /**
   *
   * @param {*} tree[] 树形菜单数据 => 扁平化处理
   */
  delayerTree(tree) {
    for (let i = 0; i < tree.length; i++) {
      const ctree = tree[i];
      this.createTreeMap(ctree, undefined, i);
    }
  }
  /**
   *
   * @param {*} ctree 树的子节点
   */
  createTreeMap(ctree, parent, inx) {
    const { id, parentId, ...other } = ctree;
    let record = {
      id: id,
      parentId,
      parent,
      inx,
      ...other,
    };
    this._treeMap[id] = record;
    if (ctree.children && ctree.children.length > 0) {
      for (let i = 0; i < ctree.children.length; i++) {
        let child = ctree.children[i];
        this.createTreeMap(child, record, i);
      }
    }
  }
  /**
   *
   * @param {*} _treeMap 扁平化数据 ==> 树形菜单数据
   */
  resetLoad(_treeMap) {
    // 看有没有被操作过，如果没有被操作过，说明可以返回初始化的老树
    if (!this.dirty) return this.options;
    // 将映射表重新装载成树形结构
    let res = [];
    Object.keys(_treeMap).forEach((key) => {
      const record = _treeMap[key];
      if (typeof record.parent === 'undefined') {
        // 说明是顶层菜单
        res.push(record);
      }
    });
    return res;
  }
}
export default DelayerTree;
```

## 14.字典树

### 1.index.html 文件代码如下

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        list-style: none;
      }
    </style>
  </head>

  <body>
    <h1>请输入要搜索的数据</h1>
    <input type="text" id="input" />
    <ul id="ul"></ul>
    <script>
      // let results = []
      // 字典树 + 节流 + 虚拟列表
      function fetch(url, method = 'get') {
        return new Promise((resolve) => {
          const xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
            if (
              xhr.readyState === 4 &&
              xhr.status >= 200 &&
              xhr.status <= 299
            ) {
              resolve(JSON.parse(xhr.response));
            }
          };
          xhr.open(method, url);
          xhr.send();
        });
      }
      fetch('http://localhost:3000/getUsers').then((results) => {
        // results = []十万条数据
        class Leaf {
          constructor(id = '', value = '') {
            this.ids = id ? [id] : [];
            this.value = value;
            this.children = {};
          }
          share(id) {
            this.ids.push(id);
          }
          // key = zc
          getChildIds(keys) {
            let children = this.children;
            let res = [];
            for (let i = 0; i < keys.length; i++) {
              const key = keys[i]; // z , c
              if (children[key]) {
                res = children[key].ids
                  ? [...children[key].ids, ...children[key].childrenIds]
                  : children[key].childrenIds;
                children = children[key].children;
              } else {
                res = [];
                break;
              }
            }
            return res;
          }
        }
        // 模拟请求返回了100000条数据，根据关键字查询
        const root = new Leaf();
        // 构建字典树
        for (let i = 0; i < results.length; i++) {
          const userinfo = results[i];
          const name = userinfo.name;
          let templateRoot = root;
          for (let j = 0; j < name.length; j++) {
            const charStr = name[j];
            const reachEnd = j === name.length - 1;
            if (!templateRoot.children[charStr]) {
              // 说明树中没有，在树中添加
              templateRoot.children[charStr] = new Leaf(
                reachEnd ? userinfo.id : '',
                charStr
              );
            } else {
              if (reachEnd) {
                // 如果值相同，就追加id标识
                templateRoot.children[charStr].share(userinfo.id);
              }
            }
            templateRoot = templateRoot.children[charStr];
          }
        }
        console.log(root, 'root');
        // 优化
        budget(root);
        function childrenCollectionIds(root) {
          let ids = [];
          Object.keys(root).forEach((key) => {
            const value = root[key];
            ids = value.ids ? [...ids, ...value.ids] : ids;
            if (Object.keys(value.children).length) {
              ids = ids.concat(childrenCollectionIds(value.children));
            }
          });
          return ids;
        }
        // 预计算
        function budget(root) {
          const { children } = root;
          root.childrenIds = childrenCollectionIds(root.children);
          Object.keys(children).forEach((key) => {
            const leaf = children[key];
            leaf.childrenIds = childrenCollectionIds(leaf.children);
            budget(leaf);
          });
        }
        input.oninput = function(e) {
          const keyword = e.target.value;
          const ids = root.getChildIds(keyword);
          const res = ids.reduce((p, c) => {
            let count = 0;
            while (true) {
              if (results[count].id === c) {
                p.push(results[count]);
                break;
              }
              count++;
              if (count >= results.length) break;
            }
            return p;
          }, []);
          // console.log(res)
          innerHtml(ul, res);
        };
        function innerHtml(el, data = []) {
          let str = '';
          data.map((item) => {
            str += `<li>${item.name}</li>`;
          });
          console.log(str, 'str');
          el.innerHTML = str;
        }
      });
      // 模糊搜索
      // 收集叶子节点下的所有子节点id
      // function searchBlur(root, keyword) {
      //   let results = []
      //   let templateRoot = root
      //   for (let i = 0; i < keyword.length; i++) {
      //     // 拿到每一个关键字
      //     const charStr = keyword[i]
      //     // 判断是否在树中，不过首字母就已经不再树中了，那么直接跳出循环，因为我们是按首字母构建树的
      //     if (!templateRoot.children[charStr]) break
      //     else {
      //       templateRoot = templateRoot.children[charStr]
      //     }
      //     if (i === keyword.length - 1) {
      //       results = templateRoot.ids
      //       // results = [
      //       //   ...templateRoot.ids,
      //       //   // 收集该叶子节点下的所有子节点id集合,要优化
      //       //   ...childrenCollectionIds(templateRoot.children)
      //       // ]
      //       // 优化，预计算，因为树一旦生成，不会发生变化，提前计算好所有叶子节点的子节点id集合
      //     }
      //   }
      //   // console.log(results, 'results')
      //   return results
      // }
    </script>
  </body>
</html>
```

### 2.server.js 文件代码如下

```js
const http = require('http');
const fs = require('fs');
const path = require('path');

const strs = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'g',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];
function randomUserName(nums) {
  let cnums = nums;
  let res = [],
    str = '',
    max = 5;
  while (cnums--) {
    for (let i = 0; i < max; i++) {
      const randomNum = Math.floor(Math.random() * strs.length);
      const charStr = strs[randomNum];
      str += charStr;
    }
    res.push({
      id: cnums,
      name: str,
      // message: 'random testing',
    });
    str = '';
  }
  return res;
}
const server = http.createServer((req, res) => {
  // const users = randomUserName(100000)
  // console.log(users, 'users')
  if (req.url === '/index.html') {
    res.end(fs.readFileSync(path.resolve(__dirname, './index.html')));
  }
  if (req.url === '/getUsers') {
    res.end(JSON.stringify(randomUserName(100000)));
  }
});

server.listen(3000);
```
