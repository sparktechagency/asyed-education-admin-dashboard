import { Form, Input, message, Modal, Spin } from "antd";
import React, { useEffect } from "react";
import { useUpdateSubjectMutation } from "../redux/api/subjectApi";

const UpdateSubject = ({ editModal, setEditModal, selectedCategory, refetchSubjects }) => {
    console.log(selectedCategory)
  const [form] = Form.useForm();
  const [updateSubject, { isLoading }] = useUpdateSubjectMutation();

  // Populate form when modal opens
  useEffect(() => {
    if (editModal && selectedCategory) {
      form.setFieldsValue({
        name: selectedCategory.name,
      });
    }
  }, [editModal, selectedCategory, form]);

  const handleCancel = () => {
    form.resetFields();
    setEditModal(false);
  };

  const handleSubmit = async (values) => {
    try {
      const data = {
     
        name: values.name,
      };

      const res = await updateSubject({id:selectedCategory?._id, data}).unwrap();
      message.success(res.message || "Subject updated successfully!");
      handleCancel();

      // Refetch subjects table
      if (refetchSubjects) refetchSubjects();
    } catch (error) {
      console.error(error);
      message.error(error?.data?.message || "Failed to update subject");
    }
  };

  return (
    <Modal
      centered
      open={editModal}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnClose
    >
      <div className="mb-4 mt-4">
        <div className="font-bold text-center mb-6 text-lg">Edit Subject</div>

        <Form form={form} layout="vertical" onFinish={handleSubmit} className="px-2">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter Name!" }]}
          >
            <Input placeholder="Enter Name" style={{ height: "40px" }} />
          </Form.Item>

          <Form.Item>
          <button
              type="submit"
              disabled={ isLoading}
              className={`
                w-full py-3 flex items-center justify-center gap-3
                bg-green-700 text-white rounded
                hover:bg-green-800 disabled:bg-green-800/60
                transition-all font-medium
              `}
            >
              { isLoading ? (
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
    </Modal>
  );
};

export default UpdateSubject;
