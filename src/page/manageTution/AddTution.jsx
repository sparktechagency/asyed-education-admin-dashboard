import { Form, Input, message, Modal, Spin, Upload, DatePicker, TimePicker, Select } from "antd";
import React, { useState } from "react";
import dayjs from "dayjs";
import { useAddTutorsMutation } from "../redux/api/parantsApi";
import { useGetAllSubjectQuery } from "../redux/api/subjectApi";

const onPreview = async (file) => {
  let src = file.url;
  if (!src) {
    src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => resolve(reader.result);
    });
  }
  const image = new Image();
  image.src = src;
  const imgWindow = window.open(src);
  imgWindow?.document.write(image.outerHTML);
};

const AddTution = ({ openAddModal, setOpenAddModal }) => {

  
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);


  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setOpenAddModal(false);
  };

  const handleSubmit = async (values) => {
    console.log("Submitted values:", values);
    console.log("Uploaded image files:", fileList);

    message.success("Tuition added successfully!");
    form.resetFields();
    setFileList([]);
    setOpenAddModal(false);
  };

  return (
    <Modal centered open={openAddModal} onCancel={handleCancel} footer={null} width={600}>
      <div className="mb-4 mt-4">
        <div className="font-bold text-center mb-6 text-lg">+ Add Tuition</div>

        <Form form={form} layout="vertical" onFinish={handleSubmit} className="px-2">

          {/* Tuition Name */}
          <Form.Item
            label="Tuition Name"
            name="tutionName"
            rules={[{ required: true, message: "Please enter tuition name!" }]}
          >
            <Input placeholder="Enter tuition name" style={{ height: 40 }} />
          </Form.Item>

          {/* Subject */}
          <Form.Item
            label="Subject"
            name="subject"
            rules={[{ required: true, message: "Please enter subject!" }]}
          >
            <Input placeholder="Enter subject" style={{ height: 40 }} />
          </Form.Item>

          {/* Teacher Location */}
          <Form.Item
            label="Teacher Location"
            name="teacherLocation"
            rules={[{ required: true, message: "Please enter teacher location!" }]}
          >
            <Input placeholder="Enter teacher location" style={{ height: 40 }} />
          </Form.Item>

          {/* Date */}
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker
              style={{ width: "100%", height: 40 }}
              format="DD-MM-YYYY"
            />
          </Form.Item>

          {/* Time */}
          <Form.Item
            label="Time"
            name="time"
            rules={[{ required: true, message: "Please select time!" }]}
          >
            <TimePicker
              style={{ width: "100%", height: 40 }}
              format="hh:mm A"
            />
          </Form.Item>

          {/* Service */}
          <Form.Item
            label="Service"
            name="service"
            rules={[{ required: true, message: "Please select a service type!" }]}
          >
            <Select placeholder="Select service" style={{ height: 40 }}>
              <Select.Option value="home">Home Tuition</Select.Option>
              <Select.Option value="online">Online Tuition</Select.Option>
              <Select.Option value="group">Group Tuition</Select.Option>
            </Select>
          </Form.Item>

          {/* Image Upload */}
          <Form.Item label="Image">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              multiple={false}
            >
              {fileList.length < 1 && "+ Upload"}
            </Upload>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
          <button
              type="submit"
              // disabled={isLoading}
              className={`
                w-full py-3 flex items-center justify-center gap-3
                bg-green-700 text-white rounded
                hover:bg-green-800 disabled:bg-green-800/60
                transition-all font-medium
              `}
            >
              Continue
              {/* {isLoading ? (
                <>
                  <span className="raw-spinner"></span>
                  Signing in...
                 
                </>
              ) : (
                "Continue"
              )} */}
            </button>
          </Form.Item>

        </Form>
      </div>
    </Modal>
  );
};

export default AddTution;
