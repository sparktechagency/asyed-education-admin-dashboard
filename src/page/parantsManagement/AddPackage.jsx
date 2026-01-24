import {
  Form,
  Input,
  message,
  Modal,
  Select,
  Tag,
  Divider,
  DatePicker,
  TimePicker,
} from "antd";
import React, { useState } from "react";
import dayjs from "dayjs";
import {
  useAddPackageMutation,
  useGetAllTutorsQuery,
} from "../redux/api/parantsApi";

const { Option } = Select;

const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const AddPackage = ({ openAddModal, setOpenAddModal, selectedParants }) => {
  const parentId = selectedParants?._id;

  const page = 1;
  const limit = 100;

  const { data: tutorData } = useGetAllTutorsQuery({ page, limit });
  const tutors = tutorData?.data || [];

  const [addPackage, { isLoading }] = useAddPackageMutation();

  const [form] = Form.useForm();
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availability, setAvailability] = useState({});

  const handleCancel = () => {
    form.resetFields();
    setAvailableSubjects([]);
    setAvailability({});
    setOpenAddModal(false);
  };

  // Tutor select
  const handleTutorChange = (tutorId) => {
    const tutor = tutors.find((t) => t._id === tutorId);
    if (!tutor) return;

    setAvailableSubjects(tutor.subjects || []);
    setAvailability(tutor.availability || {});
    form.setFieldsValue({ subjectId: undefined });
  };

  // Submit
  const handleSubmit = async (values) => {
    const payload = {
      parentId,
      tutorId: values.tutorId,
      subjectId: values.subjectId,
      childrenIds: values.childrenIds,
      durationInWeeks: Number(values.durationInWeeks),
      tuitionDays: values.tuitionDays,
    //   startDate: values.dateRange[0].format("YYYY-MM-DD"),
    //   endDate: values.dateRange[1].format("YYYY-MM-DD"),
      startTime: values.timeRange[0].format("hh:mm A"),
      endTime: values.timeRange[1].format("hh:mm A"),
      hourlyRate: Number(values.hourlyRate),
    };

    try {
      await addPackage(payload).unwrap();
      message.success("Tuition package added successfully!");
      handleCancel();
    } catch (error) {
      message.error(error?.data?.message || "Failed to add package");
    }
  };

  return (
    <Modal centered open={openAddModal} onCancel={handleCancel} footer={null} width={700}>
      <div className="mb-4 mt-4">
        <div className="font-bold text-center mb-6 text-lg">+ Add Tuition</div>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Parent */}
          <Form.Item label="Parent">
            <Input
              disabled
              value={`${selectedParants?.user?.firstName} ${selectedParants?.user?.lastName}`}
            />
          </Form.Item>

          {/* Children */}
          <Form.Item
            label="Children"
            name="childrenIds"
            rules={[{ required: true, message: "Select children" }]}
          >
            <Select mode="multiple" placeholder="Select children">
              {selectedParants?.children?.map((c) => (
                <Option key={c._id} value={c._id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Tutor */}
          <Form.Item
            label="Tutor"
            name="tutorId"
            rules={[{ required: true, message: "Select tutor" }]}
          >
            <Select placeholder="Select tutor" onChange={handleTutorChange}>
              {tutors.map((t) => (
                <Option key={t._id} value={t._id}>
                  {t.user.firstName} {t.user.lastName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Subject */}
          <Form.Item
            label="Subject"
            name="subjectId"
            rules={[{ required: true, message: "Select subject" }]}
          >
            <Select placeholder="Select subject" disabled={!availableSubjects.length}>
              {availableSubjects.map((s) => (
                <Option key={s._id} value={s._id}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Availability Preview */}
          {Object.keys(availability).length > 0 && (
            <>
              <Divider orientation="left">Tutor Availability</Divider>
              {Object.entries(availability).map(([day, times]) => (
                <div key={day} className="mb-2">
                  <strong className="capitalize">{day}:</strong>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {times.map((t, i) => (
                      <Tag color="green" key={i}>{t}</Tag>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Tuition Days */}
          <Form.Item
            label="Tuition Days"
            name="tuitionDays"
            rules={[{ required: true, message: "Select tuition days" }]}
          >
            <Select mode="multiple" placeholder="Select days">
              {DAYS.map((d) => (
                <Option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Date Range */}
          {/* <Form.Item
            label="Date Range"
            name="dateRange"
            rules={[{ required: true, message: "Select date range" }]}
          >
            <DatePicker.RangePicker className="w-full" />
          </Form.Item> */}

          {/* Time Range */}
          <Form.Item
            label="Time"
            name="timeRange"
            rules={[{ required: true, message: "Select time" }]}
          >
            <TimePicker.RangePicker className="w-full" use12Hours format="hh:mm A" />
          </Form.Item>

          {/* Duration */}
          <Form.Item
            label="Duration (Weeks)"
            name="durationInWeeks"
            rules={[{ required: true, message: "Enter duration" }]}
          >
            <Input type="number" />
          </Form.Item>

          {/* Hourly Rate */}
          <Form.Item
            label="Hourly Rate"
            name="hourlyRate"
            rules={[{ required: true, message: "Enter hourly rate" }]}
          >
            <Input type="number" />
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

export default AddPackage;
