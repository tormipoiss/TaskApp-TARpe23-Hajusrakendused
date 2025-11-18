import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FilterableTasksTable from './components/task/filterableTasksTable'

function App() {
  const [count, setCount] = useState(0)
  const tasks = [{"id":1,"title":"MegaTask"}]

  return (
    <>
      <FilterableTasksTable tasks={tasks} />
    </>
  )
}

export default App
