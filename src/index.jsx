// import { render } from "https://cdn.skypack.dev/react-dom";
// import React from 'https://cdn.skypack.dev/react'
import React from 'react';
import { render } from 'react-dom'
import Logo from './logo.svg'
import 'core-js';

const func = async () => {
  console.log(12123)
}

Promise.resolve().finally();

func()

let Greet = () => <h1>
  <Logo />
  Hello,juejin! </h1>;

render( <Greet /> , document.getElementById("root"));