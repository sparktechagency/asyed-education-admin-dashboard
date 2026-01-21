import { Form, Input, message, Modal, Spin, DatePicker, TimePicker } from "antd";
import React, { useState } from "react";

const AddConsultation = ({ openAddModal, setOpenAddModal }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    setOpenAddModal(false);
  };

  const handleSubmit = async (values) => {
    console.log("Submitted Consultation:", values);

    message.success("Consultation added successfully!");
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
        <div className="font-bold text-center mb-6 text-lg">
          + Add Consultation
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="px-2"
        >
          {/* Admin Name */}
          <Form.Item
            label="Admin Name"
            name="adminName"
            rules={[{ required: true, message: "Please enter admin name!" }]}
          >
            <Input placeholder="Enter admin name" style={{ height: 40 }} />
          </Form.Item>

          {/* Meeting Date */}
          <Form.Item
            label="Meeting Date"
            name="meetingDate"
            rules={[{ required: true, message: "Please select meeting date!" }]}
          >
            <DatePicker
              style={{ width: "100%", height: 40 }}
              format="DD-MM-YYYY"
            />
          </Form.Item>

          {/* Meeting Time */}
          <Form.Item
            label="Meeting Time"
            name="meetingTime"
            rules={[{ required: true, message: "Please select meeting time!" }]}
          >
            <TimePicker
              style={{ width: "100%", height: 40 }}
              format="hh:mm A"
            />
          </Form.Item>

          {/* Meeting Link */}
          <Form.Item
            label="Meeting Link"
            name="meetingLink"
            rules={[{ required: true, message: "Please enter meeting link!" }]}
          >
            <Input
              placeholder="Enter meeting link"
              style={{ height: 40 }}
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-2 bg-[#004F44] text-white rounded-md flex justify-center items-center"
            >
              {loading ? <Spin size="small" /> : "Add Consultation"}
            </button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddConsultation;
