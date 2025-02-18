import { useState } from "react"
import { Button } from "./Button"

export function IpAddress({ setIpAddress, clean }) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (input: React.KeyboardEvent) => {
    const { value } = input.target
    setInputValue(value)
  }

  const handleOnStart = () => {
    const tmp = inputValue
    console.log('handleOnStart', inputValue)
    clean()
    console.log('tmp', tmp)
    setTimeout(() => {
      setIpAddress(tmp)
    }, 10);
  }
  return (
    <div className="bg-green-900 my-2 flex items-center border-2 border-solid p-2">
      <label><strong>IP Address:</strong></label>
      <input className="ml-6 flex-1" name="myInput" onKeyUp={handleKeyDown} />
      <Button handleClick={handleOnStart}>Start</Button>
    </div>
  )
}
