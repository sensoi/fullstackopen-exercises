const Filter = ({ filter, setFilter }) => {
  return (
    <div style={{ marginBottom: 10 }}>
      filter{' '}
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
    </div>
  )
}

export default Filter
