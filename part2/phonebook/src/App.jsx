import { useState, useEffect } from 'react'
import axios from 'axios'

const baseUrl = 'https://fso-v54q.onrender.com/api/persons'

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with: <input value={filter} onChange={handleFilterChange} />
  </div>
)

const PersonForm = ({
  newName, handleNameChange,
  newNumber, handleNumberChange,
  addPerson
}) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const Persons = ({ persons }) => (
  <ul>
    {persons.map(person =>
      <li key={person.id}>{person.name} {person.number}</li>
    )}
  </ul>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get(baseUrl)
      .then(response => {
        setPersons(response.data)
      })
      .catch(err => {
        console.error(err)
        alert('Failed to load data from server')
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const trimmedName = newName.trim()
    const trimmedNumber = newNumber.trim()

    if (!trimmedName || !trimmedNumber) return

    const exists = persons.some(p => p.name === trimmedName)
    const existsNum = persons.some(p => p.number === trimmedNumber)

    if (exists || existsNum) {
      alert(`${trimmedName} / ${trimmedNumber} is already added`)
      return
    }

    const newPerson = { name: trimmedName, number: trimmedNumber }

    axios
      .post(baseUrl, newPerson)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
      .catch(err => {
        console.error(err)
        alert('Failed to add person')
      })
  }

  const personsToShow = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} handleFilterChange={(e) => setFilter(e.target.value)} />

      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        handleNameChange={(e) => setNewName(e.target.value)}
        newNumber={newNumber}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App
