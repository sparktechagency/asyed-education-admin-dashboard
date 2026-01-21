
import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../page/redux/api/userApi";

const ResetPass = () => {
    const [form] = Form.useForm()
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")

  // Read email & token from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("forgotPasswordEmail")
    const storedToken = localStorage.getItem("token") || ""

    if (storedEmail) setEmail(storedEmail)
    else {
      message.warning("Email not found. Please start the reset process again.")
      navigate("/forgot-password")
    }

    if (storedToken) setToken(storedToken)
    else {
      message.warning("Reset token missing. Please try again.")
      navigate("/forgot-password")
    }
  }, [navigate])

  const onFinish = async (values) => {
    if (!token) {
      message.error("Reset token missing. Cannot reset password.")
      return
    }

    const payload = {
      token: token,
      newPassword: values.newPassword,
    }

    try {
      await resetPassword(payload).unwrap()

      message.success(
        "Password reset successfully! Please login with your new password."
      )

      // Clean up localStorage
      localStorage.removeItem("forgotPasswordEmail")
      localStorage.removeItem("token")

      navigate("/login")
    } catch (err) {
      const errorMsg =
        err?.data?.message ||
        err?.data?.error ||
        "Failed to reset password. Please try again."
      message.error(errorMsg)
    }
  }
  return (
   <div className="flex justify-center items-center min-h-screen px-4 lg:px-0">
      <div className="w-full max-w-lg  lg:p-8 p-4 border">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Set a New Password
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          Secure your account by creating a new password.
        </p>

        {/* Ant Design Form */}
        <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            className="relative space-y-6"
          >
            {/* Optional: show email for context */}
            <div className="text-center text-gray-600 mb-4">
              Resetting password for <strong>{email || "your email"}</strong>
            </div>

            <Form.Item
              name="newPassword"
              label={
                <span className="text-sm font-semibold text-black flex items-center gap-1">
                  <span>🔑</span> New Password
                </span>
              }
              rules={[
                { required: true, message: "Please enter your new password!" },
                { min: 6, message: "Password must be at least 6 characters!" },
              ]}
              hasFeedback
            >
              <Input.Password size="large" placeholder="Enter new password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={
                <span className="text-sm font-semibold text-black flex items-center gap-1">
                  <span>✔</span> Confirm Password
                </span>
              }
              dependencies={["newPassword"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error("The two passwords do not match!"))
                  },
                }),
              ]}
            >
              <Input.Password size="large" placeholder="Re-enter new password" />
            </Form.Item>

            <Form.Item className="mb-0">
             <button
  type="submit"
  disabled={isLoading}
  className={`
    w-full py-3 flex items-center justify-center gap-3
    bg-green-700 text-white rounded
    hover:bg-green-800 disabled:bg-green-800/60
    transition-all font-medium
  `}
>
  {isLoading ? (
    <>
      <span className="raw-spinner"></span>
     Setting...
    </>
  ) : (
    "Submit"
  )}

 
</button>
            </Form.Item>

            <div className="text-center text-sm text-gray-600 mt-6">
              <Link href="/signIn" className="text-blue-600 hover:underline">
                Back to Login
              </Link>
            </div>
          </Form>

    
      </div>
    </div>
  );
};

export default ResetPass;
