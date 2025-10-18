

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../service/validation';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LoginService } from '../service/login-service';
import { toast } from 'sonner';
import z from 'zod';

type LoginFormData = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors,
    setError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      
      const response = await LoginService.login({
        username: data.username,
        password: data.password
      });

      
      if (response.success && response.data) {
        const { token, user, expires_in } = response.data;

        
        login(user, token);

        
        if (rememberMe) {
          const expiryTime = Date.now() + (expires_in * 1000);
          localStorage.setItem('token_expiry', expiryTime.toString());
        }

        
        toast.success('Login Berhasil!', {
          description: `Selamat datang, ${user.username}!`
        });

        
        router.push('/dashboard-admin');
      } else {
        
        toast.error('Login Gagal', {
          description: response.message || 'Terjadi kesalahan yang tidak terduga'
        });
      }
      
    } catch (error: unknown) {
      console.error('Login error:', error);

      interface ErrorWithResponse {
        response?: {
          status?: number;
          data?: { message?: string };
        };
      }

      const err = (error as ErrorWithResponse) || {};

      if (err.response?.status === 401) {
        
        setError('username', {
          type: 'manual',
          message: 'Username atau password salah'
        });
        setError('password', {
          type: 'manual',
          message: 'Username atau password salah'
        });
        
        toast.error('Login Gagal', {
          description: 'Username atau password yang Anda masukkan salah'
        });
      } else if (err.response?.status === 422) {
        
        toast.error('Validasi Gagal', {
          description: err.response?.data?.message || 'Data yang Anda masukkan tidak valid'
        });
      } else {
        
        toast.error('Login Gagal', {
          description: 'Tidak dapat terhubung ke server. Silakan coba lagi.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginFormData) => {
    
    if (errors[field]) {
      clearErrors(field);
    }
  };

  return {
    
    rememberMe,
    showPassword,
    isLoading,
    isSubmitting,
    errors,
    
    
    setRememberMe,
    setShowPassword,
    
    
    register,
    handleSubmit,
    onSubmit,
    handleInputChange
  };
};