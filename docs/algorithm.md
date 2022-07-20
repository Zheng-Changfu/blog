# 算法学习

## 1. 异或运算

### 1. 前置知识

#### 1.1 理解

> 无进位相加

#### 1.2 规律提炼

1. 0 ^ N = N
2. N ^ N = 0
3. A ^ B = B ^ A
4. A ^ B ^ C  = C ^ A ^ B
5. A ^ B = F , A = F ^ B , B = F ^ A

#### 1.3 技巧

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

### 2. coding

#### 2.1 一个数组中有一种数出现了奇数次，其他数都出现了偶数次，怎么找到并打印这种数

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

#### 2.2 一个数组中有两种数出现了奇数次，其他数都出现了偶数次，怎么找到并打印这两种数

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