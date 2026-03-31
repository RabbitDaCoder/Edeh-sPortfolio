import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
export function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(loginSchema),
    });
    const onSubmit = async (data) => {
        setError("");
        setLoading(true);
        try {
            const res = await apiClient.post("auth/login", data);
            const { accessToken, refreshToken } = res.data.data;
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            navigate("/", { replace: true });
        }
        catch (err) {
            setError(err.response?.data?.error?.message ||
                "Invalid credentials. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-background px-4", children: _jsxs("div", { className: "w-full max-w-sm space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-3xl font-display font-semibold text-text-primary", children: "ECD Dashboard" }), _jsx("p", { className: "text-sm text-text-muted mt-2", children: "Sign in to manage your portfolio" })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-5", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-text-primary mb-1.5", children: "Email" }), _jsx("input", { type: "email", ...register("email"), className: "input-field", placeholder: "you@example.com", autoComplete: "email" }), errors.email && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.email.message }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-text-primary mb-1.5", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPassword ? "text" : "password", ...register("password"), className: "input-field pr-10", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", autoComplete: "current-password" }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary", tabIndex: -1, children: showPassword ? (_jsx(EyeOff, { className: "w-4 h-4" })) : (_jsx(Eye, { className: "w-4 h-4" })) })] }), errors.password && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.password.message }))] }), error && (_jsx("div", { className: "text-sm text-red-500 bg-red-500/5 border border-red-500/20 rounded-sm px-3 py-2", children: error })), _jsxs("button", { type: "submit", disabled: loading, className: "w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50", children: [_jsx(LogIn, { className: "w-4 h-4" }), loading ? "Signing in..." : "Sign In"] })] })] }) }));
}
//# sourceMappingURL=index.js.map