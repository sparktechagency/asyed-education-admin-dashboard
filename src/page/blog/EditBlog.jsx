import { Form, Input, message, Modal, Spin, Upload } from "antd";
import JoditEditor from "jodit-react";
import React, { useEffect, useState, useRef } from "react";
// import { useUpdateCategoryMutation } from "../redux/api/categoryApi";
// import { imageUrl } from "../redux/api/baseApi";

const EditBlog = ({ editModal, setEditModal, selectedBlog }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const editor = useRef(null);

  const config = {
    readonly: false,
    height: 200,
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  useEffect(() => {
    if (editModal && selectedBlog) {
      form.setFieldsValue({
        title: selectedBlog.title,
      });
      setContent(selectedBlog.description || "");
      setFileList(
        selectedBlog.images?.length
          ? selectedBlog.images.map((img, index) => ({
              uid: `-${index}`,
              name: `image-${index}.png`,
              status: "done",
              url: img, // if stored as full url
            }))
          : []
      );
    }
  }, [editModal, selectedBlog, form]);

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

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setContent("");
    setEditModal(false);
  };

  const handleSubmit = async (values) => {
    if (!content) {
      message.error("Please enter blog description!");
      return;
    }

    const updatedBlogData = {
      title: values.title,
      description: content,
      images: fileList.map((file) => file.originFileObj || file.url),
    };

    console.log("Updated Blog Data:", updatedBlogData);
    message.success("Blog updated successfully!");
    handleCancel();
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
        <div className="font-bold text-center mb-6 text-lg">Edit Blog</div>

        <Form form={form} layout="vertical" onFinish={handleSubmit} className="px-2">
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
              {loading ? <Spin size="small" /> : "Update Blog"}
            </button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default EditBlog;
