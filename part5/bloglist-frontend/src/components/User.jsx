import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import usersService from '../services/users'

const User = () => {
  const { id } = useParams()

  const result = useQuery({
    queryKey: ['users'],
    queryFn: usersService.getAll,
  })

  if (result.isLoading) {
    return <div>loading...</div>
  }

  const user = result.data.find((u) => u.id === id)

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>

      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
