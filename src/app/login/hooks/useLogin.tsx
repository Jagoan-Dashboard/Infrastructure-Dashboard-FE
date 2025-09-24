// hooks/useLogin.ts
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../service/validation';
import { useRouter } from 'next/navigation';
import z from 'zod';

type LoginFormData = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      // Add your login logic here
      console.log('Login attempt:', { ...data, rememberMe });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Handle successful login
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error (bisa menggunakan toast notification)
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginFormData) => {
    // Clear specific field error when user starts typing
    if (errors[field]) {
      clearErrors(field);
    }
  };

  return {
    // State
    rememberMe,
    showPassword,
    isLoading,
    isSubmitting,
    errors,
    
    // Actions
    setRememberMe,
    setShowPassword,
    setIsLoading,
    
    // Form methods
    register,
    handleSubmit,
    onSubmit,
    handleInputChange
  };
};