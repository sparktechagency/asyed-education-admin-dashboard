import { Form, Input, message, Modal, Spin, Upload } from "antd";
import JoditEditor from "jodit-react";
import { useEffect, useState, useRef } from "react";
import { useUpdateBlogMutation } from "../redux/api/blogApi";


const EditBlog = ({ editModal, setEditModal, selectedBlog }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const editor = useRef(null);

  const [updateBlog] = useUpdateBlogMutation();

  const config = {
    readonly: false,
    height: 200,
  };

  // Handle file list change
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Preview image
  const onPreview = async (file) => {
    let src = file.url;
    if (!src && file.originFileObj) {
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

  // Populate form when modal opens
  useEffect(() => {
    if (editModal && selectedBlog) {
      form.setFieldsValue({
        title: selectedBlog.title,
      });
      setContent(selectedBlog.content || ""); // backend uses 'content'
      setFileList(
        selectedBlog.image
          ? [
              {
                uid: "-1",
                name: "current-image.png",
                status: "done",
                url: selectedBlog.image, // existing image URL
              },
            ]
          : []
      );
    }
  }, [editModal, selectedBlog, form]);

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setContent("");
    setEditModal(false);
  };

  const handleSubmit = async (values) => {
    if (!content || content.length < 10) {
      return message.error("Content must be at least 10 characters!");
    }

    if (!values.title || values.title.length < 3) {
      return message.error("Title must be at least 3 characters!");
    }

    if (!fileList[0]) {
      return message.error("Please select or upload an image!");
    }

    setLoading(true);

    try {
      // Decide image: URL or new file object
      const image = fileList[0].url || fileList[0].originFileObj;

      const updatedBlogData = {
        title: values.title,
        content: content,
        image: image, // backend should handle string URL or file upload
      };

      console.log("Submitting updated blog:", updatedBlogData);

      const response = await updateBlog({
        id: selectedBlog._id,
        data: updatedBlogData,
      }).unwrap();

      if (response?.success) {
        message.success(response?.message || "Blog updated successfully!");
        handleCancel();
      } else {
        message.error(response?.message || "Failed to update blog");
      }
    } catch (error) {
      console.error(error);
      message.error(error?.data?.message || "Failed to update blog");
    } finally {
      setLoading(false);
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
        <div className="font-bold text-center mb-6 text-lg">Edit Blog</div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="px-2"
        >
          {/* Image Upload */}
          <Form.Item label="Image">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              maxCount={1} // single image
            >
              {fileList.length < 1 && "+ Upload"}
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

          {/* Blog Content */}
          <Form.Item label="Content" required>
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
