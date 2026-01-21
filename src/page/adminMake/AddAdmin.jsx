import { Form, Input, message, Modal, Spin, Select } from "antd";
import React, { useState } from "react";

const { Option } = Select;

const AddAdmin = ({ openAddModal, setOpenAddModal }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    setOpenAddModal(false);
  };

  const handleSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    console.log("Submitted values:", values);
    message.success("Admin added successfully!");
    form.resetFields();
    setOpenAddModal(false);
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
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter name!" }]}
          >
            <Input placeholder="Enter Name" style={{ height: "40px" }} />
          </Form.Item>

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

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter password!" }]}
          >
            <Input.Password placeholder="Enter Password" style={{ height: "40px" }} />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[{ required: true, message: "Please confirm password!" }]}
          >
            <Input.Password placeholder="Confirm Password" style={{ height: "40px" }} />
          </Form.Item>

          <Form.Item
            label="User Type"
            name="userType"
            rules={[{ required: true, message: "Please select user type!" }]}
          >
            <Select placeholder="Select User Type" style={{ height: "40px" }}>
              <Option value="Super Admin">Super Admin</Option>
              <Option value="Admin">Admin</Option>
              <Option value="Moderator">Moderator</Option>
            </Select>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-2 bg-[#004F44] text-white rounded-md flex justify-center items-center gap-2"
            >
              {loading ? <Spin size="small" /> : "Add Admin"}
            </button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddAdmin;
