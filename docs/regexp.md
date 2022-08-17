# 正则个人笔记(regexp)

## 1. 字符串替换

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <div class="content">
    www.zhengchangfu.com
  </div>
  <script>
    const div = document.querySelector('div')
    const con = prompt('请输入要匹配的内容，支持正则')
    const regexp = new RegExp(con, 'g')
    div.innerHTML = div.innerHTML.replace(regexp, search => {
      return `<span style="color:red">${search}</span>`
    })
  </script>
</body>

</html>
```

## 2. 表单验证

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    span {
      color: red;
      opacity: 0;
      transition: all 0.3s linear;
    }

    span.show {
      opacity: 1;
    }
  </style>
</head>

<body>
  <input type="text">
  <span></span>
  <script>
    const input = document.querySelector('input')
    const span = document.querySelector('span')
    input.addEventListener('keyup', function () {
      // 匹配规则，3-6位英文字母
      const flag = this.value.match(/^[a-z]{3,6}$/i)
      if (!flag) {
        span.innerHTML = '错误'
        span.classList.add('show')
      } else {
        span.classList.remove('show')
      }
    })
  </script>
</body>

</html>
```

## 3. m 多行匹配修正符

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <script>
    const str = `
    # 1. node.js 100元 #
    # 2. vue.js 100元 #
    # 3. react.js 100元 #
    # 4. dva 100元 #
    # 55. next.js 100元 #
    `
    // 要求:将1，2，3，5提取成一个对象，类似于{name:'node.js',price:100元}放入一个数组，4不满足，所以排除掉
    // m修饰符可以将多行看成一行对待
    const strArr = str.match(/^\s*#\s*\d+\.\s*[a-z]+\.js.+\s+#$/gm)
    let res = strArr.map(str => {
      // 去除前面多余字符
      str = str.replace(/\s*#\s*\d+\.\s*/, '')
      // 去除后面多余字符
      str = str.replace(/\s*#/, '')
      let [name, price] = str.split(' ')
      return {
        name,
        price
      }
    })
    console.log(res, 'res')
  </script>
</body>

</html>
```

## 4. 忽略换行符

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <script>
    const str = `
    chengxiaohui
    zhengchangfu
    `
    const reg = /.+/g
    console.log(str.match(reg))
    // s可以忽略换行符进行匹配
    const reg1 = /.+/gs
    console.log(str.match(reg1))
    // 匹配所有内容
    const reg2 = /[\s\S]+/g
    console.log(str.match(reg2))
  </script>
</body>

</html>
```

## 5. 原子组替换标签

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <script>
    let str = `
    <h1>chengxiaohui</h1>
    <span>children</span>
    <h2>zhengchangfu</h2>
    `
    // 要求:匹配h开头的标签，替换成p标签
    // \1是代表拿到前面一个原子组匹配出来的结果，因为标签是成对的，不可以这样<h1></h2>
    const reg = /<(h[1-6])>([\s\S]*)<\/\1>/gi
    // $1是所有原子组中匹配出来的第1个结果,以此类推,$1-$9
    // console.log(str.match(reg)) // ["<h1>chengxiaohui</h1>", "<h2>zhengchangfu</h2>"]
    // str = str.replace(reg, `<p>$2</p>`)
    // console.log(str)
    // 还可以使用函数的形式
    str = str.replace(reg, function (p0, p1, p2) {
      // console.log(p0) // 匹配到的整体标签
      // console.log(p1) // 原子组的第一个结果
      // console.log(p2) // 原子组的第二个结果
      return `<p>${p2}</p>`
    })
    console.log(str)
  </script>
</body>

</html>
```

## 6. 链接和内容提取成数组

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <script>
    const str = `
    <a class='zcf' href='http://www.zhengchangfu.com'>郑常富的网站1</a>
    <a id='cxh' href     ='https://chengxiaohui.com'>程小惠的网站2</a>
    <a class='zcfcxh' href='http://zhengchangfu.com.cn'>郑常富和程小惠的网站3</a>
    `

    // 将a标签中的链接地址和内容提取出来一个对象，放入一个数组中，如:[{link:'http://zhengchangfu.com',title:'郑常富的网站1'}]
    // 思路: 正则匹配链接和内容放入原子组，然后给匹配到的原子组进行重命名
    const reg = /<a.+?href\s*=(['"])(?<link>https?:\/\/(?:www.)?.*?\1)>(?<title>[\s\S]*?)<\/a>/ig
    // console.log(str.match(reg))
    let res = []
    for (let item of str.matchAll(reg)) {
      console.log(item['groups'])
      res.push(item['groups'])
    }
    console.log(res, 'res')
  </script>
</body>

</html>
```

## 7. 电话号码保护

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <script>
    const phoneList = [
      '18297523437',
      '12345678901',
      '18297523438',
    ]
    const reg = /(\d{3})\d{4}(\d{4})/
    // 将手机号码中间4位替换成*
    const newList = phoneList.map(item => {
      return item.replace(reg, (v, p1, p2) => {
        return `号码已被我惠哥保护,保护后的号码为:${p1}${'*'.repeat(4)}${p2}`
      })
    })
    console.log(newList, 'newList')


    const reg2 = /(?<=\d{3})\d{4}/   // 如果单纯的替换可以换成断言的方式
    const newList1 = phoneList.map(item => {
      return item.replace(reg2, (v) => {
        return `${'*'.repeat(4)}`
      })
    })
    console.log(newList1, 'newList1')
  </script>
</body>

</html>
```

## 8. 限制用户敏感字

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    span {
      color: red;
      opacity: 0;
      transition: all 0.4s linear;
    }

    span.show {
      opacity: 1;
    }
  </style>
</head>

<body>
  <input type="text" name='username'>
  <span>不可出现敏感词汇</span>
  <script>
    // 敏感词汇数组
    const sensitiveWords = [
      '操',
      '麻痹',
      '干',
      '傻逼'
    ]
    // 思路:遍历敏感词汇数组，看是否匹配上了任意一个，如果匹配上了，就说明用户输入了敏感词，就提示
    const input = document.querySelector(`[name = username]`)
    const validatorSpan = document.querySelector('span')
    input.addEventListener('keyup', e => {
      const value = e.target.value
      const isExits = sensitiveWords.some(word => value.match(new RegExp(word, 'g')))
      isExits ? validatorSpan.classList.add('show') : validatorSpan.classList.remove('show')
    })
  </script>
</body>

</html>
```

## 9. 数字转为千分位

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <input type="text" name='money'>
  <script>
    // 先分析转换的规律

    //#region
    // const num1 = 123
    // const num2 = 123.12
    // const formatNum1 = num1.toLocaleString('en-US');
    // const formatNum2 = num2.toLocaleString('en-US');
    // console.log(formatNum1); // 123
    // console.log(formatNum2); // 1,231.12

    // const num3 = 1234
    // const num4 = 1234.12
    // const num5 = 12345
    // const num6 = 12345.12
    // const formatNum3 = num3.toLocaleString('en-US');
    // const formatNum4 = num4.toLocaleString('en-US');
    // const formatNum5 = num5.toLocaleString('en-US');
    // const formatNum6 = num6.toLocaleString('en-US');
    // console.log(formatNum3) // 1,234
    // console.log(formatNum4) // 1,234.12
    // console.log(formatNum5) // 12,345
    // console.log(formatNum6) // 12,345.12

    // const num7 = 123456
    // const num8 = 123456.12
    // const num9 = 1234567
    // const num10 = 1234567.12
    // const formatNum7 = num7.toLocaleString('en-US');
    // const formatNum8 = num8.toLocaleString('en-US');
    // const formatNum9 = num9.toLocaleString('en-US');
    // const formatNum10 = num10.toLocaleString('en-US');
    // console.log(formatNum7) // 123,456
    // console.log(formatNum8) // 123,456.12
    // console.log(formatNum9) // 1,234,567
    // console.log(formatNum10) // 1,234,567.12
    //#endregion

    /*
      规律如下:
       1. 如果小于等于3位连续的数字，不变
       2. 如果大于3位的连续数字会从连续数字的最后一位往前数3位，依次加一个,号
       3. ,号前面最少要有1位数字
    */
    let str = 'zcf1zcf中'
    console.log(str.match(/zcf(?!(\d))/g))
    const input = document.querySelector(`[name=money]`)
    input.addEventListener('keyup', function () {
      const reg = /(?<=\d{3})\d*/
      //   div divaa out
      const antdReg = /\B(?=(\d{3})+(?![0-9]))/g

      console.log(this.value.replace(antdReg, str => {
        console.log(str)
      }))
    })
  </script>
</body>

</html>
```

## 10. 匹配插值语法

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <div class="root">
    <p>{{ name }}</p>
    <p>{{ age }}</p>
    <span>
      <div>{{ sex }} {{hobby}}</div>
    </span>
  </div>
  <script>
    const obj = {
      name: 'zcf',
      age: 2,
      sex: '男',
      hobby: '爱小惠'
    }
    const reg = /\{\{([\s\S]*?)\}\}/gi
    let outerHTML = document.querySelector('.root').outerHTML
    document.querySelector('.root').outerHTML = outerHTML.replace(reg, (p, p1) => {
      p1 = p1.replace(/\s*/g, '')
      return obj[p1]
    })
  </script>
</body>

</html>
```

## 11. 匹配标签

```js
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <div a='b' c="d" f=e>11</div>
  <input a='b' c="d" f=e />
  <script>
    const div = document.querySelector('div').outerHTML
    const input = document.querySelector('input').outerHTML
    const ncname = `[a-zA-Z_][0-9_a-zA-Z]*`; // 标签名
    const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //  用来获取的标签名的 match后的索引为1的
    const startTagOpen = new RegExp(`^<${qnameCapture}`); // 匹配开始标签的
    const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配闭合标签的
    //           aa  =   "  xxx "  | '  xxxx '  | xxx
    const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // a=b  a="b"  a='b'
    const startTagClose = /^\s*(\/?)>/; //     />   <div/>
    const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{aaaaa}}
    // console.log(div.match(new RegExp(ncname)))
    // console.log(input.match(new RegExp(ncname)))
    // console.log(div.match(new RegExp(qnameCapture)))
    // console.log(input.match(new RegExp(qnameCapture)))
    // console.log(div.match(startTagOpen))
    // console.log(input.match(startTagOpen))
    // console.log(div.match(endTag))
    // console.log(input.match(endTag))
    // console.log("   f=e>11</div>".match(attribute))
    // console.log(input.match(attribute))
    console.log(' />'.match(startTagClose))
  </script>
</body>

</html>
```

## 12. 断言知识点

```javascript
/*
      重点: 断言只是限制条件，不会参与到匹配结果中去
      ?=   后面是什么
      ?!   后面不是什么
      ?<=  前面是什么
      ?<!  前面不是什么
*/
```
