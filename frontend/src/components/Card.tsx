import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  show: boolean
}

export function Card({ children, show }: CardProps) {
  return show && <div className="p-5 my-2 border-2 border-solid">{children}</div>
}
