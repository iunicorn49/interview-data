Function.prototype.myApplay = function(context, rest) {
	if (!context) { // 如果不指定绑定对象, 则指向全局
		context = typeof window === 'undefined' ? global : window
	}
	context.fn = this // 将上下文的this指向这个函数
	let result = context.fn(...rest)
	delete context.fn
	return result
}

let name = 'window'

function fn(job, age) {
	console.log(this.name)
	console.log(job, age)
}

let foo = {
	name: 'foo'
}

fn.myApplay(null, ['PE', 20])