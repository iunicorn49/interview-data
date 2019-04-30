### 原始类型由哪几种? null是对象吗? 原始数据类型和复杂数据类型存储有什么区别?

原始类型有6种, 分别是 `undefined, null, boolean, string, number, symbol(ES6新增)` .

虽然 `typeof null` 返回的值是 `object` , 但是 `null` 不是对象, 而是基本数据类型的一种.

原始数据类型存储在**栈内存**, 存储的是值.

复杂数据类型存储在**堆内存**, 存储的是地址. 当我们把对象赋值给另外一个变量的时候, 赋值的是地址, 指向同一块内存空间, 当一个对象改变时, 另一个相同地址的变量会跟着改变.

### typeof 是否正确判断类型? instanceof呢? instanceof的实现原理?

首先 `typeof` 能够正确的判断基本数据类型, 但是除了 `null` , `typeof null` 输出的是 `object` .

对于**对象**来说, `typeof` 不能正确的判断其类型, `typeof` 一个函数可以输出 `function` , 除此之外, 输出的全是 `object` , 在这种情况下, 我们无法准确的知道对象的类型.

```javascript
console.log('typeof null:', typeof null) // object
let fn = a => 2 * a
console.log('typeof fn:', typeof fn) // function
```

`instanceof` 可以准确的判断是否是复杂数据类型, 但是不能正确判断基本数据类型.

`instanceof` 是通过原型链判断的, `A instanceof B` , 在 `A` 的原型链中层层查找, 是否有原型等于 `B.__proto__` , 如果一直找到 `A` 的原型链的顶端(null, 即 `Object.prototype.__protp__` ), 仍然不等于 `B.prototype` , 那么返回 `false` , 否则返回 `true` .

```javascript
console.log('{} => Object:', {} instanceof Object) // true
console.log('[] => Object:', [] instanceof Object) // true
console.log('[] => Array:', [] instanceof Array) // true

class Person {}
let p = new Person()

console.log('p => Person:', p instanceof Person) // true
console.log('p => Object:', p instanceof Object) // true
```

`instanceof` 的实现代码

```javascript
const instance_of = (L, R) => {
	const O = R.prototype
	L = L.__proto__
	while (true) {
		if (L === null) { // 已经找到最顶层, 但是没找到
			return false
		}
		if (L === O) { // 找到了
			return true 
		}
		L = L.__proto__ // 继续往上找
	}
}

class Person {}
const p = new Person()

console.log(instance_of(p, Person)) // true
console.log(instance_of(p, Object)) // true
console.log(instance_of(p, Array)) // false
```

### for of, for in 和 forEach, map 的区别

- for...of: 具有 `iterator` 接口, 就可以用 `for of` 循环遍历它的成员(属性值). `for of` 可以使用的范围包括 [`数组` , `Set`, `Map`, `类似数组的对象`, `Generator`, `字符串`], `for of` 调用遍历器接口, 数组的遍历器接口只返回具有数字索引的属性. 对于普通的对象, `for of` 结构不能直接使用, 会报错, 必须部署 `iterator` 接口后才能使用. 可以中断循环.
- for...in: 遍历对象自身的和继承的可枚举的属性, 不能直接获取属性值. 可以中断循环.
- forEach: 只能遍历数组, 不能中断, 没有返回值, 不修改原数组.
- map: 只能遍历数组, 不能中断, 返回值是修改后的数组, 不修改原数组.

### 如何判断一个变量是否是数组?

- 使用 `Array.isArray` 来判断, 返回 `true` 的情况下是数组.
- 使用 `instanceof Array` 来判断 返回 `true` 的情况下是数组.
- 使用 `Object.prototype.toString.call([])` 来判断, 返回 `[object Array]` 的情况下是数组.

### 数组和类数组的区别

类数组, 拥有 `length` 属性, 其他属性(索引)为非负整数(对象中的索引会被当做字符串来处理).

不具有数组所有具有的方法.

类数组是一个普通对象, 而真实的数组是 `Array` 类型.

常见的类数组有, [`arugments`, `document.querySelectorAll()的返回值`, `JQ对象`, `字符串`]

类数组转换成真数组

```javascript
let arrayLike = 'abcdef'

let arr1 = Array.prototype.slice.call(arrayLike)

let arr2 = Array.from(arrayLike)

console.log(arr1) // [ 'a', 'b', 'c', 'd', 'e', 'f' ]
console.log(arr2) // [ 'a', 'b', 'c', 'd', 'e', 'f' ]
console.log([...arrayLike]) // [ 'a', 'b', 'c', 'd', 'e', 'f' ]
```

- 任何具有 `iterator` 接口的, 都可以用扩展运算符转为真正的数组.
- `Array.from()` 用于将类数组, 和可遍历对象转换为真正的数组.

### == 与 ===

- === 不需要进行转换, 直接比较值.
- == 会进行隐式转换.

隐式转换
1. 先判断两者类型是否相同, 如果相同, 再判断值是否相等.
2. 如果类型不同, 进行类型转换.
3. 判断比较是否是 `null` 或者是  `underfined` , 如果是, 返回 `true` .
4. 判断两者类型是否是 `string` 和 `number` , 如果是, 将 `string` 转为 `number` .
5. 判断其中一方是否为 `boolean` , 如果是, 将 `boolean` 转为 `number` 再进行判断.
6. 判断其中一方是否为 `object` , 且另一方为 `string` , `number` 或者 `symbol` , 如果是, 将 `object` 转为原始类型再判断.
7. 如果两方都是复杂数据类型, 比较的是他们的地址.
8. 引用类型转换 `boolean` 都是 `true` .

```javascript
let a = {}
let b = {}
let c = a
console.log('a === b:', a === b) // false
console.log('a === c:', a === c) // true
console.log('b === c:', b === c) // false
console.log('[] == ![]', [] == ![]) // true
```

`[] == ![]`

1. 首先, `!` 的优先级高于 `==` .
2. `[]` 引用类型转为 `boolean` 为 `true` , 因此 `![]` 是 `false` .
3. 当其中一方是 `boolean` 的情况下, 将 `boolean` 转为 `number` 再进行判断, `false` 转为 `number` 对应的值是 `0` .
4. 然后, 有一方是 `number` 的情况下, 另一方也要转为 `number` , `![]` 已经转换完毕, 这里才进行 `[]` 的转换, 空数组对应的 `number` 是 `0` .
5. `0 == 0`, 所以, `[] == ![]`, 结果为 `true` .

关于 `Array` 转为 `number` .
- []: 0
- \[4\]: 4
- [1,2]: NaN

### ES6的class与ES5的类有什么区别

1. ES6 `class` 内部所有定义的方法是不可枚举的.
2. ES6 `class` 必须用 `new` 调用.
3. ES6 `class` 不存在变量提升.
4. ES6 `class` 默认就是严格模式.
5. ES6 `class` 子类必须在父类的构造函数中调用 `super()` , 这样才有 `this` 对象, ES5 中的类继承关系正好相反, 先有子类的 `this` , 然后用父类的方法应用在 `this` 上.

### 数组常用API

**会修改原数组的API**
splice / reverse / fill / copyWithin / sort / push / pop / unshift / shift

**不会修改数组的API**
slice / map / forEach / every / filter / reduce / entry / entries / find / some / indexOf / findIndex

### let , const , var 的区别

1. let 和 const 不会发生变量提升, var 会.
2. let 和 const 是 JS 中的块级作用域.
3. let 和 const 不允许重复声明, var 可以.
4. let 和 const 定义的变量, 在定义语句之前, 如果使用会报错, ver 不会.
5. const 什么的是常量, 一点声明不可更改, 如果声明一个对象, 对象的属性值是可以修改的, 但是, 不能改变对象的引用地址.

### JS中, 什么是变量提升? 什么是暂时性死区?

变量提升就是, 变量在声明之前就可以使用了, 值为 `undefined` .

在代码块内, 使用 `let/const` 声明变量前, 该变量都是不可用的, 会直接报错. 在这个语法上, 称为**暂时性死区**. 暂时性死区意味着, `typeof` 不再是一个百分比安全的操作.

```javascript
typeof x; // 报错
let x;

typeof y; // 值是undefined, 不会报错
```

暂时性死区本质就是, 只要进入当前作用域, 所用的变量就已经存在, 但是不可获取, 只有等到声明变量的哪一行代码出现, 才可以获取和使用这个变量.

### 如何正确的判断 this ? 箭头函数的 this 是什么 ?

`this` 的绑定规则有四种: 默认绑定, 隐式绑定, 显示绑定, new绑定.

1. 函数用 `new` 调用(new绑定), 如果是, 绑定在新创建的实例上.
2. 函数是否通过 `call, apply` 调用, 或者使用 `bind` , 这三种方法是(显示绑定), 如果是, 那么, `this` 绑定在被指定的对象上.
3. 函数是否在某个上下文对象中调用(隐式绑定), 例如: vue对象, 如果是, `this` 绑定在哪个上下文对象.
4. 如果以上都不是, 那么就是(默认绑定), 在严格模式下, 绑定到 `undefined` 上, 否则绑定到全局对象上(浏览器和node不一样).
5. 在使用 `call, apply, bind` , 的时候, 将 `undefined` 或者 `null` 指定为被绑定者, 则会默认绑定到全局对象上.
6. 箭头函数没有 `this` , 他的 `this` 继承自上一层的代码块.

### 词法作用域和 this 的区别

- 词法作用域是由你在写代码的时候, 将变量和块级作用域写在哪里来决定的.
- `this` 是在调用时被绑定的, `this` 指向什么, 完全取决于函数调用位置.

### JS执行上下文和作用域链

执行上下文就是当前 JS 代码被解析和执行时所在的环境, JS执行上下文栈可以认为是一个存储函数调用的栈结构, 遵循先进后出的原则.

1. JS执行在单线程上, 所有代码都是排队执行的.
2. 一开始浏览器执行全局代码时, 首先创建全局的执行上下文, 压入执行栈的顶部.
3. 每当进入一个函数的执行就会创建函数的执行上下文, 并且把它压入执行栈的顶部. 当前函数执行完成后, 就将当前函数的执行上下文出栈, 等待垃圾回收.
4. 浏览器的JS执行引擎, 总是访问栈顶的执行上下文.
5. 全局上下文只有唯一的一个, 它在浏览器关闭的时候, 出栈.

所谓作用域链, 就是使用一个变量时, 从当前作用域开始查找, 如果没有, 则一层一层向外寻找, 直到全局作用域为止.

### 什么是闭包? 闭包的作用是什么? 闭包的使用场景?

闭包是指有权访问另一个函数作用域中的变量的函数, 创建闭包最常用的方式就是再函数内部再创建一个函数.

闭包的作用有:
1. 封装私有变量
2. 模仿块级作用域(ES5中没有块级作用域)
3. 实现JS模块.

### call, apply有什么区别? call, apply和bind的内部实现?

`call` 和 `apply` 的功能相同, 区别在于传参方式.
- call: `fn.call(target, arg1, arg2, ...)` , 调用一个函数, 具有一个指定的 `this` 值和分别提供的参数.
- apply: `fn.apply(target, [arg1, arg2])` , 调用一个函数, 具有一个指定的 `this` 值以及作为一个数组提供的参数.

#### call

1. 将函数设为传入参数的属性
2. 指定 `this` 到函数并传入给定参数执行函数
3. 如果不传入参数或者参数为 `null / undefined` , 则指向全局(`window / global`)
4. 删除参数上的函数

```javascript
Function.prototype.myCall = function(context) {
	if (!context) { // 如果不指定目标, 怎么绑定到 全局对象上
		context = typeof window === 'undefined' ? global: window
	}
	context.fn = this // 让 this 指向当前函数
	let args = [...arguments].slice(1) // 获取参数, 将第一个删掉
	let result = context.fn(...args) // 隐式绑定, 当前函数的this指向context
	delete context.fn
	return result
}
```

#### apply

```javascript
Function.prototype.myApplay = function(context, rest) {
	if (!context) {
		context = typeof window === 'undefined' ? global : window
	}
	context.fn = this
	let result = context.fn(...rest)
	delete context.fn
	return result
}
```

#### bind

`bind` 与 `call` 或者 `apply` 不同, `call / apply` 会直接调用, 而, `bind` 会返回一个新的函数, 当被返回的函数调用时, `bind()` 的第一个参数将作为它运行时的 `this` , 之后的一序列参数将会在传递的实参前传入作为它的参数.

