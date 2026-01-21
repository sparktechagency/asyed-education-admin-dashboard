import { Form, Input, message, Modal } from "antd";
import React, { useState } from "react";
import { useAddSubjectMutation } from "../redux/api/subjectApi";

const AddSubject = ({ openAddModal, setOpenAddModal }) => {
  const [form] = Form.useForm();
  const [addSubject, { isLoading }] = useAddSubjectMutation();
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    setOpenAddModal(false);
  };

  const handleSubmit = async (values) => {
    if (!values.title) {
      message.error("Please enter the subject name!");
      return;
    }

    try {
      setLoading(true);
      // API payload
      const payload = { name: values.title };

      const response = await addSubject(payload).unwrap(); 
      console.log("API Response:", response);

      if (response?.success) {
        message.success(response?.message || "Subject added successfully!");
        form.resetFields();
        setOpenAddModal(false);
      } else {
        message.error(response?.message || "Failed to add subject!");
      }
    } catch (err) {
      console.error("Add Subject Error:", err);
      message.error(err?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      centered
      open={openAddModal}
      onCancel={handleCancel}
      footer={null}
      width={500}
    >
      <div className="mb-4 mt-4">
        <div className="font-bold text-center mb-6 text-lg">+ Add Subject</div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="px-2"
        >
          <Form.Item
            label="Subject Name"
            name="title"
            rules={[{ required: true, message: "Please enter subject name!" }]}
          >
            <Input placeholder="Enter subject name" style={{ height: "40px" }} />
          </Form.Item>

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

export default AddSubject;
