import { useQuery } from '@tanstack/react-query'
import usersService from '../services/users'
import { Link } from 'react-router-dom'

const Users = () => {
  const result = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAll,
  })

  if (result.isLoading) {
    return <div>loading users...</div>
  }

  const users = result.data

  return (
    <div>
      <h2>Users</h2>

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <Link to={`/users/${u.id}`}>{u.name}</Link></td>
              <td>{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
  
}

export default Users
