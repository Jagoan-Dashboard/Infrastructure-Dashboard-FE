"use client";

import React from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2, Shield } from 'lucide-react';
import { cn } from "@/lib/utils";
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { loginSchema } from './service/validation';
import { useLogin } from './hooks/useLogin';



const LoginPage = () => {
  const {
    // State
    rememberMe,
    showPassword,
    isLoading,
    isSubmitting,
    errors,

    // Actions
    setRememberMe,
    setShowPassword,

    // Form methods
    register,
    handleSubmit,
    onSubmit,
    handleInputChange
  } = useLogin();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src={assets.imageBackgroundAuth}
          alt="Login Background"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background/20" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Selamat Datang Dashboard Kami
            </h1>
            <p className="text-lg opacity-90 max-w-md">
              Kelola data dan akses semua fitur dengan mudah melalui dashboard yang intuitif.
            </p>
            <div className="flex items-center space-x-4 text-sm opacity-75">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>•</span>
                <span>Repositori Data Besar (1.2 million+)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Header */}
          <div className="text-left space-y-6">
            <div className="flex items-center justify-start">
              <div className="flex items-start space-x-3">
                <div className=" flex justify-center items-center gap-2">
                  <Image
                    src={assets.imageLogoNgawi}
                    alt="Logo Ngawi"
                    width={50}
                    height={50}
                  />
                  <Image
                    src={assets.imageLogo}
                    alt="Logo Jagoan Satu Data"
                    width={200}
                    height={200}
                  />
                </div>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Selamat Datang!
              </h2>
              <p className="text-muted-foreground">
                Silahkan masukkan email yang sudah terdaftar
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  {...register('email', {
                    onChange: () => handleInputChange('email')
                  })}
                  className={cn(
                    "pl-4 pr-4 py-3 text-base transition-all duration-200 bg-background/50 backdrop-blur-sm",
                    "border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20",
                    "hover:border-border shadow-sm hover:shadow-md",
                    errors.email && "border-destructive focus:border-destructive focus:ring-destructive/20"
                  )}
                  placeholder="Enter your email"
                  disabled={isLoading || isSubmitting}
                  inputMode="email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive flex items-center space-x-1 animate-in slide-in-from-left-1 duration-200">
                  <span className="w-1 h-1 bg-destructive rounded-full" />
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register('password', {
                    onChange: () => handleInputChange('password')
                  })}
                  className={cn(
                    "pl-4 pr-12 py-3 text-base transition-all duration-200 bg-background/50 backdrop-blur-sm",
                    "border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20",
                    "hover:border-border shadow-sm hover:shadow-md",
                    errors.password && "border-destructive focus:border-destructive focus:ring-destructive/20"
                  )}
                  placeholder="Enter your password"
                  disabled={isLoading || isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive flex items-center space-x-1 animate-in slide-in-from-left-1 duration-200">
                  <span className="w-1 h-1 bg-destructive rounded-full" />
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="data-[state=checked]:bg-pink-400 data-[state=checked]:border-primar"
                  disabled={isLoading || isSubmitting}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium text-muted-foreground cursor-pointer"
                >
                  Remember me
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="bg-pink-400 hover:bg-pink-500 w-full py-3 text-base font-medium duration-200 disabled:opacity-50"
              disabled={isLoading || isSubmitting}
            >
              {(isLoading || isSubmitting) ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Masuk'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;