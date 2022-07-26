# 算法学习

## 一. 异或运算

### 1. 规律提炼

> 无进位相加

1. 0 ^ N = N
2. N ^ N = 0
3. A ^ B = B ^ A
4. A ^ B ^ C  = C ^ A ^ B
5. A ^ B = F , A = F ^ B , B = F ^ A

### 2. 技巧

1. 交换两个变量的值

```javascript
let a = 3,b = 5;
a = a ^ b
b = a ^ b
a = a ^ b
console.log(a,b)
```

2. 提取一个数对应的二进制最右侧的1

```javascript
let a = 10 
let res = a & (~a + 1)
console.log(res) // 2

/**
 * 原因:  
 *  10 代表的二进制是 01010
 *  提取最右侧的1后就变成:00010
 *  00010 代表的十进制是 2
 * 
 * 过程:
 *  ~10 代表的二进制的是    10101
 *  ~10+1 代表的二进制的是  10110
 * 
 *  01010
 *    &
 *  10110
 *    =
 *  00010
 */
```

3. 将一个二进制中的0变成1

```javascript
let a = 10
let index = 4
let res = a | (1 << index)
console.log(res) // 26

/**
 * 10 代表的二进制是  01010
 * 1 代表的二进制是   00001
 * 1<<4后就变成      10000     
 * 
 * 01010
 *   |
 * 10000
 *   =
 * 11010(16 + 8 + 2 = 26)
 */
```

### 3. 一个数组中有一种数出现了奇数次，其他数都出现了偶数次，怎么找到并打印这种数

```typescript
function findOddNum(arr: number[]): number {
  let res = 0;
  for (let i = 0; i < arr.length; i++) {
    res ^= arr[i];
  }
  return res;
}

// 测试
function test() {
  // 另一种解法
  const findOddNum = (arr: number[]): number => {
    const map = new Map<number, number>();
    for (let i = 0; i < arr.length; i++) {
      const count = map.get(arr[i]);
      map.set(arr[i], !count ? 1 : count + 1);
    }
    let res = -1;
    map.forEach((value, key) => {
      if (value % 2 !== 0) {
        res = key;
      }
    });
    return res;
  };

  const getConfig = () => {
    return {
      range: [-100, 100],
      times: 10000,
    };
  };

  const random = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const createArray = (): number[] => {
    const { range } = getConfig();
    const [min, max] = range;
    const result: number[] = [];
    let flag = true;
    for (let i = 0; i < 100; i++) {
      const random1 = random(min, max);
      const random2 = random(1, 10);
      const random3 = random(1, 10);

      const randomNum = random1;
      const randomOddCount = random2 % 2 === 0 ? random2 + 1 : random2;
      const randomEvenCount = random3 % 2 === 0 ? random3 : random3 + 1;

      const forCount = flag ? randomOddCount : randomEvenCount;
      for (let j = 0; j < forCount; j++) {
        result.push(randomNum);
      }
      flag = false;
    }

    let res = [...result];
    for (let i = 0; i < res.length; i++) {
      const j = random(i, res.length - 1);
      const temp = res[i];
      res[i] = res[j];
      res[j] = temp;
    }

    return res;
  };

  const exec = (fn: (arr: number[]) => number) => {
    const { times } = getConfig();
    for (let i = 1; i <= times; i++) {
      const array = createArray();
      const res1 = fn(array);
      const res2 = findOddNum(array);
      if (res1 !== res2) {
        console.log("出错了", array);
        break;
      }
    }
  };

  return {
    exec,
  };
}

console.log("测试开始");
test().exec(findOddNum);
console.log("测试结束");
```

### 4. 一个数组中有两种数出现了奇数次，其他数都出现了偶数次，怎么找到并打印这两种数

解题思路:

1. 假定奇数1为a,奇数2为b
2. 利用异或运算的特性,循环遍历异或,结束后得到的是 两个奇数异或的结果c  a ^ b = c
3. 提取c最右侧的1(将a和b分成2类),因为 a !== b,假定 a=3(010),b=1(001),c=011,最右侧的1为001
4. 再次循环遍历,根据最右侧的1将所有数字进行分类,结束后a和最右侧有1的偶数在一边,b和最右侧没有1的偶数在另一边
5. 利用异或运算的特性,左边有偶数个数字 + 一个奇数a,因为偶数个数字异或运算结束后变成了0,0在和奇数a异或运算得到a
6. 此时我们得到了 两个奇数异或的结果c,其中一个奇数a,那另外一个奇数b = c ^ a

```typescript
function findTwoOddNum(arr: number[]): [number, number] {
  let res = 0; // c
  for (let i = 0; i < arr.length; i++) {
    res ^= arr[i];
  }
  let rightOne = res & (~res + 1); // 提取c最右侧的1
  let oddOne = 0;
  for (let i = 0; i < arr.length; i++) {
    if ((arr[i] & rightOne) !== 0) {
      // 最右侧有1的数字
      oddOne ^= arr[i];
    }
  }
  const oddTwo = res ^ oddOne; // 另外一个奇数b
  return [oddOne, oddTwo];
}
```

### 5. 一个数组中有一种数出现K次，其他数都出现了M次，M > 1,  K < M,找到出现了K次的数，要求，额外空间复杂度O(1)，时间复杂度O(N)

解题思路:

  1. 把每个数都看成二进制
  2. 准备一个32长度的数组,将每个二进制数字对应的位叠加到数组中,得到arr(里面每一位都是一个二进制数字位1的叠加)如[1,4,6,...],arr[0] = 有1个二进制位为1的数字,arr[1] = 有4个二进制位为1的数字,arr[2] = 有6个二进制位为1的数字
  3. 遍历arr,看当前 数字 % m === 0,如果等于0,说明当前这个索引上出现k次的数是0,否则为1
  4. 将1对应的索引通过 | 运算 添加到结果中去

```typescript
function findKNum(arr: number[], K: number, M: number): number {
  const statArr = Array(32).fill(0); // statArr 只有32个长度，所以是 O1

  for (let i = 0; i < arr.length; i++) {
    const num = arr[i];
    for (let j = 0; j < 32; j++) {
      if (((1 << j) & num) !== 0) {
        statArr[j]++;
      }
    }
  }

  let res = 0;
  for (let i = 0; i < statArr.length; i++) {
    const stat = statArr[i];
    if (stat % M !== 0) {
      res |= 1 << i;
    }
  }
  return res;
}
const r = findKNum([3, 3, 3, 2, 4, 6, 4, 2, 6], 3, 2);
console.log(r, "r");
```


## 二. 链表
### 1. 输入链表头节点，奇数长度返回中点，偶数长度返回上中点

示例:

1. 链表:1->2->3->null,返回2
2. 链表:1->2->3->4->null,返回2

```typescript
class Node {
  public val: number;
  public next: Node | null;
  constructor(val?: number, next?: Node | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function linkedList1(head: Node): Node | null {
  if (!head) return null;
  let slow = head;
  let fast = head;
  // 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> null
  // slow = 1,fast = 1,head = 1
  // slow = 2,fast = 3,head = 2
  // slow = 3,fast = 5,head = 3

  while (fast.next !== null && fast.next.next !== null) {
    slow = slow.next!;
    fast = fast.next.next;
  }
  return slow;
}

const head1 = new Node(1);
head1.next = new Node(2);
head1.next.next = new Node(3);
console.log(linkedList1(head1));

const head2 = new Node(1);
head2.next = new Node(2);
head2.next.next = new Node(3);
head2.next.next.next = new Node(4);
head2.next.next.next.next = new Node(5);
head2.next.next.next.next.next = new Node(6);
console.log(linkedList1(head2));

```
### 2. 输入链表头节点，奇数长度返回中点，偶数长度返回下中点

示例:

1. 链表:1->2->3->null,返回2
2. 链表:1->2->3->4->5->6->null,返回4

```typescript
class Node {
  public val: number;
  public next: Node | null;
  constructor(val?: number, next?: Node | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function linkedList1(head: Node): Node | null {
  if (!head) return null;
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next!;
    fast = fast.next.next!;
  }
  return slow;
}

const head1 = new Node(1);
head1.next = new Node(2);
head1.next.next = new Node(3);
console.log(linkedList1(head1));

const head2 = new Node(1);
head2.next = new Node(2);
head2.next.next = new Node(3);
head2.next.next.next = new Node(4);
head2.next.next.next.next = new Node(5);
head2.next.next.next.next.next = new Node(6);
console.log(linkedList1(head2));

```
### 3. 输入链表头节点，奇数长度返回中点前一个，偶数长度返回上中点前一个

示例:

1. 链表:1->2->3->null,返回1
2. 链表:1->2->3->4->5->6->null,返回2

```typescript
class Node {
  public val: number;
  public next: Node | null;
  constructor(val?: number, next?: Node | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function linkedList1(head: Node): Node | null {
  if (!head) return null;
  let pre = null;
  let slow = head;
  let fast = head;

  while (fast.next !== null && fast.next.next !== null) {
    pre = slow;
    slow = slow.next!;
    fast = fast.next.next;
  }
  return pre;
}

const head1 = new Node(1);
head1.next = new Node(2);
head1.next.next = new Node(3);
console.log(linkedList1(head1));

const head2 = new Node(1);
head2.next = new Node(2);
head2.next.next = new Node(3);
head2.next.next.next = new Node(4);
head2.next.next.next.next = new Node(5);
head2.next.next.next.next.next = new Node(6);
console.log(linkedList1(head2));

```
### 4. 输入链表头节点，奇数长度返回中点前一个，偶数长度返回下中点前一个

示例:

1. 链表:1->2->3->4->5->null,返回2
2. 链表:1->2->3->4->5->6->null,返回3

```typescript
class Node {
  public val: number;
  public next: Node | null;
  constructor(val?: number, next?: Node | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function linkedList1(head: Node): Node | null {
  if (!head) return null;
  let pre = null;
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    pre = slow;
    slow = slow.next!;
    fast = fast.next.next!;
  }
  return pre;
}

const head1 = new Node(1);
head1.next = new Node(2);
head1.next.next = new Node(3);
head1.next.next.next = new Node(4);
head1.next.next.next.next = new Node(5);
console.log(linkedList1(head1));

const head2 = new Node(1);
head2.next = new Node(2);
head2.next.next = new Node(3);
head2.next.next.next = new Node(4);
head2.next.next.next.next = new Node(5);
head2.next.next.next.next.next = new Node(6);
console.log(linkedList1(head2));

```
### 5. [给定一个单链表的头节点head，请判断该链表是否为回文结构](https://leetcode.cn/problems/palindrome-linked-list/)

解题思路:

1. 奇数链表找到中点,偶数链表找到(上中点或者下中点)
2. 反转中点到尾部的链表
3. 头指针尾指针开始遍历

```typescript
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function isPalindrome(head: ListNode | null): boolean {
  if (!head) return false;
  let slow = head;
  let fast = head;

  while (fast.next !== null && fast.next.next !== null) {
    slow = slow.next!;
    fast = fast.next.next!;
  }

  let pre = null;
  while (slow !== null) {
    const next = slow.next;
    slow.next = pre;
    pre = slow;
    slow = next!;
  }
  slow = head;
  let cur = pre;
  while (slow !== null && pre !== null) {
    if (slow.val !== pre?.val) return false;
    slow = slow.next!;
    pre = pre.next;
  }
  pre = null;
  while (cur !== null) {
    const next = cur.next;
    cur.next = pre;
    pre = cur;
    cur = next;
  }
  return true;
}

```
### 6. 将单向链表按某值划分成左边小、中间相等、右边大的形式

解题思路:

1. 使用6个变量将链表划分成小于区，等于区，大于区
2. 然后小于尾连接等于头，等于尾连接大于头

```typescript
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

function interval(head: ListNode | null, K: number): ListNode | null {
  if (!head) return null;

  // 小于区
  let sH = null;
  let sT = null;

  // 等于区
  let eH = null;
  let eT = null;

  // 大于区
  let mH = null;
  let mT = null;

  // 划分区间
  while (head !== null) {
    const next: ListNode | null = head.next!;
    if (head?.val < K) {
      if (sH === null) {
        sH = head;
        sT = head;
      } else {
        (sT as ListNode).next = head;
        sT = head;
      }
    }

    if (head?.val === K) {
      if (eH === null) {
        eH = head;
        eT = head;
      } else {
        (eT as ListNode).next = head;
        eT = head;
      }
    }

    if (head?.val > K) {
      if (mH === null) {
        mH = head;
        mT = head;
      } else {
        (mT as ListNode).next = head;
        mT = head;
      }
    }
    head = next;
  }

  if (sH !== null) {
    const nextHead = eH === null ? mH : eH;
    (sT as ListNode).next = nextHead;
  }

  if (eH !== null) {
    const nextHead = mH === null ? null : mH;
    (eT as ListNode).next = nextHead;
  }

  return sH !== null ? sH : eH !== null ? eH : mH;
}

const head = new ListNode(3);
head.next = new ListNode(7);
head.next.next = new ListNode(2);
head.next.next.next = new ListNode(4);
head.next.next.next.next = new ListNode(5);

const r = interval(head, 6);
console.dir(r, { depth: 1000 });

```
### 7. [复制带随机指针的链表,要求时间复杂度O(N)，额外空间复杂度O(1)](https://leetcode.cn/problems/copy-list-with-random-pointer)

解题思路:

1. 将1->2->3->null构造成1->1'->2->2'->3->3'->null
2. 设置random指针,这里不能设置next指针,因为后面的节点的random指针可能会指向前面的节点,如果设置了next指针,那么会找不到对应节点的克隆节点
3. 分离原链表和克隆链表

```typescript
class Node {
  val: number;
  next: Node | null;
  random: Node | null;
  constructor(val?: number, next?: Node, random?: Node) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
    this.random = random === undefined ? null : random;
  }
}

function copyRandomList(head: Node | null): Node | null {
  if (!head) return null;
  let cur = head;
  // 1->2->3->null  to  1->1'->2->2'->3->3'->null
  while (cur !== null) {
    const next = cur.next;
    cur.next = new Node(cur.val);
    cur.next.next = next;
    cur = next!;
  }

  // 设置random指针
  cur = head;
  while (cur !== null) {
    const next = cur.next?.next;
    cur.next!.random = cur.random !== null ? cur.random.next : null;
    cur = next!;
  }

  // 分离
  const res = head.next;
  cur = head;
  while (cur !== null) {
    const next = cur.next?.next!;
    cur.next!.next = next !== null ? next?.next : null;
    cur.next = next;
    cur = next!;
  }
  return res;
}
```
