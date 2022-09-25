import { a } from 'module-a';
import fib from 'virtual:fib';

import 'core-js';

const func = async () => {
  console.log(12123)
}

Promise.resolve().finally();

func()
console.log(a);
alert(`结果: ${fib(10)}`)