import { SetStateAction, useState } from 'react'
import { Button } from './Button'

interface IpAddressProps {
  onIpAddressChange: (value: SetStateAction<null | string>) => void
  onClean: () => void
}

export function IpAddress({ onClean, onIpAddressChange }: IpAddressProps) {
  const [inputValue, setInputValue] = useState('localhost:8080') // Just for testing

  const handleKeyDown = (input: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = input.target as HTMLInputElement
    setInputValue(value)
  }

  const handleOnStart = async () => {
    onClean()
    setTimeout(() => onIpAddressChange(inputValue), 100)
  }
  return (
    <div className="bg-green-900 my-2 flex items-center border-2 border-solid p-2">
      <label>
        <strong>IP Address:</strong>
      </label>
      <input className="mx-6  bg-black py-1 px-3 rounded-2xl flex-1" name="myInput" onKeyUp={handleKeyDown} />
      <Button onClick={handleOnStart}>Start</Button>
    </div>
  )
}
