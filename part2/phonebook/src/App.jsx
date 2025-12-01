import { useState } from 'react'
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
      <li key={person.name}>{person.name} {person.number}</li>
    )}
  </ul>
)


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const addPerson = (event) => {
    event.preventDefault()
    const trimmedName = newName.trim()
    const trimmedNumber = newNumber.trim()

    if (!trimmedName || !trimmedNumber) return

    const alreadyExists = persons.some(person => person.name === trimmedName)
    const alreadyExistsNum = persons.some(person => person.number === trimmedNumber)

    if (alreadyExists || alreadyExistsNum) {
      alert(`${trimmedName} / ${trimmedNumber} is already added to phonebook`)
      return
    }

    const newPerson = { name: trimmedName, number: trimmedNumber }
    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm 
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App
