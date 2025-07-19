'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { callApiWithoutAuth } from '@/utils/api'
import { ApiResponse } from '@/types/interface'

type LoginData = {
  email: string
  password: string
}

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>()

  const onSubmit = async (data: LoginData) => {
    try {
      const response = (await callApiWithoutAuth('post', '/api/v1/auth/login', data)) as ApiResponse

      if (response?.data?.token) {
        login(response.data.token)
        router.push('/dashboard')
      } else {
        alert('Login failed — no token received')
      }
    } catch (err: any) {
      alert(err.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md p-6 rounded-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          {...register('email', { required: true })}
          className="input"
        />
        {errors.email && <p className="text-red-500">Email is required</p>}

        <input
          type="password"
          placeholder="Password"
          {...register('password', { required: true })}
          className="input"
        />
        {errors.password && <p className="text-red-500">Password is required</p>}

        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">
          Login
        </button>
      </form>
    </div>
  )
}
