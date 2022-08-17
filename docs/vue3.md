# Vue3 个人笔记

## 1. 实现 reactive

```typescript
const proxyMap = new WeakMap();
const enum Reactive_FLAGS {
  IS_REACTIVE = "__v_isReactive",
}
function reactive(target: any) {
  // 代理的如果不是对象,直接返回
  if (!isObject(target)) {
    return target;
  }
  const exitsting = proxyMap.get(target);
  // 已经代理过又重新代理源对象，直接返回代理对象
  if (exitsting) {
    return exitsting;
  }
  // 已经代理过又重新代理 代理对象，直接返回代理对象
  // 这里能命中判断说明是一个 proxy,proxy.xxx 会触发 get 操作,get 操作中会判断如果是此值会返回 true
  if (target[Reactive_FLAGS.IS_REACTIVE]) {
    return target;
  }
  // 创建代理
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === Reactive_FLAGS.IS_REACTIVE) {
        return true;
      }
      const res = Reflect.get(target, key, receiver);
      if (isObject) {
        // 递归懒代理，只有在取值时才会深度代理
        return reactive(res);
      }
      return res;
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      const res = Reflect.set(target, key, value, receiver);
      return res;
    },
  });
  proxyMap.set(target, proxy);
  return proxy;
}
```

## 2. 实现 effect

```typescript
let activeEffect;

class ReactiveEffect {
  public fn;
  public parent;
  public active = true;
  public options = {};
  public deps = [];

  constructor(fn, options) {
    this.fn = fn;
    this.active = this.active;
    this.deps = this.deps;
    this.options = options;
  }

  run() {
    if (!this.active) {
      return this.fn();
    }
    try {
      // 保证 effect 嵌套的顺序正确
      this.parent = activeEffect;
      // 将当前的 effect 保存到一个全局变量中,等下调用用户的回调，用户的回调中会触发 get 操作，我们在 get 操作的时候进行依赖收集
      activeEffect = this;
      // 调用用户的回调
      return this.fn();
    } finally {
      activeEffect = this.parent;
      this.parent = undefined;
    }
  }
}

function effect(fn, options) {
  const _effect = new ReactiveEffect(fn, options);
  // 先执行一次用户的回调
  _effect.run();
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
```

## 3. 实现依赖收集 track

```typescript
function reactive(target: any) {
  ...
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      ...
      const res = Reflect.get(target, key, receiver);
      // 收集effect
      track(target, "get", key);
      ...
      return res;
    },
  });
  ...
  return proxy;
}

/**
 * track后就将用户取的key和activeEffect做了关联，后续用户set值时，我们只需要让对应的effect重新执行即可
 * WeakMap{
 *   用户对象Object:Map{
 *      用户取的key值:Set([activeEffect])
 *   }
 * }
 */
function track(target, opertion, key) {
  // 因为我们在执行 this.fn 前将 ReactiveEffect 保存到了 activeEffect 这个全局变量中
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    let deps = depsMap.get(key);
    if (!deps) {
      depsMap.set(key, (deps = new Set()));
    }
    if (!deps.has(activeEffect)) {
      deps.add(activeEffect);
      // 让activeEffect也记住对应的deps,后续会做清理工作
      activeEffect.deps.push(deps);
    }
  }
}
```

## 4. 实现依赖更新 trigger

```typescript
function reactive(target: any) {
  ...
  const proxy = new Proxy(target, {
    set(target, key, value, receiver) {
      ...
      const res = Reflect.set(target, key, value, receiver);
      // 如果新值和老值不一样，才会去通知更新
      if (!Object.is(oldValue, value)) {
        // 通知effect重新执行
        trigger(target, "set", key, value, oldValue);
      }
      return res;
    },
  });
  ...
  return proxy;
}

function trigger(target, opertion, key, value, oldValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  // 拿到key对应的set集合，set集合中装了一个个的effect
  let effects = depsMap.get(key);
  if (effects) {
    effects = new Set(effects) // 浅拷贝一份,防止后续清理时一边删除一边添加引起的死循环问题
    effects.forEach((effect) => {
      // 防止用户在 effect 内部进行更新导致的爆栈问题
      if (effect !== activeEffect) {
        effect.run();
      }
    });
  }
}
```

## 5. 实现自定义更新 scheduler

```typescript
function trigger(target, opertion, key, value, oldValue) {
  ...
  if (effects) {
    effects.forEach((effect) => {
      if (effect !== activeEffect) {
        // 如果用户传递了scheduler,优先执行用户的,不执行内部的run
        if (effect.options?.scheduler) {
          effect.options.scheduler();
        } else {
          effect.run();
        }
      }
    });
  }
}
```

## 6. 条件切换后清除多余的 effect

### 6.1 例子

```typescript
// flag a b 均为响应式数据
effect(() => {
  flag ? a : b;
});
setTimeout(() => {
  // 条件发生变化后flag变成false,那么此时重新run effect 的时候应该清除a对应的effect依赖
  flag = false;
  setTimeout(() => {
    // a发生变化不应该导致更新
    a += 1;
  });
});
```

### 6.2 实现

```typescript
function cleanupEffect(effect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }
    deps.length = 0;
  }
}
class ReactiveEffect {
  ...
  run() {
    try {
      ...
      activeEffect = this;
      // 每次run前都清除之前对应的依赖，run执行的时候重新收集
      cleanupEffect(this);
      return this.fn();
    } finally {
      ...
    }
  }
}

```

## 7. 流程大逻辑梳理

- 代理创建 `Proxy` -> 用户取值时触发 `get` 操作
- 调用 `track`,将用户取的值和 `effect` 进行关联
- 用户设置值时,调用 `trigger`,重新执行对应的 `effect`
