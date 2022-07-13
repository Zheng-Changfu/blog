# Typescript 个人笔记

## 一. 什么是 Typescript

> **Typescript**是**Javascript**的超集,遵循最新的 **ES5 和 ES6**规范。**Typescript**扩展了**Javascript**语法

- Typescript 更像后端语言(Java)，让**Javascript**可以开发企业级的大型应用
- Typescript 提供的类型系统可以帮助我们在写代码时提供丰富的语法提示
- 在编写代码时会让代码进行类型检查从而避免很多线上错误
- Typescript 不会取代 Javascript,Typescript 最终会被编译成 Javscript
- Typescript 中有很多类型(自己添加的类型、内置类型)
- Typescript 只是为了开发者来进行代码约束的
- Typescript 中要考虑安全性，如果是安全的就可以赋值
- Typescript 中有所谓的类型推导会根据赋值的类型来推导变量的类型

## 二、基本类型

### 1. 基本类型和类类型的区别

```typescript
let num1: number = 12;
let num2: number = Number(12);
let num3: Number = new Number(12);
```

> 基本类型只能描述基本类型的值，如果是一个类的实例，需要用类类型去描述
> 基本不会用到内置的类类型
> string、number、boolean 同理

### 2. 数组类型

```typescript
let arr: number[] = [1, 2, 3];
let arr1: (string | number)[] = [1, "1", 2, "3"];
arr1.push(1);
arr1.push("2");
```

### 3. 元祖类型

```typescript
let tuple: [string, number, boolean] = ["1", 2, true];
tuple.push(1);
tuple.push("2");
tuple.push(true);
console.log(tuple[3]); // 为了安全，限制了不能使用第四个
```

### 4. 枚举类型

#### 1. 普通枚举

- 编译前

  ```typescript
  enum Status {
    OK = 200,
    NOT_FOUND = 404,
    MOVED = 301,
  }
  console.log(Status);
  ```

- 编译后

  ```javascript
  var Status;
  (function (Status) {
    Status[(Status["OK"] = 200)] = "OK";
    Status[(Status["NOT_FOUND"] = 404)] = "NOT_FOUND";
    Status[(Status["MOVED"] = 301)] = "MOVED";
  })(Status || (Status = {}));
  ```

#### 2. 常量枚举

- 编译前

  ```typescript
  const enum Status4 {
    OK = 200,
    NOT_FOUND = 404,
    MOVED = 301,
  }
  console.log(Status4.OK);
  ```

- 编译后

  ```javascript
  console.log(200 /* OK */);
  ```

#### 3. 异构枚举

- 编译前
  ```typescript
  enum Status1 {
    OK = 200,
    NOT_FOUND = 404,
    MOVED = 301,
    a = "b",
  }
  // NOT_FOUND和MOVED会自动向后推断为201、202
  enum Status2 {
    OK = 200,
    NOT_FOUND,
    MOVED,
    a = "b",
  }
  // c不会被自动向后推断,ts会报错
  enum Status3 {
    OK = 200,
    NOT_FOUND,
    MOVED,
    a = "b",
    c,
  }
  ```
- 编译后
  ```javascript
  var Status1;
  (function (Status1) {
    Status1[(Status1["OK"] = 200)] = "OK";
    Status1[(Status1["NOT_FOUND"] = 404)] = "NOT_FOUND";
    Status1[(Status1["MOVED"] = 301)] = "MOVED";
    Status1["a"] = "b";
  })(Status1 || (Status1 = {}));
  // NOT_FOUND和MOVED会自动向后推断为201、202
  var Status2;
  (function (Status2) {
    Status2[(Status2["OK"] = 200)] = "OK";
    Status2[(Status2["NOT_FOUND"] = 201)] = "NOT_FOUND";
    Status2[(Status2["MOVED"] = 202)] = "MOVED";
    Status2["a"] = "b";
  })(Status2 || (Status2 = {}));
  ```

#### 4. 小结

- 普通枚举:可以正举，还可以反举(只能是数字的值才可以反举),会被编译成对象结构
- 常量枚举:不会被编译成对象结构，只能取具体的某一项值
- 异构枚举:存在其他的非数字类型,这个非数字类型不能被反举

### 5. undefined 和 null 类型

> 严格模式下: null 只能给 null，undefined 只能给 undefined
> 非严格模式下: null 和 undefined 可以赋予给任何类型
> 通过 ts.config.json 中 strictNullChecks 来开启/关闭 严格模式

```typescript
let nu: null = null;
let un: undefined = undefined;
```

### 6. never 类型

> 永远达不到的情况

#### 1. 程序出错了

```typescript
function throwNewError(): never {
  throw new Error("出错");
}
```

#### 2. 死循环

```typescript
function whileTrue(): never {
  while (true) {}
}
```

#### 3. 走不到的情况

```typescript
type ICircle = { r: number; kind: "circle" };
type ISquare = { width: number; kind: "square" };

function validate(obj: never) {}

function getArea(obj: ICircle | ISquare) {
  // 为了安全，联合类型的取值时，只能取到公共的属性
  // 可以在类型中添加公共的属性来解决此问题
  // if(obj.r) 不能取
  // if(obj.width) 不能取
  if (obj.kind === "circle") {
    return obj.r * obj.r;
  }
  if (obj.kind === "square") {
    return obj.width * obj.width;
  }
  // 永远都走不到
  validate(obj);
}
```

### 7. void 类型

> 函数不写返回值默认就是 void
> undefined 可以兼容 void 类型
> void 不可以兼容 undefined 类型

```typescript
// undefined可以兼容void类型
function sum1(): void {
  return undefined;
}

// void 不可以兼容 undefined 类型
// 这种情况下必须要手动写return undefined
function sum2(): undefined {
  return undefined;
}
```

### 8. object 类型

> 除了基本类型都可以用 object 来标识，标识对象和我们的函数

```typescript
function create(target: object) {
  // 不能去取值 target.xxx
}
create(function () {});
create([]);
create(new Date());
create({ a: 1 });
```

### 9. symbol 类型

```typescript
const s1: symbol = Symbol();
const s2: symbol = Symbol();
console.log(s1 === s2);
```

### 10. bigint 类型

```typescript
const b1: bigint = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(100);
```

### 11. any 类型

> 放弃 ts 中的所有检查,不安全

```typescript
let a: any = 1;
a = "2";
a = {};
```

### 12. 字面量类型

```typescript
type IA = 1;
// 只能为数字类型的1
const num1: IA = 1;

type direction = "up" | "down" | "left" | "right";
// 只能为 'up' | 'down' | 'left' | 'right'中的一个
const d: direction = "up";
```

## 三、断言

> 我不知道是什么类型 我们可以断定他是什么类型
> 断言后出错了，就要自己承担

### 1. 非空断言

```typescript
const el: HTMLElement | null = document.getElementById("root");
// !是typescript中非空断言
el!.style.background = "red"; // 出错后后果自负

// ?.是javascript中可选链,只能取值，不能赋值
el?.style.background;
```

### 2. as 断言

```typescript
type IValue = number | string | HTMLElement;
function getVal(el: IValue) {
  // 断言el为HTMLElement元素，出了事我负责
  (el as HTMLElement).querySelector("root");
  // 断言成别名中不存在的,错误写法
  el as boolean;
}
```

### 3. 双重断言

> 不建议使用，可以会发生意想不到的问题

```typescript
type IValue = number | string | HTMLElement;
function getVal(el: IValue) {
  (el as any as boolean).valueOf;
}
```

### 4. 等同 as 语法的另一种写法

> 以下写法和 as 语法等同(使用比较少，在 JSX 语法中可能会存在问题)

```typescript
type IValue = number | string | HTMLElement;
function getVal(el: IValue) {
  (<HTMLElement>el).querySelector("root");
}
```

## 四、函数

> typescript 中可以给函数添加类型(函数的参数、函数的返回值)

### 1. 函数声明标识类型

```typescript
function sum(x: string, y: string): string {
  return x + y;
}
const s = sum("1", "2");
```

### 2. 表达式声明标识类型

```typescript
const sum1 = (x: string, y: string): string => x + y;
```

```typescript
type ISum = (a: string, b: string) => string;
const sum2: ISum = (x: string, y: string): string => x + y;
// 以ISum声明的为准，并且限制必须按照类型来赋予结果
sum2("1", "2");
```

### 3. 函数的默认值

```typescript
function fn1(a: string, b: string, c: string = "abc"): void {
  console.log(a + b + c);
}
fn1("1", "2");
```

### 4. 函数的可选参数

```typescript
function fn2(a: string, b: string, c?: string): void {
  console.log(a + b + c);
}
fn2("1", "2");
```

### 5. 函数的剩余参数

```typescript
function fn3(...args: nu mber[]): number {
  return args.reduce((p,c) => p + c, 0);
}
fn3(1, 2, 3, 4, 5);
```

### 6. 函数的 this

> typescript 函数使用中必须要标识 this 的类型

- 错误写法
  ```typescript
  function callThis1(value: string) {
    // "this" 隐式具有类型 "any"
    this;
  }
  callThis1.call({ name: "zcf" }, "abc");
  ```
- 正确写法(参数较少情况下)

  ```typescript
  // 必须在第一个参数，名字必须是this
  function callThis2(this: { name: string }, value: string) {
    this.name;
  }
  callThis2.call({ name: "zcf" }, "af");
  ```

- 正确写法(参数较多情况下使用 typeof)

  ```typescript
  function callThis3(this: MyThis, value: string) {
    this.name;
  }
  const thisObj = { name: "zcf" };
  // typescript中的typeof,不是javascript中的typeof
  type MyThis = typeof thisObj;
  callThis3.call(thisObj, "af");
  ```

### 7. 函数的重载

> 只能使用**function**关键字实现重载
> 完成以下功能
> 'abc' -> ['a','b','c']
> 123 -> [1,2,3]

- 错误写法

  ```typescript
  // 有可能传的是string，返回的number组成的数组
  // 有可能传的是number，返回的string组成的数组
  function toArray1(value: string | number): string[] | number[] {
    return typeof value === "string"
      ? value.split("")
      : value.toString().split("").map(Number);
  }
  const r1 = toArray1(123); // number[] | string[]
  ```

- 正确写法
  ```typescript
  function toArray2(value: string): string[];
  function toArray2(value: number): number[];
  function toArray2(value: string | number) {
    return typeof value === "string"
      ? value.split("")
      : value.toString().split("").map(Number);
  }
  const r2 = toArray2(123); // number[]
  const r3 = toArray2("123"); // string[]
  ```

## 五、类

> 类本身可以当做类型，用来描述实例的
> typeof 类,用来描述类本身的类型

### 1. 属性修饰符

- public

  ```typescript
  class Circle1 {
    constructor(public x: number, public y: number, public r: number) {}
  }

  // 等价于上面的写法
  class Circle2 {
    public x: number;
    public y: number;
    public r: number;
    constructor(x: number, y: number, r: number) {
      this.x = x;
      this.y = y;
      this.r = r;
    }
  }
  ```

- private

  ```typescript
  class Animal1 {
    constructor(private name: string) {
      this.name = name;
    }
  }
  class Cat extends Animal1 {
    constructor(name: string, public age: number) {
      super(name);
      // 不可以访问
      this.name;
    }
  }
  const cat = new Cat("tom", 18);
  console.log(cat.name); // 不可以访问
  ```

- protectd

  ```typescript
  class Animal2 {
    constructor(protected name: string) {
      this.name = name;
    }
  }
  class Cat2 extends Animal2 {
    constructor(name: string, public age: number) {
      super(name);
      // 可以访问
      this.name;
    }
  }
  const cat2 = new Cat2("tom", 18);
  console.log(cat2.name); // 不可以访问
  ```

- readonly

  ```typescript
  class Animal {
    public readonly name: string = "123";
    private constructor(name: string) {
      this.name = name;
    }
  }
  class Cat extends Animal {
    constructor(name: string) {
      super(name);
      // 不能修改
      this.name = "123";
    }
  }

  const cat = new Cat("123");
  // 不能修改
  cat.name = "234";
  ```

### 2. 外界不能 new,可以继承

```typescript
class Animal3 {
  protected constructor(protected name: string) {
    this.name = name;
  }
}
class Cat3 extends Animal3 {
  constructor(name: string, public age: number) {
    super(name);
    // 可以访问
    this.name;
  }
}
// 不能new,子类可以继承
new Animal3();
```

### 3. 外界不能 new,不能继承

```typescript
class Animal4 {
  private constructor(protected name: string) {
    this.name = name;
  }
}
// 不可以继承
class Cat4 extends Animal4 {
  constructor(name: string, public age: number) {
    super(name);
    this.name;
  }
}
// 不能new
new Animal4();
```

### 4. 小结

- public:自己/子类/外界都可以访问
- private:自己可以访问,子类/外界不可以访问
- protectd:自己/子类可以访问,外界不可以访问
- readonly:只能在初始化的时候修改值,初始化完毕后不能在修改，类似 const
- 属性修饰符定义在 constructor 前,会使得子类是否能被继承，外界是否能 new 的效果
- 属性修饰符定义在类中,会使得类中的 this 有权访问的效果
- 属性修饰符定义在 constructor 的参数中,会使得其参数直接被挂载到实例上

## 六、接口

> 用来描述数据的形状

### 1. 描述函数

```typescript
interface ISum2 {
  (a: string, b: string): string;
}
let sum2: ISum2 = (a: string, b: string): string => a + b;
```

### 2. 描述函数上的属性

> 使用**let**会报错,ts 中的 bug?

```typescript
interface ISum2 {
  (a: string, b: string): string;
  a: number;
}
const sum1: ISum2 = (a: string, b: string): string => a + b;
sum1.a = 100;
```

### 3. 后端接口返回的数据多,interface 中没定义这么多

- 接口中没**aaa**,但是实现中有**aaa**,有问题

  ```typescript
  interface IFruit {
    color: () => string;
    size: number;
  }

  const fruit: IFruit = {
    color: () => "123",
    size: 10,
    aaa: 19,
  };
  ```

- 通过 ts 的兼容性来解决
  ```typescript
  interface IFruit {
    color: () => string;
    size: number;
  }
  let obj = {
    color: () => "123",
    size: 10,
    aaa: 19,
  };
  const fruit1: IFruit = obj;
  ```
- 断言解决
  ```typescript
  // 接口中定义的属性在实现过程中必须全部包含,不能少任何一个属性(除了可选属性),因为断言必须包含已存在的
  interface IFruit {
    color: () => string;
    size: number;
  }
  const fruit2: IFruit = {
    color: () => "123",
    size: 10,
    aaa: 19,
  } as IFruit;
  ```
- 接口继承解决
  ```typescript
  interface IFruit {
    color: () => string;
    size: number;
  }
  interface IFruit2 extends IFruit {
    aaa: number;
    bbb?: number; // 可选属性,可有可无
  }
  const fruit3: IFruit2 = {
    color: () => "123",
    size: 10,
    aaa: 19,
  };
  ```
- 同名接口的自动合并解决
  ```typescript
  interface IFruit {
    color: () => string;
    size: number;
  }
  interface IFruit {
    aaa: number;
  }
  const fruit3: IFruit = {
    color: () => "123",
    size: 10,
    aaa: 19,
  };
  ```
- 接收任意类型解决
  ```typescript
  interface Person {
    name: string;
    age: number;
    [key: string]: any; // 可以接收任意类型
  }
  const person: Person = {
    name: "zcf",
    age: 10,
    sex: "男",
  };
  ```

### 4. interface 修饰符

- readonly(只读,不可修改)
  ```typescript
  interface IV {
    // 可读，不可修改
    readonly color: string;
    taste: string;
    // 可有可无
    size?: number;
  }
  const v: IV = {
    color: "red",
    taste: "sweet",
  };
  // 不可修改
  v.color = "xxx";
  ```
- ?(可有可无)

  ```typescript
  interface IV {
    // 可有可无
    size?: number;
  }
  const v: IV = {};
  ```

- as const(将所有的属性设置为只读的，只针对具体的值)

  ```typescript
  // 将所有的属性都设置为只读的
  const x = {
    color: "red",
    taste: "sweet",
    size: 18,
  } as const;
  // 不能修改
  x.color = "green";
  ```

### 5. 描述类和类的实例

#### 1. 抽象类

> 使用 abstract 关键字,增加后此类不能被 new
> 定义的抽象方式或者抽象属性必须由子类来实现

```typescript
abstract class Animal {
  abstract eat(): void;
  abstract speek(): void;
  abstract name: string;
  drink() {
    console.log("drink");
  }
}

class Tom extends Animal {
  name = "cat";
  eat(): void {
    console.log("eat");
  }
  speek(): void {
    console.log("speek");
  }
}
```

### 6. 描述实例上的属性和方法

> 冒号在前是用来描述实例
> 冒号在后是用来描述原型
> 可以混淆使用，ts 不会区分是原型还是实例

```typescript
interface IEat {
  eat: () => string; // 描述实例上的
}
interface IEat2 {
  dirnk(): string; // 描述原型上的
}
class Tom2 implements IEat, IEat2 {
  eat: () => string;
  constructor() {
    this.eat = () => {
      return "2";
    };
  }
  dirnk(): string {
    return "2";
  }
}
```

### 7. 描述构造函数

- 接口描述

  ```typescript
  class Mouse {
    constructor(public name: string, public age: number) {}
  }
  class Dog {}

  interface IClazz2 {
    new (name: string, age: number): any;
  }
  function getInstance(clazz: IClazz2) {
    return new clazz("zcf", 18);
  }
  // any
  let instance = getInstance(Mouse);
  ```

- 别名描述

  ```typescript
  class Mouse {
    constructor(public name: string, public age: number) {}
  }
  class Dog {}
  type IClazz = new (name: string, age: number) => any;
  function getInstance(clazz: IClazz) {
    return new clazz("zcf", 18);
  }
  // any
  let instance = getInstance(Mouse);
  ```

### 8. interface 和 type 的区别

- interface 不支持联合类型

  ```typescript
  type ISum1 = ((a: string, b: string) => string) | number;
  interface ISum2 {
    (a: string, b: string): string;
  }
  let sum1: ISum1 = (a: string, b: string): string => a + b;
  let sum2: ISum2 = (a: string, b: string): string => a + b;
  sum1 = 123;
  // 不支持联合类型
  sum2 = 123;
  ```

- interface 重名会合并,type 重名会报错

  ```typescript
  // interface自动合并
  interface IFruit {
    color: () => string;
    size: number;
  }
  interface IFruit {
    aaa: number;
  }

  // type会报错
  type IV1 = { size: number; aaa: number };
  type IV1 = { size: number; aaa: number };
  ```

- interface 可以扩展,type 不能扩展

  ```typescript
  interface IFruit {
    color: () => string;
    size: number;
  }
  interface IFruit2 extends IFruit {
    aaa: number;
  }
  ```

- interface 不可以使用 in,typeof 可以使用 in
  ```typescript
  interface Person1 {
    handsome: string;
  }
  interface Person2 {
    high: string;
  }
  // 可以
  type Spread<T> = {
    [K in keyof T]: T[K];
  };
  // 不可以
  interface Spread<T> {
  [K in keyof T]: T[K]
  }
  ```

## 七、泛型

> 在定义类型的时候不确定是什么类型，在使用的时候在知道
> 一般泛型都用一个单独的大写字母来表示

### 1. 泛型在普通函数中使用

```typescript
class Mouse {
  constructor(public name: string, public age: number) {}
}

class Dog {
  constructor(public name: string) {}
}

function getInstance<T>(
  clazz: new (...args: any[]) => T,
  name: string,
  age?: number
) {
  if (clazz instanceof Dog) {
    return new clazz(name);
  }
  return new clazz(name, age);
}
const instance1 = getInstance<Mouse>(Mouse, "tom", 1);
const instance2 = getInstance<Dog>(Dog, "dog", 2);
```

```typescript
function createArray<T>(times: number, val: T): T[] {
  let arr = [];
  for (let i = 0; i < times; i++) {
    arr.push(val);
  }
  return arr;
}
let arr1 = createArray(5, "abc");
let arr2 = createArray(5, 1);
```

### 2. 泛型在箭头函数中使用

```typescript
const createArray = <T>(times: number, val: T): T[] => {
  let arr = [];
  for (let i = 0; i < times; i++) {
    arr.push(val);
  }
  return arr;
};
let arr1 = createArray(5, "abc");
let arr2 = createArray(5, 1);
```

### 3. 泛型在 interface 中使用

```typescript
interface ICreateArray {
  <T>(times: number, val: T): T[];
}
const createArray: ICreateArray = (times, val) => {
  let arr = [];
  for (let i = 0; i < times; i++) {
    arr.push(val);
  }
  return arr;
};
let arr1 = createArray(5, "abc");
let arr2 = createArray(5, 1);
```

### 4. 泛型在 type 中使用

```typescript
type ICreateArray = <T>(times: number, val: T) => T[];
const createArray: ICreateArray = (times, val) => {
  let arr = [];
  for (let i = 0; i < times; i++) {
    arr.push(val);
  }
  return arr;
};
let arr1 = createArray(5, "abc");
let arr2 = createArray(5, 1);
```

### 5. 两种泛型的区别

> 在函数前面声明的泛型表示调用的时候才会确定泛型
> 在接口关键字后或者别名后声明的泛型表示使用接口或别名的时候确定的泛型

```typescript
interface ICallback<T> {
  (item: T): void;
}

const forEach = <T>(arr: T[], callback: ICallback<T>) => {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i]);
  }
};
forEach([1, "2", "3", true], (item) => {
  console.log(item);
});
```

### 6. 多个泛型

> 注意:泛型在没有确定类型前，是不能做运算，取值操作的

```typescript
function swap<T, K>(tuple: [T, K]): [K, T] {
  return [tuple[1], tuple[0]];
}
const r = swap([1, "abc"]);
```

```typescript
// 注意:泛型在没有确定类型前，是不能做运算，取值操作的
// error
function sum<T>(a: T, b: T): T {
  // 无法保证两个泛型相加，T + T => T? (false + false = 0)
  return a + b;
}
```

### 7. 泛型约束

> 更细致的约束泛型的特征

```typescript
// 传进来的参数必须满足是number类型
function sum2<T extends number>(a: T, b: T) {
  return a + b;
}
const r1 = sum2(1, 2);
```

### 8. keyof

> 写一个方法,有 2 个参数(obj,key)
> obj 必须是一个对象,
> 限制 key 必须包含在 obj 中

```typescript
let o1 = { name: "zcf", age: 19 };
let o2 = { name: "cxh", age: 19 };
function getValueByKey<T extends object, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

let r2 = getValueByKey(o1, "name");
let r3 = getValueByKey(o2, "age");
```

### 9. keyof 和 typeof 区别

> keyof 取的是某个泛型中的所有 key
> typeof 取的是一个某个值中的所有类型

```typescript
let o1 = { name: "zcf", age: 19 };
let o2 = { name: "cxh", age: 19 };
// keyof 取的是某个类型中的所有key
// typeof 取的是一个对象所有的类型
type xx = typeof o1; // {name:string,age:number}
type xxx = keyof typeof o1; //  name | age
```

## 八、交叉类型和联合类型

> 交叉类型(交集 &)
> 联合类型(并集 |)

```typescript
interface Person1 {
  handsome: string;
}
interface Person2 {
  high: string;
}
type Spread<T> = {
  // 循环类型
  // 循环T中所有的key,用K接收
  // 值为T[K]
  [K in keyof T]: T[K];
};
type Person3 = Spread<Person1 & Person2>;
const person3: Person3 = {
  handsome: "帅",
  high: "高",
};
```

## 九、内置类型实现

### 1. Exclude

> 排除掉某个类型

```typescript
type Exclude<T, K> = T extends K ? never : T;
// 排除掉了string
type ExcludeType = Exclude<number | string | boolean, string>;
```

### 2. Extract

> 只想要某一个类型

```typescript
type Extract<T, K> = T extends K ? T : never;
// 只要string
type ExtractType = Extract<number | string | boolean, string>;
```

### 3. NonNullable

> 排除掉 null 和 undefined 的

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;
// 排除掉null和undefined
type NoNullType = NonNullable<string | null | undefined>;
```

### 4. Partial

> 将所有参数变成可选的(只处理了第一层)

- 浅实现(只处理第一层)

  ```typescript
  interface Person {
    name?: string;
    age: number;
    address: {
      num?: number;
    };
  }
  type Partial<T> = {
    [K in keyof T]?: T[K];
  };
  type MyPartial = Partial<Person>;
  ```

- 深实现(处理所有层)
  ```typescript
  interface Person {
    name?: string;
    age: number;
    address: {
      num?: number;
    };
  }
  type DPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DPartial<T[K]> : T[K];
  };
  type MyPartial = DPartial<Person>;
  ```

### 5. Required

> 将所有参数变成必填的

- 浅实现(只处理第一层)

  ```typescript
  interface Person {
    name?: string;
    age: number;
    address: {
      num?: number;
    };
  }
  type Required<T> = {
    // 这里的 -? 是将类型中原有的可选去掉
    [K in keyof T]-?: T[K];
  };
  type MyRequired = Required<Person>;
  ```

- 深实现(处理所有层)
  ```typescript
  interface Person {
    name?: string;
    age: number;
    address: {
      num?: number;
    };
  }
  type DRequired<T> = {
    // 这里的 -? 是将类型中原有的可选去掉
    [K in keyof T]-?: T[K] extends object ? DRequired<T[K]> : T[K];
  };
  type MyRequired = DRequired<Person>;
  ```

### 6. Readonly

> 将所有参数变成只读的(只处理了第一层)

- 浅实现(只处理第一层)
  ```typescript
  interface Person {
    name?: string;
    age: number;
    address: {
      num?: number;
    };
  }
  type Readonly<T> = {
    readonly [K in keyof T]: T[K];
  };
  type MyReadonly = Readonly<Person>;
  ```
- 深实现(处理所有层)
  ```typescript
  interface Person {
    name?: string;
    age: number;
    address: {
      num?: number;
    };
  }
  type DReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object ? DReadonly<T[K]> : T[K];
  };
  type MyReadonly = DReadonly<Person>;
  ```

### 7. Pick

> 挑选出列举的属性

- 实现
  ```typescript
  interface Animal {
    type: string;
    name: string;
    age: number;
    address: string;
  }
  // K必须是T中的值
  type Pick<T, K extends keyof T> = {
    // 循环K('type' | 'address'),拿到每一个key(M),返回T[M]
    [M in K]: T[M];
  };
  type PickType = Pick<Animal, "type" | "address">;
  ```

### 8. Omit

> 忽略列举的属性

- 实现
  ```typescript
  interface Animal {
    type: string;
    name: string;
    age: number;
    address: string;
  }
  type Omit<T, K extends keyof T> = {
    // 循环去掉name的所有key,拿到每一个key(M),返回T[M]
    [M in Exclude<keyof T, K>]: T[M];
  };
  type OmitType = Omit<Animal, "address">;
  ```

### 9. Record

> 记录 key:value(一般用来表示函数的参数)

- 例子
  ```typescript
  // keyof any 是列举对象的key能支持的类型
  // R 为占位符,不知道回调的返回值
  function mapping<K extends keyof any, V, R>(
    obj: Record<K, V>,
    callback: (key: K, value: V) => R
  ): Record<K, R> {
    let result = {} as Record<K, R>;
    for (let key in obj) {
      result[key] = callback(key, obj[key]);
    }
    return result;
  }
  let mapResult = mapping({ a: 1, b: 2, c: 3 }, (key, value) => {
    return value + "";
  });
  ```
- 实现
  ```typescript
  // keyof any 是列举对象的key能支持的类型
  type Record<K extends keyof any, V> = {
    [X in K]: V;
  };
  ```

### 10. 对象的 merge

```typescript
interface Person1 {
  name: string;
  age: number;
}
interface Person2 {
  high: number;
  name: number;
}

let o1: Person1 = { name: "zcf", age: 10 };
let o2: Person2 = { name: 20, high: 30 };

// 忽略掉Person1的name属性
type T = Omit<Person1, keyof Person2>;
// 两个类型进行合并
type M = T & Person2;

function merge<T, K>(o1: T, o2: K): Omit<T, keyof K> & K {
  return { ...o1, ...o2 };
}

let obj = merge(o1, o2);
console.log(obj.name); // number类型
```

## 十、类型保护

### 1. typeof

```typescript
function isType(val: string | number) {
  if (typeof val === "string") {
    val;
  } else {
    val;
  }
}
```

### 2. instanceof

```typescript
class Person {}
class Animal {}

function isAnimal(val: Person | Animal) {
  if (val instanceof Animal) {
    val;
  } else {
    val;
  }
}
```

### 3. in

```typescript
interface Person1 {
  handsome: string;
  name: string;
}

interface Person2 {
  handsome: string;
  name: number;
}

function isPerson1(val: Person1 | Person2) {
  if ("handsome" in val) {
    val;
  } else {
    val;
  }
}
```

### 4. 自定义类型保护

```typescript
interface Circle {
  kind: "circle";
  r: number;
}

interface Rant {
  kind: "rant";
  width: number;
  height: number;
}

// val is Circle 代表返回值为true的就是圆
function isCircle(val: Circle | Rant): val is Circle {
  return val.kind === "circle";
}

function getArea(val: Circle | Rant) {
  if (isCircle(val)) {
    // ts不知道isCircle的调用结果 true代表圆还是 false代表圆
    // 我们需要自定义类型保护
    val;
  }
}
```

## 十一、类型的兼容性

> ts 中的兼容性,不要死记硬背
> ts 永远从我们的安全性来考虑,如果安全则可以赋值

### 1. 联合类型的兼容性

```typescript
let n1!: string | number;
let n2!: string | number | boolean;

// n1可以赋值给n2(因为n1中有的n2中都有)(少给多)
n2 = n1;
```

### 2. 接口的兼容性(多给少)

```typescript
interface Fruit1 {
  color: string;
}
interface Fruit2 {
  color: string;
  taset: string;
}
let fruit1!: Fruit1;
let fruit2!: Fruit2;

fruit1 = fruit2;
```

### 3. 函数的兼容性

- 对于参数而言(少给多)
  ```typescript
  let fn1!: (a: string, b: string) => string;
  let fn2!: (a: string, b: string, c: string) => string;
  fn2 = fn1;
  ```
- 对于返回值而言(少给多)
  ```typescript
  let fn3!: (a: string, b: string) => string | number | boolean;
  let fn4!: (a: string, b: string) => string;
  fn3 = fn4;
  ```

### 4. 类的兼容性

> 鸭子类型检测，只要长得一样就认为是鸭子
> 在类中一旦有了除 public 之外的其他修饰符(private,protect)就永远不相等了

```typescript
class Person {
  name!: string;
}
class Animal {
  name!: string;
}

let person = new Person();
let animal = new Animal();

// 可以互相赋值
person = animal;
animal = person;
```

### 5. 枚举的兼容性

> 枚举不兼容,无法互相赋值

```typescript
enum A {}
enum B {}
```

### 6. 父子间的兼容 协变和逆变

- 逆变(传父亲)

  ```typescript
  class Parent {
    public money!: number;
  }

  class Son extends Parent {
    public car!: number;
  }

  class Grandson extends Son {
    public pay!: string;
  }
  function fn(cb: (val: Son) => Son) {}
  fn((val: Son) => new Son());
  fn((val: Parent) => new Son());
  // 不可以传孙子,因为Son没有pay
  fn((val: Grandson) => new Son());
  ```

  ```typescript
  // 对于联合类型而言:参数多的是父亲(传递父亲逆变)
  function fn5(cb: (val: string | number | boolean) => string | number) {}
  // 返回儿子(参数少的)斜变
  fn5((val: string | number | boolean | null) => 2);
  ```

- 斜变(反儿子)

  ```typescript
  class Parent {
    public money!: number;
  }

  class Son extends Parent {
    public car!: number;
  }

  class Grandson extends Son {
    public pay!: string;
  }
  function fn(cb: (val: Son) => Son) {}
  // 返回儿子
  fn((val: Parent) => new Grandson());
  ```

- 双向斜变(可以传父亲,可以传儿子)

  > 如果关闭 strictFunctionTypes 字段,参数则是双向斜变的(可以传父亲，也可以传儿子)

  ```typescript
  class Parent {
    public money!: number;
  }
  class Son extends Parent {
    public car!: number;
  }
  class Grandson extends Son {
    public pay!: string;
  }
  fn((val: Parent) => new Son());
  // 如果关闭 strictFunctionTypes 字段,可以双向斜变
  fn((val: Grandson) => new Son());
  ```

## 十二、unknown

> unknown 和 any 类型非常相似，但是是一个安全类型。我们在使用 unknown 类型的时候需要将类型进行具体化。缩小范围在使用
> 任何类型都是 unknown 的子类型，如果当前类型是 unknown,只能将这个类型赋予给 unknown 或 any
> 可以将所有不知道的类型标识成 unknown,但是有的场景还是要用 any
> unknown 和任何类型作为联合类型 返回的都是 unknown
> 标记为了 unknown 之后不能取值、赋值、运算

- 例 1

  ```typescript
  function sum(a: unknown, b: number) {
    // 会使得我们不得不补充代码逻辑来完善
    if (typeof a === "string") {
      // a的ts类型就是string
      return a + b;
    }
    if (typeof a === "number") {
      //  a的ts类型就是number
      return a + b;
    }
    return a as boolean;
  }
  let r = sum(undefined, 2);
  ```

- 例 2
  ```typescript
  let data: unknown = JSON.parse('{name:"zcf",age:20}');
  function isValid(data: any): data is { name: string; age: number } {
    return data.age !== undefined && data.age !== undefined;
  }
  if (isValid(data)) {
    data.name;
    data.age;
  }
  ```
- 例 3
  ```typescript
  type inter = unknown & number; // number
  type Key = keyof unknown; // never,不支持 keyof
  ```

## 十三、infer

### 1. 推断函数返回值

```typescript
function getUserInfo() {
  return { name: "zcf", age: 19 };
}
// 在没有调用函数前拿到函数返回值
// 推断函数返回值
type Func = (...args: any[]) => any;
type ReturnType<T extends Func> = T extends (...args: any[]) => infer R
  ? R
  : never;
type MyType = ReturnType<typeof getUserInfo>;
```

### 2. 推断函数参数

```typescript
// 推断函数参数
function getUserInfo2(name: string, age: number) {
  return { name, age };
}
// [name: string, age: number]
type Parameters<T extends Func> = T extends (...args: infer X) => any
  ? X
  : never;
type MyParamaters = Parameters<typeof getUserInfo2>;
```

## 十四、命名空间

> namespace 这个一般在项目中使用不到，在编写声明文件的时候一般会被用到
> 我们在一个模块中，想维护多段逻辑，而且逻辑中有重名的部分(命名冲突)

### 1. 基本语法

```typescript
namespace Zoo {
  export class Monkey {}
}

namespace Home {
  export class Monkey {}
}

namespace T {
  export class Monkey {}
  export namespace F {
    export const cat = "猫";
    export const panda = "熊猫";
  }
}

Zoo.Monkey;
Home.Monkey;
T.F.cat;
```

### 2. 命名空间可以和类进行合并

```typescript
class Home2 {}
namespace Home2 {
  export const aa = 1;
}
Home2.aa;
```

### 3. 命名空间可以和函数进行合并

```typescript
function Home3() {}
namespace Home3 {
  export const bb = 2;
}
Home3.bb;
```

### 4. 命名空间和接口无法合并

```typescript
interface Home4 {
  b: string;
}
namespace Home4 {
  export const a = 1;
}
Home4.a;
Home4.b; // error
```

### 5. 同名的命名空间可以合并

```typescript
namespace Home4 {
  export const a = 1;
}
namespace Home4 {
  export const b = 2;
}

Home4.a;
Home4.b;
```

## 十五、Typescript 声明配置

> .d.ts 文件为了放 declare 语法的，让我们的代码有友好的提示
> 没有实际功能，就是为了在其他模块中使用 jqueryName 代码不报错
> 使用 declare 都是全局的，可以直接声明，但是不能有具体的实现

```typescript
// 没有实际功能，就是为了在其他模块中使用jqueryName代码不报错
declare const jqueryName: string;

declare function $(): {
  css(key: string, value: string): void;
  html(value: string): void;
};

namespace $ {
  export namespace fn {
    function extend(): void;
  }
}

declare function getArr(key: number): number[];
declare function getArr(key: string): string[];

// 给原型定义方法
interface String {
  aa: (a: string, b: number) => void;
}

declare module "*.vue";
// 可以导入任意.vue文件不报错

declare module "*.vue" {
  export default "hello";
}
```
