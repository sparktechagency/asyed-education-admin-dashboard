import {
  Form,
  Input,
  message,
  Modal,
  Select,
  TimePicker,
  Button,
  Space,
  Tag,
} from "antd";
import React, { useState } from "react";
import { useAddTutorsMutation } from "../redux/api/parantsApi";
import { useGetAllSubjectQuery } from "../redux/api/subjectApi";
import dayjs from "dayjs";

const { Option } = Select;

const AddTutor = ({ openAddModal, setOpenAddModal, refetchTutors }) => {
  const [form] = Form.useForm();
  const { data: apiData } = useGetAllSubjectQuery();
  const subjects = apiData?.data || [];

  const [addTutors, { isLoading }] = useAddTutorsMutation();
  const [availability, setAvailability] = useState({});

  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const handleCancel = () => {
    form.resetFields();
    setAvailability({});
    setOpenAddModal(false);
  };

  const handleSubmit = async (values) => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      subjects: values.subjects,
      bio: values.bio || "",
      qualifications: values.qualifications || [],
      availability,
    };

    try {
      const res = await addTutors(payload).unwrap();
      message.success(res.message || "Tutor added successfully!");
      handleCancel();
      if (refetchTutors) refetchTutors();
    } catch (error) {
      console.error(error);
      message.error(error?.data?.message || "Failed to add tutor");
    }
  };

  return (
    <Modal
      centered
      open={openAddModal}
      onCancel={handleCancel}
      footer={null}
      width={700}
    >
      <div className="mb-4 mt-4">
        <div className="font-bold text-center mb-6 text-lg">+ Add Tutor</div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="px-2"
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please enter first name!" }]}
          >
            <Input placeholder="First Name" style={{ height: "40px" }} />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please enter last name!" }]}
          >
            <Input placeholder="Last Name" style={{ height: "40px" }} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email!" },
              { type: "email", message: "Enter a valid email!" },
            ]}
          >
            <Input placeholder="Email" style={{ height: "40px" }} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter password!" }]}
          >
            <Input.Password placeholder="Password" style={{ height: "40px" }} />
          </Form.Item>

          <Form.Item
            label="Subjects"
            name="subjects"
            rules={[
              {
                required: true,
                message: "Please select at least one subject!",
              },
            ]}
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

          {/* User-friendly Qualifications */}
          <Form.Item
            label="Qualifications"
            name="qualifications"
            tooltip="Type each qualification and press Enter. You can remove any by clicking the x."
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Add qualifications (Press Enter after each)"
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
                        : null
                    }
                    onChange={(times) => {
                      setAvailability((prev) => {
                        const updated = { ...prev };
                        if (times) {
                          // Set times if selected
                          updated[day] = [
                            times[0].format("HH:mm"),
                            times[1].format("HH:mm"),
                          ];
                        } else {
                          // Remove the day key if cleared
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

export default AddTutor;
