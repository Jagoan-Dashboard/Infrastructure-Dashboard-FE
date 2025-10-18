

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
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      
      const response = await LoginService.login({
        identifier: data.email, 
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
      
    } catch (error: any) {
      console.error('Login error:', error);

      
      if (error.response?.status === 401) {
        
        setError('email', {
          type: 'manual',
          message: 'Email atau password salah'
        });
        setError('password', {
          type: 'manual',
          message: 'Email atau password salah'
        });
        
        toast.error('Login Gagal', {
          description: 'Email atau password yang Anda masukkan salah'
        });
      } else if (error.response?.status === 422) {
        
        toast.error('Validasi Gagal', {
          description: error.response?.data?.message || 'Data yang Anda masukkan tidak valid'
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