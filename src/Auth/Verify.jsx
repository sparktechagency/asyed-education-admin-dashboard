import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import { useForgotPasswordMutation, useVerifyOtpMutation } from "../page/redux/api/userApi";


const Verify = () => {
  
  const [form] = Form.useForm()
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation()
  const [forgotPassword, { isLoading: isResending }] = useForgotPasswordMutation()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  useEffect(() => {
    const storedEmail = localStorage.getItem("forgotPasswordEmail")
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      message.warning("Email not found. Please try forgot password again.")
      navigate("/forgot-password")
    }
  }, [navigate])

  const onFinish = async (values) => {
    if (!email) {
      message.error("Email is required. Please go back and try again.")
      return
    }

    const payload = {
      email,
      otp: values.otp, 
    }

    try {
      const res = await verifyOtp(payload).unwrap()
      console.log(res)
       localStorage.setItem("token", res?.data?.resetToken);
      message.success(res?.message || "Verification successful!")
    
      

      navigate("/reset-password")
    } catch (err) {
      const errorMsg =
        err?.data?.message ||
        err?.data?.error ||
        "Invalid or expired OTP. Please try again."
      message.error(errorMsg)
    }
  }

  const handleResend = async () => {
    if (!email) {
      message.error("Email not found. Please try forgot password again.")
      return
    }

    try {
      await forgotPassword({ email }).unwrap()
      message.success("A new OTP has been sent to your email!")
    } catch (err) {
      const errorMsg =
        err?.data?.message ||
        "Failed to resend OTP. Please try again later."
      message.error(errorMsg)
    }
  }

  return (
   <div className="flex justify-center items-center min-h-screen px-4 lg:px-0">
      <div className="w-full max-w-lg  p-8 border">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Check your email
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          We sent a reset link to foisalrk2@gmail.com. Enter the 5-digit code
          mentioned in the email.
        </p>

        {/* Ant Design Form */}
        <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            className="relative space-y-6"
          >
            <div className="text-center text-gray-600 mb-4">
              Enter the 6-digit code sent to <strong>{email || "your email"}</strong>
            </div>

            <Form.Item
              name="otp"
              rules={[
                {
                  required: true,
                  message: "Please enter the verification code!",
                },
                {
                  len: 6,
                  message: "Code must be 6 digits!",
                },
              ]}
            >
              <Input.OTP
                length={6}
                size="large"
                className="justify-center"
                // Optional: formatter={(value) => value} → default is fine
              />
            </Form.Item>

            <div className="flex justify-between items-center text-sm">
              <p className="text-neutral-400">Didn't receive code?</p>
              <Button
                type="link"
                onClick={handleResend}
                loading={isResending}
                disabled={isResending}
                className="text-orange-500 hover:text-orange-600 p-0"
              >
                Resend
              </Button>
            </div>

            <Form.Item className="mb-0">
              <button
  type="submit"
  disabled={isVerifying}
  className={`
    w-full py-3 flex items-center justify-center gap-3
    bg-green-700 text-white rounded
    hover:bg-green-800 disabled:bg-green-800/60
    transition-all font-medium
  `}
>
  {isVerifying ? (
    <>
      <span className="raw-spinner"></span>
     Verifing...
    </>
  ) : (
    "Verify"
  )}

 
</button>
            </Form.Item>

            <div className="text-center text-sm text-gray-600 mt-6">
              <Link href="/signIn" className="text-blue-600 hover:underline">
                Back to Login
              </Link>
            </div>
          </Form>
        <span className="flex justify-center mt-4">
          You have not received the email?{" "}
          <span
            // onClick={handleResend}
            className="text-[#D17C51] cursor-pointer pl-2"
          >
            Resend
          </span>
        </span>
      </div>
    </div>
  );
};

export default Verify;
