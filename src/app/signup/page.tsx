'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { callApiWithoutAuth } from '@/utils/api'
import { ApiResponse } from '@/types/interface'

type SignupData = {
  email: string
  password: string
  company_name?: string
  user_type: 'admin' | 'editor'
  parent_id?: number
}

export default function SignupPage() {
  const { login } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupData>()

  const onSubmit = async (data: SignupData) => {
    try {
      const res = (await callApiWithoutAuth('post', '/api/v1/auth/signup', data)) as ApiResponse
      const response = res?.data as { token: string };
      if (response?.token) {
        login(response.token)
        router.push('/dashboard')
      } else {
        alert('Signup failed — no token received')
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        alert((err as { message?: string }).message || 'Signup failed');
      } else {
        alert('Signup failed');
      }
    }
  }

  const userType = watch('user_type')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md p-6 rounded-lg w-full max-w-md space-y-4"
        style={{color:"black"}}
      >
        <h2 className="text-2xl font-bold text-center">Create Account</h2>

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

        <input
          type="text"
          placeholder="Company Name"
          {...register('company_name')}
          className="input"
        />

        <select {...register('user_type', { required: true })} className="input">
          <option value="">Select User Type</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
        </select>
        {errors.user_type && <p className="text-red-500">User type is required</p>}

        {userType === 'editor' && (
          <input
            type="number"
            placeholder="Parent Admin ID"
            {...register('parent_id', { required: true })}
            className="input"
          />
        )}

        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">
          Signup
        </button>
      </form>
    </div>
  )
}
