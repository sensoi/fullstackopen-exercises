import { useState } from 'react'
import useCountry from './hooks/useCountry'

const App = () => {
  const [name, setName] = useState('')
  const [search, setSearch] = useState('')

  const country = useCountry(search)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSearch(name)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">find</button>
      </form>

      {country === null && null}

      {country && country.found === false && (
        <div>not found...</div>
      )}

      {country && country.found !== false && (
        <div>
          <h3>{country.name.common}</h3>
          <div>capital {country.capital}</div>
          <div>population {country.population}</div>
          <img
            src={country.flags.png}
            alt={`flag of ${country.name.common}`}
            width="150"
          />
        </div>
      )}
    </div>
  )
}

export default App
