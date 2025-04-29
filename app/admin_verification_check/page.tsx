"use client";
// pages/admin-login.jsx
import { useState } from "react"
import { useRouter } from "next/navigation"


export default function AdminLoginPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const api_url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

  const loginAdmin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${api_url}/admin-login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      })

      const data = await res.json()
    
     

   
      if (res.ok && data.is_admin) {
        localStorage.setItem("token", data.access);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("user_interest", data.interest);
        localStorage.setItem("user_profile", data.profile);
        localStorage.setItem("has_plan", data.has_plan);
        localStorage.setItem("plan_name", data.plan_name);
        localStorage.setItem("total", data.property_count);
        localStorage.setItem("admin", "valid");
        router.push("/admin_dashboard")
      } else {
        setError(data.detail || "Login failed.")
      }
    } catch (err) {
      console.error("Login error:", err)
      localStorage.setItem("admin", "invalid");

      setError("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <form onSubmit={loginAdmin} className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Admin Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Username or Email</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
        >
          {loading ? "Logging in..." : "Login as Admin"}
        </button>
      </form>
    </div>
  )
}
