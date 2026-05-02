"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { loginSchema, type LoginFormData } from "@/lib/utils/validators";
import { cn } from "@/lib/utils/cn";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");

      // Redirect based on role
      const user = useAuthStore.getState().user;
      console.log("Logged in user:", user);
      if (user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/user");
      }

      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    }
  };

  // Quick login for demo
  const handleDemoLogin = async (role: "admin" | "user") => {
    try {
      const credentials =
        role === "admin"
          ? { email: "admin@stylegen.com", password: "admin123" }
          : { email: "jane@example.com", password: "user123" };

      await login(credentials.email, credentials.password);
      toast.success(`Logged in as ${role}`);

      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/user");
      }

      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold">
                <span className="text-gray-900">Style</span>
                <span className="text-orange-500">Gen</span>
              </h1>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-500">
              Enter your credentials to access your artisan portal.
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin("admin")}
                className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <span className="block font-semibold">Admin</span>
                <span className="block text-gray-500">admin@stylegen.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("user")}
                className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <span className="block font-semibold">Customer</span>
                <span className="block text-gray-500">jane@example.com</span>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  {...register("email")}
                  className={cn(
                    "block w-full pl-10 pr-3 py-3 border rounded-lg",
                    "placeholder:text-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-offset-0",
                    errors.email
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-orange-500 focus:border-orange-500",
                  )}
                  onChange={() => {
                    if (error) clearError();
                  }}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                PASSWORD
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={cn(
                    "block w-full pl-10 pr-12 py-3 border rounded-lg",
                    "placeholder:text-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-offset-0",
                    errors.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-orange-500 focus:border-orange-500",
                  )}
                  onChange={() => {
                    if (error) clearError();
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  Keep me signed in for 30 days
                </span>
              </label>

              <Link
                href="/forgot-password"
                className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full flex items-center justify-center px-6 py-3",
                "text-base font-semibold text-white",
                "bg-orange-500 hover:bg-orange-600",
                "rounded-lg shadow-sm",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500",
                "transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "group",
              )}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield className="h-4 w-4 text-green-500" />
            <span>SECURE ACCESS</span>
          </div>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            New to StyleGen?{" "}
            <Link
              href="/register"
              className="font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Decorative/Image */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-orange-500 to-orange-700">
        <div className="flex items-center justify-center p-12 w-full">
          <div className="max-w-lg text-center">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-white mb-4 font-display">
                Premium Leather Goods
              </h2>
              <p className="text-orange-100 text-lg leading-relaxed">
                Access your artisan portal to manage orders, track shipments,
                and discover our latest handcrafted collections.
              </p>
            </div>

            {/* Feature List */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-3">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">Secure</h3>
                <p className="text-orange-100 text-sm">256-bit encryption</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-1">Fast</h3>
                <p className="text-orange-100 text-sm">Instant access</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-1">Protected</h3>
                <p className="text-orange-100 text-sm">Your data is safe</p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-3">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-1">Private</h3>
                <p className="text-orange-100 text-sm">Your privacy matters</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
