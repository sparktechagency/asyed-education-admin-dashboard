import { Form, Input, message, Modal } from "antd";
import React from "react";
import { useAddAdminMutation } from "../redux/api/adminApi";

const AddAdmin = ({ openAddModal, setOpenAddModal }) => {
  const [addAdmin, { isLoading }] = useAddAdminMutation();
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    setOpenAddModal(false);
  };

  const handleSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    try {
      // Prepare the payload
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      };

      // Call the API
           const res = await addAdmin(payload).unwrap();

      message.success(res?.data?.message || "Admin added successfully!");
      form.resetFields();
      setOpenAddModal(false);
    } catch (error) {
      console.error(error);
      message.error(
        error?.data?.message || "Failed to add admin. Please try again."
      );
    }
  };

  return (
    <Modal
      centered
      open={openAddModal}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <div className="mb-4 mt-4">
        <div className="font-semibold text-center mb-6 text-xl">+ Add Admin</div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="px-2"
        >
          {/* First Name */}
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please enter first name!" }]}
          >
            <Input placeholder="Enter First Name" style={{ height: "40px" }} />
          </Form.Item>

          {/* Last Name */}
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please enter last name!" }]}
          >
            <Input placeholder="Enter Last Name" style={{ height: "40px" }} />
          </Form.Item>

          {/* Email */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email!" },
              { type: "email", message: "Enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter Email" style={{ height: "40px" }} />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter password!" }]}
          >
            <Input.Password
              placeholder="Enter Password"
              style={{ height: "40px" }}
            />
          </Form.Item>

          {/* Confirm Password */}
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[{ required: true, message: "Please confirm password!" }]}
          >
            <Input.Password
              placeholder="Confirm Password"
              style={{ height: "40px" }}
            />
          </Form.Item>

          {/* Submit Button */}
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
                  Adding...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddAdmin;
