import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebookF } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../page/redux/api/userApi";


const ForgetPass = () => {
  const [forgetPass , { isLoading }] = useForgotPasswordMutation()
  const [form] = Form.useForm();

  const navigate = useNavigate()

  const onFinish = async (values) => {
    const payload = {
      email: values.email,
    };

    try {
      await forgetPass(payload).unwrap();

      localStorage.setItem("forgotPasswordEmail", values.email);

      message.success("Password reset link/code sent to your email!");

      // Redirect to verification/OTP page
      navigate("/verification");
    } catch (err) {
      const errorMsg =
        err?.data?.message ||
        err?.data?.error ||
        "Failed to send reset request. Please try again.";
      message.error(errorMsg);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen px-4 lg:px-0">
      <div className="w-full max-w-lg  lg:p-8 p-4 border">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign In</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Enter your email address or choose a different way to sign in to
          Custom Ink.
        </p>

        {/* Ant Design Form */}
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Email */}
          <Form.Item
            label="Enter Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Enter a valid email!" },
            ]}
          >
            <Input style={{height:'50px'}} placeholder="Enter Email Address" />
          </Form.Item>

       

          {/* Continue Button */}
          <Form.Item>
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
                    Forgor Pass...
                  </>
                ) : (
                  "Forget Pass"
                )}
              </button>
          </Form.Item>
        </Form>

        {/* Terms */}
      
      </div>
    </div>
  );
};

export default ForgetPass;
