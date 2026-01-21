import { Form, Input, message, Modal, Select, TimePicker, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useUpdateTutorMutation } from "../redux/api/parantsApi";
import { useGetAllSubjectQuery } from "../redux/api/subjectApi";
import dayjs from "dayjs";

const { Option } = Select;

const UpdateTutor = ({ editModal, setEditModal, selectedTutor, refetchTutors }) => {
  const [form] = Form.useForm();
  const { data: apiData } = useGetAllSubjectQuery();
  const subjects = apiData?.data || [];
  const [updateTutor, { isLoading }] = useUpdateTutorMutation();

  const [availability, setAvailability] = useState({});
  const daysOfWeek = [
    "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
  ];

  // Populate form and availability when modal opens
  useEffect(() => {
    if (editModal && selectedTutor) {
      form.setFieldsValue({
        firstName: selectedTutor.user.firstName,
        lastName: selectedTutor.user.lastName,
        email: selectedTutor.user.email,
        subjects: selectedTutor.subjects.map((s) => s._id),
        bio: selectedTutor.bio,
        qualifications: selectedTutor.qualifications || [],
      });

      setAvailability(selectedTutor.availability || {});
    }
  }, [editModal, selectedTutor, form]);

  const handleCancel = () => {
    form.resetFields();
    setAvailability({});
    setEditModal(false);
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
       
        subjects: values.subjects,
        bio: values.bio,
        qualifications: values.qualifications || [],
        availability,
      };

      const res = await updateTutor({ id: selectedTutor._id, data: payload }).unwrap();
      message.success(res.message || "Tutor updated successfully!");
      handleCancel();

      if (refetchTutors) refetchTutors();
    } catch (error) {
      console.error(error);
      message.error(error?.data?.message || "Failed to update tutor");
    }
  };

  return (
    <Modal
      centered
      open={editModal}
      onCancel={handleCancel}
      footer={null}
      width={700}
      destroyOnClose
    >
      <div className="mb-4 mt-4">
        <div className="font-bold text-center mb-6 text-lg">Edit Tutor</div>

        <Form form={form} layout="vertical" onFinish={handleSubmit} className="px-2">
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please enter first name!" }]}
          >
            <Input disabled placeholder="First Name" style={{ height: "40px" }} />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please enter last name!" }]}
          >
            <Input disabled placeholder="Last Name" style={{ height: "40px" }} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
          >
            <Input disabled style={{ height: "40px", backgroundColor: "#f5f5f5" }} />
          </Form.Item>

          <Form.Item
            label="Subjects"
            name="subjects"
            rules={[{ required: true, message: "Please select at least one subject!" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select subjects"
              style={{ width: "100%" }}
            >
              {subjects.map((s) => (
                <Option key={s._id} value={s._id}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Bio" name="bio">
            <Input.TextArea placeholder="Bio" rows={3} />
          </Form.Item>

          <Form.Item
            label="Qualifications"
            name="qualifications"
            tooltip="Type each qualification and press Enter. Remove any by clicking x."
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Add qualifications"
            />
          </Form.Item>

          <Form.Item label="Availability">
            {daysOfWeek.map((day) => (
              <div key={day} className="mb-2">
                <strong className="capitalize">{day}:</strong>
                <Space className="ml-2">
                  <TimePicker.RangePicker
  format="HH:mm"
  value={
    availability[day]
      ? [
          dayjs(availability[day][0], "HH:mm"),
          dayjs(availability[day][1], "HH:mm"),
        ]
      : undefined // <-- use undefined instead of null
  }
  onChange={(times) => {
    setAvailability((prev) => {
      const updated = { ...prev };
      if (times) {
        // Set times if selected
        updated[day] = [times[0].format("HH:mm"), times[1].format("HH:mm")];
      } else {
        // Remove day key if cleared to prevent Invalid Date
        delete updated[day];
      }
      return updated;
    });
  }}
/>

                </Space>
              </div>
            ))}
          </Form.Item>

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
              {isLoading ? "Updating..." : "Update Tutor"}
            </button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default UpdateTutor;
