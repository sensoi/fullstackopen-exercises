import { useState } from 'react'

const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <div>{counter}</div>
      <button onClick={() => setCounter(counter + 1)}>
        Add 1
      </button>
      <button onClick={() => setCounter(0)}>
        Reset
      </button>
    </div>
  )
}

export default App
