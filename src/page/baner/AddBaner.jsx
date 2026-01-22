import { Form, Input, message, Modal, Spin, Upload } from "antd";
import React, { useState } from "react";
import { useAddBannerMutation } from "../redux/api/bannerApi";

const AddBaner = ({ openAddModal, setOpenAddModal }) => {

  const [addBanner, { isLoading }] = useAddBannerMutation();

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setOpenAddModal(false);
  };


const handleSubmit = async (values) => {
  if (!values.title || values.title.length < 3) {
    return message.error("Title must be at least 3 characters!");
  }

  if (!fileList.length || !fileList[0]?.originFileObj) {
    return 
  }

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("file", fileList[0].originFileObj);

    const response = await addBanner(formData).unwrap();

    if (response?.success) {
      message.success(response?.message || "Banner added successfully!");
      form.resetFields();
      setFileList([]);
      setOpenAddModal(false);
    } else {
      message.error(response?.message || "Failed to add banner");
    }

  } catch (error) {
    console.error(error);
    message.error(error?.data?.message || "Failed to add banner");
  } finally {
    setLoading(false);
  }
};



  // const handleSubmit = async (values) => {
  //   // Placeholder: values.title, values.description, fileList[0] (video file)
  //   console.log("Submitted values:", values, fileList);
  //   message.success("Video added successfully!");
  //   form.resetFields();
  //   setFileList([]);
  //   setOpenAddModal(false);
  // };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const video = document.createElement("video");
    video.src = src;
    video.controls = true;
    const win = window.open(src);
    win?.document.write(video.outerHTML);
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
        <div>
          <div className="font-bold text-center mb-6">+ Add Banner</div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="px-2"
          >
            {/* Title */}
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please input title!" }]}
            >
              <Input placeholder="Enter title" style={{ height: "40px" }} />
            </Form.Item>

     

            {/* Video Upload */}
            <Form.Item label="Upload Video">
              <Upload
                listType="picture"
                fileList={fileList}
                onChange={onChange}
                onPreview={onPreview}
                maxCount={1}
                beforeUpload={()=>false}
                accept="video/*"
              >
                {fileList.length < 1 && (
                  <button className="bg-[#007BFF] text-white px-3 py-1 rounded">
                    + Upload Video
                  </button>
                )}
              </Upload>
            </Form.Item>

            {/* Save Button */}
            <Form.Item>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 mt-2 bg-[#004F44] text-white rounded-md"
              >
                {loading ? <Spin size="small" /> : "Add Video"}
              </button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default AddBaner;
