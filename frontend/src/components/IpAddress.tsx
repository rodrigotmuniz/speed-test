import { SetStateAction, useState } from 'react'
import { Button } from './Button'

interface IpAddressProps {
  onIpAddressChange: (value: SetStateAction<null | string>) => void
  onClean: () => void
}

export function IpAddress({ onClean, onIpAddressChange }: IpAddressProps) {
  const [inputValue, setInputValue] = useState('localhost:8080')

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
      <input className="ml-6 flex-1" name="myInput" onKeyUp={handleKeyDown} />
      56.124.123.37
      <Button onClick={handleOnStart}>Start</Button>
      localhost:8080
    </div>
  )
}
