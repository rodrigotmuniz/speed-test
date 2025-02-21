import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick: () => void
}

export function Button({ onClick, children }: ButtonProps) {
  return (
    <button className="text-amber-50 bg-gray-800 p-2 rounded-lg hover:cursor-pointer mx-2 ml-auto w-44" onClick={onClick}>
      {children}
    </button>
  )
}
