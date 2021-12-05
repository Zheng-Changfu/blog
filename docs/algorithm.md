# 算法学习之路

## 1. 什么是算法?

- 有具体的问题
- 解决这个问题的具体流程
- 解决问题后的可量化指标

## 2. 二进制

### 2.1 正整数十进制转二进制

```js
/**
 * 十进制转二进制规则:
 * 十进制的数字一直除以2，得到商和余数
 * 在用商继续除以2，得到商和余数
 * 周而复始....
 * 等到 商 < 1时，停止
 * 然后将每次的余数从后向前拼接就得到了二进制
 */
/**
 * 十进制转二进制: 2
 * 1. 2 / 2 = 1 --- 0
 * 2. 1 / 2 = 0 --- 1
 * 十进制的2 -> 二进制的 10
 *
 * 十进制转二进制: 10
 * 1. 10 / 2 = 5 --- 0
 * 2. 5 / 2 = 2 --- 1
 * 3. 2 / 2 = 1 --- 0
 * 4. 1 / 2 = 0 --- 1
 * 十进制的10 -> 二进制的 1010
 *
 * 十进制转二进制: 25
 * 1. 25 / 2 = 12 --- 1
 * 2. 12 / 2 = 6 --- 0
 * 3. 6 / 2 = 3 --- 0
 * 4. 3 / 2 = 1 --- 1
 * 5. 1 / 2 = 0 --- 1
 * 十进制的25 -> 二进制的11001
 *
 */
const ten2two = (num) => {
  if (num === 0 || num === 1) return num;
  return helpers(num);
};
function helpers(num, str = "") {
  if (num < 1) return str;
  const m = num % 2;
  str = "" + m + str;
  return helpers(Math.floor(num / 2), str);
}
const res1 = ten2two(19999);
console.log(res1);
```

### 2.2 正整数二进制转十进制

```js
/**
 * 二进制转十进制规则:
 * 从右向左，按照 2^0 + 2^1 + 2^2 + ... + 2^n
 * 得到十进制
 */
/**
 * 二进制转十进制: 10(二进制)
 * 0 * 2^1 + 1 * 2^1
 * 0 + 2
 * 2
 * 二进制的10 -> 十进制的2
 *
 * 二进制转十进制: 1010(二进制)
 * 0 * 2^0 + 1 * 2^1 + 0 * 2^2 + 1 * 2^3
 * 0 + 2 + 0 + 8
 * 10
 * 二进制的1010 -> 十进制的10
 *
 * 二进制转十进制: 11001(二进制)
 * 1 * 2^0 + 0 * 2^1 + 0 * 2^2 + 1 * 2^3 + 1 * 2^4
 * 1 + 0 + 0 + 8 + 16
 * 25
 * 二进制的11001 -> 十进制的25
 */
const ten2two = (num) => {
  num = "" + num;
  let result = 0;
  let currentIndex = 0;
  for (let i = num.length - 1; i >= 0; i--) {
    const s = num[currentIndex++];
    result += s * 2 ** i;
  }
  return result;
};
const res1 = ten2two(11001);
console.log(res1);
```

## 3. 位运算

> 1. JavaScript 将数字存储为 64 位浮点数，但所有按位运算都以 32 位二进制数执行
> 2. 在执行位运算之前，JavaScript 将数字转换为 32 位有符号整数
> 3. 执行按位操作后，结果将转换回 64 位 JavaScript 数

| 运算符 | 名称       | 描述                                                   |
| ------ | ---------- | ------------------------------------------------------ |
| &      | 与         | 两个都是 1,就为 1                                      |
| \|     | 或         | 有一个为 1,就为 1                                      |
| ^      | 异或       | 只有一个是 1,就为 1                                    |
| ~      | 非         | 1 变成 0,0 变成 1,取反的意思                           |
| <<     | 左移       | 通过从右推入零向左位移，并使最左边的位脱落             |
| >>     | 有符号右移 | 通过从左推入最左位的拷贝来向右位移，并使最右边的位脱落 |
| >>>    | 无符号右移 | 通过从左推入零来向右位移，并使最右边的位脱落           |

### 3.1 与案例

```js
00000000000000000000000000011001 25的二进制
00000000000000000000000000011000 24的二进制
00000000000000000000000000011000 与的结果二进制

00000000000000000000000000011001 25的二进制
00000000000000000000000000010111 23的二进制
00000000000000000000000000010001 与的结果二进制

00000000000000000000000000011110 30的二进制
00000000000000000000000000000101 5的二进制
00000000000000000000000000000100 与的结果二进制

# 结论: 两个都是1,就为1
# 技巧: 判断一个数的奇偶?
# num & 1 ? '奇数' : '偶数'
```

### 3.2 或案例

```js
00000000000000000000000000011001 25的二进制
00000000000000000000000000011000 24的二进制
00000000000000000000000000011001 或的结果二进制

00000000000000000000000000011001 25的二进制
00000000000000000000000000010111 23的二进制
00000000000000000000000000011111 或的结果二进制

00000000000000000000000000011110 30的二进制
00000000000000000000000000000101 5的二进制
00000000000000000000000000011111 或的结果二进制

# 结论: 有一个为1,就为1
```

### 3.3 异或案例

```js
00000000000000000000000000011001 25的二进制
00000000000000000000000000011000 24的二进制
00000000000000000000000000000001 异或的结果二进制

00000000000000000000000000011001 25的二进制
00000000000000000000000000010111 23的二进制
00000000000000000000000000001110 异或的结果二进制

00000000000000000000000000011110 30的二进制
00000000000000000000000000000101 5的二进制
00000000000000000000000000011011 异或的结果二进制

# 结论: 只有一个是1,就为1
# 技巧: 异或运算等于2个数 无进位相加
```

### 3.4 非案例

```js
00000000000000000000000000011001 25的二进制
11111111111111111111111111100110 25非的结果(javascript会再次进行转换成64位)
# 结论: 1变成0,0变成1,取反的意思
# 技巧: 求一个数的相反数？
# ~num + 1
# ~10 + 1 = -10
```

### 3.5 左移案例

```js
00000000000000000000000000000001 1的二进制
00000000000000000000000000000010 1 << 1的二进制结果

00000000000000000000000000011001 25的二进制
00000000000000000000000000110010 25 << 1的二进制结果

# 结论: 通过从右推入零向左位移，并使最左边的位脱落
# 技巧: 求一个数的2倍？
# num << 1
# 10 << 1 = 20
```

### 3.6 有符号右移案例

```js
00000000000000000000000000000001 1的二进制
00000000000000000000000000000000 1 >> 1的二进制结果

00000000000000000000000000011001 25的二进制
00000000000000000000000000001100

# 结论: 通过从左推入最左位的拷贝来向右位移，并使最右边的位脱落
# 技巧: 给你一个数组，求这个数组中间项的索引
# const arr = [1,2,3,4,5]
# arr.length >> 1 = 2
```

### 3.7 无符号右移案例

```js
00000000000000000000000000000001 1的二进制
00000000000000000000000000000000 1 >>> 1的二进制结果

# 结论: 通过从左推入零来向右位移，并使最右边的位脱落
# 和有符号右移的区别就是符号位（第一位）是否参与运算
```

## 4. 前缀和的应用

### 4.1 题目

```js
# 给定一个数组，例如[1,2,3,4,5],给定一个范围[left,right],求出left到right的累加和,如果访问的频率很高，请问如何优化？
```

### 4.2 矩阵统计和

```js
解题思路：
	1. 可以创建一个矩阵，图如下
    2. x轴表示0~数组的length - 1的索引
    3. y轴表示0~数组的length - 1的索引
    4. 用(x,y)去统计每一个格子的和
    5. 这样当外界传进来[left,right]范围时，只需要去这个矩阵中取对应的数字就行
```

![](/assets/algorithm/rect-total-sum.png)

```js
# coding
const arr = [1, 2, 3]
function rectStatSum (arr, [left, right]) {
  const rect = []
  for (let i = 0; i < arr.length; i++) {
    const item = []
    let sum = 0
    for (let j = 0; j < arr.length; j++) {
      sum += arr[j]
      const value = i <= j ? sum : 'illegal'
      item.push(value)
    }
    rect.push(item)
  }
  return rect[left][right]
}
const result = rectStatSum(arr, [0, 2])
```

### 4.3 前缀和统计

```js
解题思路:
	1. 创建一个新数组，图如下
    2. 新数组的每一项为原数组的累加和
    3. 通过 新数组[right] - 新数组[left -1]就得到了left ~ right区间的和
```

![](/assets/algorithm/prefix-stat-sum.png)

```js
# coding
const arr = [1, 2, 3, 4]
function rectStatSum (arr, [left, right]) {
  let sum = arr[0]
  let result = [sum]
  for (let i = 1; i < arr.length; i++) {
    sum += arr[i]
    result.push(sum)
  }
  return left === 0 ? result[right] : result[right] - result[left - 1]
}
const result = rectStatSum(arr, [0, 3])
```

## 5. 随机行为

### 5.1 认识 Math.random

```js
Math.random() 函数返回一个浮点数,  伪随机数在范围从0到小于1，也就是说，从0（包括0）往上，但是不包括1（排除1），然后您可以缩放到所需的范围。实现将初始种子选择到随机数生成算法;它不能被用户选择或重置,左闭右开
```

### 5.2 Math.random 特点

```js
# 返回的数字是等概率的

# coding-1
function fn () {
  const testCount = 10000
  let count = 0
  for (let i = 0; i < testCount; i++) {
    const randomNum = Math.random()
    if (randomNum < 0.5) count++
  }
  console.log(count / testCount) // 百分比永远在50%左右
}
fn()

# coding-2
// 返回[0,5)的随机等概率整数
function fn1 () {
  const testCount = 1000000
  let arr = new Array(5).fill(0)
  for (let i = 0; i < testCount; i++) {
    const randomIndex = Math.floor(Math.random() * 5)
    arr[randomIndex]++
  }
  for (let i = 0; i < arr.length; i++) {
    // 0~4的数字的百分比永远在20%左右
    console.log(`数字${i}出现了${arr[i]}次,数字${i}的概率为:${arr[i] / testCount * 100}%`)
  }
}
fn1()
```

### 5.3 题目一

```js
# 给你一个函数fn,这个fn函数返回的是1-5的随机数，并且是等概率的，现在要求你在不修改fn函数的情况下，返回1-7的随机数,并且是等概率的(只能使用fn函数返回随机数)
```

```js
解题思路:
	1. 将 1-5 随机等概率整数的fn 改造成 0-1 的 随机等概率整数的fn2
    2. fn2函数流程:调用fn，返回的如果是1和2 用0表示,4和5用1表示,遇到3重新执行fn，直到不是3为止，归类到0或1
	3. 题目是返回 1-7 等概率的,那最高位为7，我们可以用`3个二进制位表示`,那范围就变成了`000 ~ 111`,转换成10进制就变成了0~7，并且是等概率的
	4. 我们继续创建一个函数fn3
    5. fn3函数流程:调用3次fn2(因为我们要用3个二进制位),返回的`0~1`依次进行左移，那最后的结果就是`000~111的二进制范围`,对应的就是`0~7`的十进制范围
    6. 创建g函数，返回的如果是0就进行重做，那结果就是`1~7`的范围了，并且是等概率的
```

```js
# coding
// 返回的是1-5的等概率的正整数
function fn () {
  return Math.floor(Math.random() * 5) + 1
}

// 0-1的等概率器
function fn2 () {
  let res = 0
  do {
    res = fn()
  } while (res === 3) // 遇到3就重做，那结果为1~2或3~4的概率都是50%
  return res <= 2 ? 0 : 1
}

// 返回000~111的二进制范围，对应的就是0~7的十进制范围
function fn3 () {
  return (fn2() << 2) + (fn2() << 1) + (fn2() << 0)
}

// 1-7的等概率
function g () {
  let res = 0
  do {
    res = fn3()
  } while (res === 0) // 遇到0就重做
  return res
}

// 测试
let count = 0
let arr = new Array(8).fill(0)
for (let i = 0; i < 100000; i++) {
  arr[g()]++
}
for (let i = 0; i < arr.length; i++) {
  console.log(`${i}概率:${arr[i] / 100000 * 100}%`)
}
```

### 5.4 题目二

```js
# 给你一个函数fn,这个fn函数返回的是27-36的随机数,并且是等概率的,现在要求你在不修改fn函数的情况下,返回54-100的随机数,并且是等概率的(只能使用fn函数返回随机数)
```

```js
解题思路:
	1. 将 27-36 随机等概率整数的fn 改造成 0-1 的 随机等概率整数的fn2
    2. fn2函数流程:调用fn，返回的如果是(27/28/29/30/31) 用0表示,(32/33/34/35/36)用1表示
	3. 题目是返回 54-100 等概率的,那最高位为100，我们可以用`7个二进制位表示`,那范围就变成了`0000000 ~ 1111111`,转换成10进制就变成了0~127，并且是等概率的
	4. 我们继续创建一个函数fn3
    5. fn3函数流程:调用`7次fn2(因为我们要用7个二进制位)`,返回的`0~1`依次进行左移，那最后的结果就是`0000000 ~ 1111111的二进制范围`,对应的就是`0~127`的十进制范围
    6. 创建g函数，返回的如果`小于54或者大于100`就进行重做，那结果就是`54~100`的范围了，并且是等概率的
```

```js
# coding
function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
// 返回的是27-36的随机数,并且是等概率的
function fn () {
  return random(27, 36)
}

// 0~1的等概率器
function fn2 () {
  let res = 0
  const t1 = ((36 - 27 + 1) & 1) === 1 // 奇数才会遇到一个数重做,偶数不需要重做
  const t2 = (36 + 27) >> 1 // 遇到这个数就进行重做
  do {
    res = fn()
  } while (t1 && res === t2 /* 必须是奇数,并且是t2才会进行重做 */)
  // 如果是奇数,那就是res <= t2 - 1,偶数就是 res <= t2
  return (res <= (t1 ? t2 - 1 : t2)) ? 0 : 1
}

// 返回的二进制范围为0000000~1111111,转换成十进制范围是0~127是等概率的
function fn3 () {
  // 计算出最少需要几个二进制位表示100
  const n = computedB(100)
  let result = 0
  for (let i = n; i > 0; i--) {
    result += (fn2() << i - 1)
  }

  function computedB (num) {
    if (num < 2) return 1
    let currentNum = 1
    let count = 1
    while (currentNum <= num) {
      currentNum += 2 << (count - 1)
      count++
    }
    return count
  }
  return result
}

function g () {
  let res = 0
  do {
    res = fn3()
  } while (res < 54 || res > 100)
  return res
}

# 测试
let arr = new Array(100 - 54 + 1).fill(0)
for (let i = 0; i < 100000; i++) {
  const index = g()
  arr[index - 54]++
}
for (let i = 0; i < arr.length; i++) {
  console.log(`${i + 54}概率:${arr[i] / 100000 * 100}%`)
}
```

### 5.6 题目三

```js
# 给你一个函数fn,这个fn函数返回的是0-1的随机数,但是不是等概率的，现在要求你在不修改fn函数的情况下，返回0-1的等概率的随机数(只能使用fn函数返回随机数)
```

```js
解题思路:
	1. 将 0-1 随机不等概率整数的fn 改造成 0-1 的 随机等概率整数的g
    2. g函数流程:调用`2次`fn，返回的如果是0 用0表示,1用1表示
    3. 如果2次返回的是(0,0)或者返回的是(1,1)我们就进行重做,直到返回的是(0,1)或者(1,0)
	4. 将(0,1)归类到0,(1,0)归类到1，那么他们就是等概率的`0~1`
```

```js
# coding
// fn函数返回的是0-1的随机数,但是不是等概率的
function fn () {
  return Math.random() < 0.85 ? 0 : 1
}

function g () {
  let res1 = 0
  let res2 = 0
  do {
    res1 = fn()
    res2 = fn()
  } while (res1 === res2 /* 如果2次返回的是(0,0)或者返回的是(1,1)我们就进行重做 */)

  return (res1 << 1) + (res2 << 0) - 1
}

# 测试
let count = 0
let arr = new Array(2).fill(0)
for (let i = 0; i < 100000; i++) {
  arr[g()]++
}
for (let i = 0; i < arr.length; i++) {
  console.log(`${i}概率:${arr[i] / 100000 * 100}%`)
}
```

## 6. 二分法

### 6.1 题目一

```js
# 给定一个有序数组,请求该数组中找到num
```

```js
解题思路
	1. 因为给的是有序数组，所以我们可以利用二分查找的思想来完成这题
    2. 定义`left/right变量`来定义一个区间，取`left/right的中间值`
    3. 如果`中间值比要找的num大,就变动right变量到中间值位置`,反之`变动left变量到中间值位置`
    4. 图如下
```

![](/assets/algorithm/binary-search.png)

```js
# coding
const arr = [1, 2, 3, 4, 5]
function binarySearch (arr, num) {
  if (!arr || arr.length === 0) return -1
  let left = 0
  let right = arr.length - 1
  while (left <= right) {
    const mid = (left + right) >> 1
    const r = arr[mid]
    if (r === num) return mid
    else if (r < num) left = mid + 1
    else right = mid - 1
  }
  return -1
}
console.log(binarySearch(arr, 6))
```

### 6.2 题目二

```js
# 给定一个有序数组,在有序数组中找到 >= num 最左的位置
```

```js
解题思路:
	1. 利用二分法找到这个数字下标
    2. 让数字下标一直向左移动，直到找到 >= num 最左的位置停止
    3. 图如下
```

![](/assets/algorithm/binary-search-left.png)

```js
# coding
const arr = [1, 2, 2, 2, 3, 4, 5, 5, 5, 5, 6, 7, 7, 7, 8, 8, 8]
function binarySearchLeft (arr, num) {
  if (!arr || arr.length === 0) return -1
  let left = 0
  let right = arr.length - 1
  let res = -1
  while (left <= right) {
    const mid = (left + right) >> 1
    const r = arr[mid]
    if (r === num) {
      res = mid
      break
    }
    else if (r < num) left = mid + 1
    else right = mid - 1
  }
  if (res !== -1) {
    while (res > 0) {
      const r = arr[res]
      if (arr[res - 1] >= r) {
        res--
      } else {
        return res
      }
    }
  }
  return res
}
console.log(binarySearchLeft(arr, 2))
```

### 6.3 题目三

```js
# 给定一个有序数组,在有序数组中找到 <= num 最右的位置
```

## 7. 链表

### 7.1 题目一

```js
# 实现单链表的反转
```

```js
解题思路:
	1. 记录前一个节点值
    2. 保存当前节点的下一个节点
  	3. 让当前节点的下一个节点指向记录的前一个节点值
    4. 依次进行遍历，最后返回的是`记录前一个节点值的变量`
```

```js
# coding
// 反转单链表
class Node {
  constructor(val, next) {
    this.val = val
    this.next = next ? next : null
  }
}

const node = new Node(1)
node.next = new Node(2)
node.next.next = new Node(3)

function reverse (head) {
  if (!head || !head.next) return head
  let pre = null // 记录前一个节点值的变量
  while (head !== null) {
    const n = head.next
    head.next = pre
    pre = head
    head = n
  }
  return pre
}

console.log(reverse(node))
```

### 7.2 题目二

```js
# 实现双链表的反转
```

```js
解题思路:
	1. 记录前一个节点值
    2. 保存当前节点的下一个节点
  	3. 让当前节点的下一个节点指向记录的前一个节点值,当前节点的上一个节点指向`保存当前节点的下一个节点`
    4. 依次进行遍历，最后返回的是`记录前一个节点值的变量`
```

```js
# coding
// 反转双链表
class Node {
  constructor(val, next, last) {
    this.val = val
    this.next = next ? next : null
    this.last = last ? last : null
  }
}

const node = new Node(1)
node.next = new Node(2, undefined, node)
node.next.next = new Node(3, undefined, node.next)

function reverse (head) {
  if (!head || !head.next) return head
  let pre = null
  while (head !== null) {
    const n = head.next
    head.next = pre
    head.last = n
    pre = head
    head = n
  }
  return pre
}

console.log(reverse(node))
```

### 7.3 题目三

```js
# 单链表实现栈(后进先出),时间是O1
```

```js
要实现的方法:
	1. push(进栈)
	2. pop(出栈)
	3. peek(取栈顶值,但是不出栈)
	4. empty(判断是否为空)
	5. size(返回栈的大小)
实现思路:
	1. 组装链表结构，指针始终指向链表头部
    2. 调用push,链表新增一个元素，指针移动到新增元素上,新增元素变成链表的头,更新size
	3. 调用pop,链表删除一个元素,指针移动到前一个元素上,前一个元素变成链表的头,更新size
	4. 调用peek,返回链表的头，不移动指针
	5. 调用empty,看size是否为0,返回布尔值
	6. 调用size,返回size
```

```js
# coding
// 单链表实现栈
class Node {
  constructor(val, next) {
    this.val = val
    this.next = next ? next : null
  }
}
class Stack {
  constructor() {
    this.head = null
    this.last = null
    this.s = 0
  }
  push (val) {
    const node = new Node(val)
    this.last = node
    if (!this.head) {
      this.head = node
    } else {
      const n = this.head
      this.head = node
      node.next = n
    }
    this.s++
    return this.last
  }
  pop () {
    if (!this.head) return
    const n = this.head
    this.head = this.head.next
    this.last = this.head
    this.s--
    return n
  }
  peek () {
    return this.last
  }
  empty () {
    return this.s === 0
  }
  size () {
    return this.s
  }
}
```

### 7.4 题目四

```js
# 单链表实现队列(先进先出),时间是O1
```

```js
要实现的方法:
	1. offer(入队)
	2. poll(出队)
	3. peek(取对头的值,不出队)
	4. empty(判断是否为空)
	5. size(返回队列的大小)
实现思路:
	1. 组装链表结构，指针始终指向链表头部
    2. 调用push,链表新增一个元素，指针移动到新增元素上,新增元素变成链表的头,更新size
	3. 调用pop,链表删除一个元素,指针移动到前一个元素上,前一个元素变成链表的头,更新size
	4. 调用empty,看size是否为0,返回布尔值
	5. 调用size,返回size
```

```js
# coding
// 单链表实现队列
class Node {
  constructor(val, next) {
    this.val = val
    this.next = next ? next : null
  }
}

class Queue {
  constructor() {
    this.head = null
    this.last = null
    this.s = 0
  }
  offer (val) {
    const node = new Node(val)
    if (!this.last) {
      this.head = node
      this.last = this.head
    } else {
      this.last.next = node
      this.last = this.last.next
    }
    this.s++
    return this.head
  }
  poll () {
    if (!this.head) return
    const n = this.head
    this.head = this.head.next
    if (!this.head) {
      this.head = null
      this.last = null
    }
    this.s--
    return n
  }
  peek () {
    return this.head
  }
  empty () {
    return this.s === 0
  }
  size () {
    return this.s
  }
}
```

### 7.5 题目五

```js
# 双链表实现双端队列
```

### 7.6 题目六

```js
# k个一组反转链表 https://leetcode-cn.com/problems/reverse-nodes-in-k-group/
```

![](/assets/algorithm/k-linkedlist-reverse-1.png)

![](/assets/algorithm/k-linkedlist-reverse-2.png)

```js
解题思路:
	1. 创建函数,这个函数作用是:从start开始，数k次，返回end，不够k次的返回null
    2. 创建函数,这个函数作用是:从start开始, 到end结束，进行反转，并且让start.next -> end.next
	3. 遍历start.next，继续数k次,返回end,不够k次的返回null
	4. 继续反转，并且让start.next -> end.next
	5. 结束
    6. 图如下
```

![](/assets/algorithm/k-linkedlist-reverse-anw.png)

```js
# coding
// k个一组反转链表
function reverseKGroup (head, k) {
  if (!head || !head.next) return head
  let start = head
  let end = getKGroup(start, k)
  if (end === null) {
    // 不够k个
    return head
  }

  reverse(start, end)
  head = end

  let lastEnd = start
  while (lastEnd.next !== null) {
    let start = lastEnd.next
    let end = getKGroup(start, k)
    if (end === null) {
      // 不够k个
      return head
    }
    reverse(start, end)
    lastEnd.next = end
    lastEnd = start
  }

  // 数够k个节点
  function getKGroup (start, k) {
    while (--k > 0 && start !== null) {
      start = start.next
    }
    return start
  }

  // 1->2->3->4 k=3
  // 3->2->1->4
  function reverse (start, end) {
    end = end.next
    let curr = start
    let pre = null
    while (curr !== end) {
      const n = curr.next
      curr.next = pre
      pre = curr
      curr = n
    }
    start.next = end
  }

  return head
}
```

### 7.7 题目七

```js
# 两数相加 https://leetcode-cn.com/problems/add-two-numbers/
```

![](/assets/algorithm/two-num-add.png)

```js
解题思路:
	1. 定义一个sum变量，用来统计当前2个链表的单节点和
    2. 定义一个carry变量，用来标记是否进位
    3. 注意点:如果2根链表都遍历完了，还有进位信息,需要新增一个节点
```

```js
# coding
// 两数相加
function addTwoNumbers (l1, l2) {
  let head = new ListNode(0)
  let sum = 0
  let carry = 0
  let curr = head
  while (l1 !== null || l2 !== null) {
    if (l1 !== null) {
      sum += l1.val
      l1 = l1.next
    }
    if (l2 !== null) {
      sum += l2.val
      l2 = l2.next
    }
    carry = sum >= 10 ? 1 : 0
    curr.next = new ListNode(sum % 10)
    curr = curr.next
    sum = carry ? 1 : 0
  }
  if (carry !== 0) {
    curr.next = new ListNode(1)
  }
  return head.next
}
```

### 7.8 题目八

```js
# 合并两个有序链表 https://leetcode-cn.com/problems/merge-two-sorted-lists/
```

![](/assets/algorithm/merge-two-linkedlist.png)

```js
解题思路:
	1. 同时遍历2个链表
    2. 看`l1的当前节点值是否大于l2的节点值,取最小值作为新链表的当前节点值`
  	3. 如果最后两个链表有一方结束了,那么直接拼接剩下的值
```

```js
# coding
// 合并两个有序链表
function mergeTwoLists (l1, l2) {
  if (!l1 || !l2) {
    return !l1 ? l2 : l1
  }
  let head = new ListNode()
  let curr = head
  while (l1 !== null && l2 !== null) {
    const v1 = l1.val
    const v2 = l2.val
    if (v1 < v2) {
      // 移动l1指针
      curr.next = new ListNode(v1)
      l1 = l1.next
    } else {
      // 移动l2指针
      curr.next = new ListNode(v2)
      l2 = l2.next
    }
    curr = curr.next
  }
  if (l1 !== null) {
    curr.next = l1
  }
  if (l2 !== null) {
    curr.next = l2
  }
  return head.next
}
```

## 8. 位图

```js
位图法就是bitmap的缩写，所谓bitmap，就是用每一位来存放某种状态，适用于大规模数据，但数据状态又不是很多的情况。通常是用来判断某个数据存不存在的
`举例:给40亿个不重复的unsigned int的整数，没排过序的，然后再给一个数，如何快速判断这个数是否在那40亿个数当中`
```

### 8.1 题目一

```js
# 用位图表示0~100
```

```js
要实现的功能:
	1. 用位图表示0~100
	2. 可以在范围内添加一个数
    3. 可以在范围内删除一个数
    4. 可以在范围内判断一个数是否存在于数据中
```

```js
实现思路:
	1. 用位图表示0~100
		JavaScript 中的数字，不管是整数、小数、分数，还是正数、负数，全部是浮点数，都是用 8 个字节（64 位）来存储的
        所以我们 `(max + 64) >> 6`就可知道要创建多长的一个数组就可以表示`0~100`
    2. 可以在范围内添加一个数
    	1. 需要先找到这个数是在数组中第几个位置中被存储
        2. 在从这个被存储的位置中找到对应的bit
        3. 在将对应的这个bit改为1
   	3. 可以在范围内删除一个数
    	1. 需要先找到这个数是在数组中第几个位置中被存储
        2. 在从这个被存储的位置中找到对应的bit
        3. 在将对应的这个bit改为0
```

```js
# coding
// JavaScript 中的数字，不管是整数、小数、分数，还是正数、负数，全部是浮点数，都是用 8 个字节（64 位）来存储的
class BitMap {
  constructor(max = 1000) {
    this.initBits(max)
  }
  initBits (max) {
    // JavaScript 中的数字，不管是整数、小数、分数，还是正数、负数，全部是浮点数，都是用 8 个字节（64 位）来存储的
    const len = (max + 64) >> 6
    this.bits = new Array(len).fill(0)
  }
  add (num) {
    /**
     * 1. 需要先找到这个数是在数组中第几个位置中被存储
     * 2. 在从这个被存储的位置中找到对应的bit
     * 3. 在将对应的这个bit改为1
     * 4. 64位bit，每一个bit代表一个数
     */
    const index = num >> 6
    /**
     * num & 63 === num % 64
     * 假设num = 2
     * 1 << (2 & 63) === 1 << 2 === 0000000000000000000000000000000000000000000000000000000000000100
     */
    const bit = 1 << (num & 63)
    /**
     * 假设num = 2,我们要将2塞入bits中
     * 二进制:0000000000000000000000000000000000000000000000000000000000000000(bits中的每一个数)
     * 二进制:0000000000000000000000000000000000000000000000000000000000000100
     * |运算 :0000000000000000000000000000000000000000000000000000000000000100
     * this.bits[0] = 0000000000000000000000000000000000000000000000000000000000000100
     */
    this.bits[index] |= bit
  }
  delete (num) {
    /**
     * 1. 需要先找到这个数是在数组中第几个位置中被存储
     * 2. 在从这个被存储的位置中找到对应的bit
     * 3. 在将对应的这个bit改为0
     */
    const index = num >> 6
    const bit = 1 << (num & 63)
    /**
     * 假设num = 2,我们要将2从bits中删除
     * 二进制:0000000000000000000000000000000000000000000000000000000000000100
     * ~运算 :1111111111111111111111111111111111111111111111111111111111111011
     * &运算 :0000000000000000000000000000000000000000000000000000000000000000
     */
    const reverseBit = ~bit
    this.bits[index] &= reverseBit
  }
  contains (num) {
    /**
     * 1. 需要先找到这个数是在数组中第几个位置中被存储
     * 2. 在从这个被存储的位置中找到对应的bit
     * 3. 在将对应的这个bit和1左移到对应位置进行&运算
     * 4. 运算结果不等于0就表示这个num存在,反之不存在
     */
    const index = num >> 6
    const bit = 1 << (num & 63)
    return (this.bits[index] & bit) !== 0
  }
}

const bitMap = new BitMap(1000)
bitMap.add(53)
console.log(bitMap.contains(53))
bitMap.delete(53)
console.log(bitMap.contains(53))
```

## 9. 位运算实现加减乘除

```js
实现加法思路:
	1. a ^ b = 无进位相加
	2. (a & b) << 1 = 进位信息通过 a&b 得到,左移一位是因为加法本身进位后算下一位时要加上进制位
	3. 图解
    4. 结论: 加法 = 无进位相加(a^b) + 进位信息((a&b)<<1)
```

![](/assets/algorithm/add.png)

```js
# coding
function add (a, b) {
  if (a === 0 || b === 0) return a === 0 ? b : a
  let sum = 0
  while (b !== 0) {
    let a1 = a ^ b
    let b1 = (a & b) << 1
    a = a1
    b = b1
    sum = a
  }
  return sum
}
console.log(add(64, 36))
```

```js\
实现减法思路:
	1. 因为我们实现了加法，所以我们可以利用加法
	2. a - b = a + (-b)
	3. a + (-b) = add(a,b的相反数)
	4. add(a,b的相反数) = add(a,~b + 1) 	细节:一个数的相反数 = ~num + 1
	5. add(a,~b + 1) = add(a,add(~b,1))
```

```js
# coding
function add (a, b) {
  if (a === 0 || b === 0) return a === 0 ? b : a
  let sum = 0
  while (b !== 0) {
    let a1 = a ^ b
    let b1 = (a & b) << 1
    a = a1
    b = b1
    sum = a
  }
  return sum
}
function sub (a, b) {
  return add(a, add(~b, 1))
}
console.log(sub(100, 3))
```

## 10. 实现小根堆、大根堆

### 10.1 题目一

```js
# 合并k个升序链表 https://leetcode-cn.com/problems/merge-k-sorted-lists/
```

## 11. 二叉树

### 11.1 二叉树的概念

#### 11.1.1 基本术语

- 节点 : 根节点、父节点、子节点、兄弟节点
- 子树 : 左子树、右子树
- 叶子节点 : 没有子节点的节点
- 节点的深度 : 从根节点到当前节点所经过的节点总数
- 节点的高度 : 从当前节点到最远的叶子节点所经过的节点总数

#### 11.1.2 平衡二叉树

- 一个二叉树每个节点的左右两个子树的高度差的绝对值不超过 1

#### 11.1.3 搜索二叉树

- 根节点的左子树只包含**小于**当前节点的数
- 根节点的右子树只包含**大于**当前节点的数
- 所有左子树和右子树自身必须也是二叉搜索树

#### 11.1.4 完全二叉树

### 11.2 二叉树的遍历

- 如下，一颗二叉树

![](/assets/algorithm/binary-tree.png)

#### 11.2.1 前序遍历

```js
# coding
// -------------------二叉树
class Node {
  constructor(val, left, right) {
    this.val = val
    this.left = left === undefined ? null : left
    this.right = right === undefined ? null : right
  }
}

const node = new Node(1)
node.left = new Node(2)
node.right = new Node(3)
node.left.left = new Node(4)
node.left.right = new Node(5)
node.right.left = new Node(6)
node.right.right = new Node(7)
// --------------------

// 前序遍历(根 -> 左 -> 右)
function perorderTraversal (root) {
  if (!root) return null
  console.log(root.val)
  perorderTraversal(root.left)
  perorderTraversal(root.right)
}
perorderTraversal(node)
```

#### 11.2.2 中序遍历

```js
# coding
// -------------------二叉树
class Node {
  constructor(val, left, right) {
    this.val = val
    this.left = left === undefined ? null : left
    this.right = right === undefined ? null : right
  }
}

const node = new Node(1)
node.left = new Node(2)
node.right = new Node(3)
node.left.left = new Node(4)
node.left.right = new Node(5)
node.right.left = new Node(6)
node.right.right = new Node(7)
// --------------------

// 中序遍历(左 -> 根 -> 右)
function inorderTraversal (root) {
  if (!root) return null
  inorderTraversal(root.left)
  console.log(root.val)
  inorderTraversal(root.right)
}
inorderTraversal(node)
```

#### 11.2.3 后序遍历

```js
# coding
// -------------------二叉树
class Node {
  constructor(val, left, right) {
    this.val = val
    this.left = left === undefined ? null : left
    this.right = right === undefined ? null : right
  }
}

const node = new Node(1)
node.left = new Node(2)
node.right = new Node(3)
node.left.left = new Node(4)
node.left.right = new Node(5)
node.right.left = new Node(6)
node.right.right = new Node(7)
// --------------------

// 后序遍历(左 -> 右 -> 根)
function postorderTraversal (root) {
  if (!root) return null
  postorderTraversal(root.left)
  postorderTraversal(root.right)
  console.log(root.val)
}
postorderTraversal(node)
```

#### 11.2.4 层序遍历

```js
# coding
// -------------------二叉树
class Node {
  constructor(val, left, right) {
    this.val = val
    this.left = left === undefined ? null : left
    this.right = right === undefined ? null : right
  }
}

const node = new Node(1)
node.left = new Node(2)
node.right = new Node(3)
node.left.left = new Node(4)
node.left.right = new Node(5)
node.right.left = new Node(6)
node.right.right = new Node(7)
// --------------------

// 一层一层遍历
function levelorderTraversal (root) {
  if (!root) return null
  const queue = [root]
  while (queue.length > 0) {
    const l = queue.length
    for (let i = 0; i < l; i++) {
      const n = queue.pop()
      console.log(n.val)
      if (n.left) queue.unshift(n.left)
      if (n.right) queue.unshift(n.right)
    }
  }
}
levelorderTraversal(node)
```

### 11.2 递归序规律分析

```js
# coding
class Node {
  constructor(val, left, right) {
    this.val = val
    this.left = left === undefined ? null : left
    this.right = right === undefined ? null : right
  }
}

const node = new Node(1)
node.left = new Node(2)
node.right = new Node(3)
node.left.left = new Node(4)
node.left.right = new Node(5)
node.right.left = new Node(6)
node.right.right = new Node(7)

/**
 *
 * 递归能做什么?
 * 下面代码的打印?
 */
function recursive (root) {
  if (!root) return null
  console.log(root.val) // 假设这里我们做一些事情,事情A
  recursive(root.left)
  console.log(root.val) // 假设这里我们做一些事情,事情B
  recursive(root.right)
  console.log(root.val) // 假设这里我们把事情A和事情B做一些统计,事情C
}

recursive(node)
```

- 递归能做什么

  ```js
  ```

- 代码的打印

  ```js
  ```

- 规律分析

  ```js
  ```

### 11.3 题目一

```js
# 相同的树 https://leetcode-cn.com/problems/same-tree/
```

![](/assets/algorithm/same-tree-1.png)

![](/assets/algorithm/same-tree-2.png)

```js
解题思路:

```

### 11.4 题目二

```js
# 对称二叉树 https://leetcode-cn.com/problems/symmetric-tree/
```

![](/assets/algorithm/symmetric.png)

```js
解题思路:
```

### 11.5 题目三

```js
# 二叉树的最大深度 https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/
```

![](/assets/algorithm/max-depth-tree.png)

```js
解题思路:
```

### 11.6 题目四

```js
# 二叉树的层序遍历
https://leetcode-cn.com/problems/binary-tree-level-order-traversal/
https://leetcode-cn.com/problems/binary-tree-level-order-traversal-ii/
```

![](/assets/algorithm/level-order-1.png)

![](/assets/algorithm/level-order-2.png)

```js
解题思路1:


解题思路2:

```

### 11.7 题目五

```js
# 从前序与中序遍历序列构造二叉树 https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
```

![](/assets/algorithm/binary-tree-perorder-and-traversal.png)

```js
解题思路:

```

### 11.8 题目六

```js
# 从中序与后序遍历序列构造二叉树 https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/
```

![](/assets/algorithm/binary-tree-inorder-and-traversal.png)

```js
解题思路:

```

### 11.9 题目七

```js
# 平衡二叉树 https://leetcode-cn.com/problems/balanced-binary-tree/
```

![](/assets/algorithm/balanced-binary-tree-1.png)

![](/assets/algorithm/balanced-binary-tree-2.png)

```js
解题思路:

```

### 11.10 题目八

```js
# 验证二叉搜索树 https://leetcode-cn.com/problems/validate-binary-search-tree/
```

![](/assets/algorithm/validate-binary-search-tree-1.png)

![](/assets/algorithm/validate-binary-serach-tree-2.png)

```js
解题思路:

```

### 11.11 题目九

```js
# 路径总和 https://leetcode-cn.com/problems/path-sum/
```

![](/assets/algorithm/path-sum-1.png)

![](/assets/algorithm/path-sum-2.png)

```js
解题思路:

```

### 11.12 题目十

```js
# 路径总和II https://leetcode-cn.com/problems/path-sum-ii/
```

![](/assets/algorithm/path-sum2-1.png)

![](/assets/algorithm/path-sum2-2.png)

```js
解题思路:

```
