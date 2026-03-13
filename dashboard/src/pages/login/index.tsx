import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiClient } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { LogIn, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError("");
    setLoading(true);
    try {
      const res = await apiClient.post("auth/login", data);
      const { accessToken, refreshToken } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
          "Invalid credentials. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-display font-semibold text-text-primary">
            ECD Dashboard
          </h1>
          <p className="text-sm text-text-muted mt-2">
            Sign in to manage your portfolio
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="input-field"
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="input-field pr-10"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-500/5 border border-red-500/20 rounded-sm px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
