import { Form, Input, message, Modal, Spin, Upload } from "antd";
import JoditEditor from "jodit-react";
import React, { useState, useRef } from "react";

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

const AddBlog = ({ openAddModal, setOpenAddModal }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const editor = useRef(null);

  const config = {
    readonly: false, // editable
    height: 200,
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setContent("");
    setOpenAddModal(false);
  };

  const handleSubmit = async (values) => {
    if (!content) {
      message.error("Please enter blog description!");
      return;
    }

    const blogData = {
      title: values.title,
      description: content,
      images: fileList.map((file) => file.originFileObj),
    };

    console.log("Submitted Blog Data:", blogData);
    message.success("Blog added successfully!");
    form.resetFields();
    setFileList([]);
    setContent("");
    setOpenAddModal(false);
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
        <div className="font-bold text-center mb-6 text-lg">+ Add Blog</div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="px-2"
        >
          {/* Image Upload */}
          <Form.Item label="Images">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              multiple
            >
              {fileList.length < 5 && "+ Upload"}
            </Upload>
          </Form.Item>

          {/* Blog Title */}
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter title!" }]}
          >
            <Input placeholder="Enter title" style={{ height: "40px" }} />
          </Form.Item>

          {/* Blog Description */}
          <Form.Item label="Description" required>
            <JoditEditor
              ref={editor}
              value={content}
              config={config}
              tabIndex={1}
              onBlur={(newContent) => setContent(newContent)}
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-2 bg-[#004F44] text-white rounded-md flex justify-center items-center gap-2"
            >
              {loading ? <Spin size="small" /> : "Add Blog"}
            </button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddBlog;
