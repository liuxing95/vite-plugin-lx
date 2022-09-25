// import { render } from "https://cdn.skypack.dev/react-dom";
// import React from 'https://cdn.skypack.dev/react'
import React from 'react';
import { render } from 'react-dom'
import Logo from './logo.svg'

let Greet = () => <h1>
  <Logo />
  Hello,juejin! </h1>;

render( <Greet /> , document.getElementById("root"));