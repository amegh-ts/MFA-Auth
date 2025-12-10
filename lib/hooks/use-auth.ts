"use client"

import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type { RegisterFormData, LoginFormData } from "@/lib/schemas/auth"

interface User {
  id: string
  email: string
  name: string
  createdAt?: string
}

export function useAuth() {
  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/user/me")
        return response.data.user as User
      } catch (error) {
        return null
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  } as UseQueryOptions<User | null>)

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const response = await apiClient.post("/auth/register", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiClient.post("/auth/login", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post("/auth/logout")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
      queryClient.clear()
    },
  })

  return {
    user,
    isLoadingUser,
    userError,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLogging: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  }
}
