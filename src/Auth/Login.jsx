import React, { useState, useEffect } from "react";
import { Form, Input, Checkbox, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useLoginAdminMutation } from "../page/redux/api/userApi";
import { setToken } from "../page/redux/features/auth/authSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const [form] = Form.useForm();
  const [loginAdmin, { isLoading }] = useLoginAdminMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ On mount: load saved email & password if "remember me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    const savedPassword = localStorage.getItem("rememberPassword");

    if (savedEmail && savedPassword) {
      form.setFieldsValue({
        email: savedEmail,
        password: savedPassword,
        remember: true,
      });
    }
  }, [form]);

  const onFinish = async (values) => {
    setLoading(true);

    try {
      const payload = await loginAdmin({
        email: values.email,
        password: values.password,
      }).unwrap();

      if (payload?.success) {
        dispatch(setToken(payload?.data?.accessToken));
        message.success("Login successful!");

        // ✅ Handle Remember Me
        if (values.remember) {
          localStorage.setItem("rememberEmail", values.email);
          localStorage.setItem("rememberPassword", values.password);
        } else {
          localStorage.removeItem("rememberEmail");
          localStorage.removeItem("rememberPassword");
        }

        navigate("/");
      } else {
        message.error(payload?.message || "Login failed!");
      }
    } catch (err) {
      console.error("Login error:", err);
      message.error(err?.data?.message || "Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 lg:px-0 bg-gray-50">
      <div className="w-full max-w-lg lg:p-8 p-6 bg-white border rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign In</h2>
        <p className="text-gray-600 mb-8 text-sm">
          Enter your email address or choose a different way to sign in.
        </p>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ remember: false }}
        >
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              { type: "email", message: "Enter a valid email!" },
            ]}
          >
            <Input style={{ height: 50 }} placeholder="Enter Email Address" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password style={{ height: 50 }} placeholder="••••••••" />
          </Form.Item>

          <div className="flex items-center justify-between mb-6">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-gray-700">Remember me</Checkbox>
            </Form.Item>

            <Link
              to="/forgot-password"
              className="text-sm text-[#2F799E] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Form.Item>
            <button
              type="submit"
              disabled={loading || isLoading}
              className={`
                w-full py-3 flex items-center justify-center gap-3
                bg-green-700 text-white rounded
                hover:bg-green-800 disabled:bg-green-800/60
                transition-all font-medium
              `}
            >
              {loading || isLoading ? (
                <>
                  <span className="raw-spinner"></span>
                  Signing in...
                 
                </>
              ) : (
                "Continue"
              )}
            </button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
