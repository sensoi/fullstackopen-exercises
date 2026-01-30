import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import axios from 'axios'

const BlogView = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const commentMutation = useMutation({
    mutationFn: async (comment) => {
      await axios.post(
        `http://localhost:3003/api/blogs/${id}/comments`,
        { comment }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  if (result.isLoading) {
    return <div>loading...</div>
  }

  const blog = result.data.find((b) => b.id === id)
  if (!blog) return null

  return (
    <div>
      <h2>
        {blog.title} — {blog.author}
      </h2>

      <div>{blog.url}</div>
      <div>likes {blog.likes}</div>
      <div>added by {blog.user?.name}</div>

      <h3>comments</h3>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          commentMutation.mutate(e.target.comment.value)
          e.target.comment.value = ''
        }}
      >
        <input name="comment" />
        <button type="submit">add comment</button>
      </form>

      <ul>
        {(blog.comments || []).map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogView
