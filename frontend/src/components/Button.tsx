export function Button({ handleClick, children }) {
  return (
    <button className="text-amber-50 bg-gray-800 p-2 rounded-lg hover:cursor-pointer mx-2" onClick={handleClick}>
      {children}
    </button>
  )
}
