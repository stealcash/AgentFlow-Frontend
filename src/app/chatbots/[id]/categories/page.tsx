'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { callApi } from '@/utils/api'
import { withAuth } from '@/lib/withAuth'
import Image from 'next/image'

type Category = {
  id: number
  name: string
  parent_id: number | null
  image_path: string | null
}

function CategoriesPage() {
  const params = useParams<{ id: string }>()
  const chatbotId = params.id

  const [categories, setCategories] = useState<Category[]>([])
  const [newName, setNewName] = useState('')
  const [parentId, setParentId] = useState<number | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories(chatbotId)
  }, [chatbotId])

  const fetchCategories = async (chatbotId: unknown) => {
    const res = await callApi('get', `/api/v1/chatbots/${chatbotId}/categories`)
    const response = res?.data as { categories: Category[] }
    setCategories(response.categories || [])

    setLoading(false)
  }

  const handleCreateCategory = async () => {
    if (!newName) return

    await callApi('post', `/api/v1/chatbots/${chatbotId}/categories`, {
      name: newName,
      parent_id: parentId,
    })

    setNewName('')
    setParentId(null)
    fetchCategories(chatbotId)
  }

  const handleUploadImage = async (categoryId: number) => {
    if (!selectedImage) {
      alert('Select an image file first.')
      return
    }

    const formData = new FormData()
    formData.append('category_id', String(categoryId))
    formData.append('image', selectedImage)

    await callApi('post', `/api/v1/chatbots/${chatbotId}/categories/image`, formData, {
      isFormData: true,
    })

    setSelectedImage(null)
    fetchCategories(chatbotId)
  }

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    await callApi('delete', `/api/v1/chatbots/${chatbotId}/categories/${categoryId}`)
    fetchCategories(chatbotId)
  }

  if (loading) return <p className="p-4">Loading...</p>

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      <ul className="space-y-4 mb-6">
        {categories.map((cat) => (
          <li key={cat.id} className="border p-4 rounded">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold">{cat.name}</p>
                <p className="text-sm text-gray-600">
                  Parent ID: {cat.parent_id || 'None'}
                </p>
                {cat.image_path && (
                  <Image
                    src={`/${cat.image_path}`}
                    alt="Category"
                    width={128}
                    height={128}
                    className="object-cover mt-2"
                  />
                )}
              </div>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>

            <div className="flex gap-2 items-center">
              <input
                type="file"
                onChange={(e) =>
                  setSelectedImage(e.target.files ? e.target.files[0] : null)
                }
              />
              <button
                onClick={() => handleUploadImage(cat.id)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Upload Image
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="New category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <select
          value={parentId ?? ''}
          onChange={(e) =>
            setParentId(e.target.value ? parseInt(e.target.value) : null)
          }
          className="w-full p-2 border rounded"
        >
          <option value="">No Parent</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleCreateCategory}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Create Category
        </button>
      </div>
    </div>
  )
}

export default withAuth(CategoriesPage)
