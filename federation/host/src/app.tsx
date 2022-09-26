import { useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'

// 1. 组件
import RemoteApp from "remote_app/App";
// 2. 工具函数
import { add } from "remote_app/utils";
// 3. 异步组件
// const AysncRemoteButton = () => import("remote_app/Button")

const data: number = add(1, 2);
import './app.css'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {data}
      <RemoteApp />
      {/* <AysncRemoteButton /> */}
    </>
  )
}
