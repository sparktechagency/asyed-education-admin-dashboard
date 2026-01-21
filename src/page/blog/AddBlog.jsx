import { Form, Input, message, Modal, Spin, Upload } from "antd";
import JoditEditor from "jodit-react";
import React, { useState, useRef } from "react";
import { useAddBlogsMutation } from "../redux/api/blogApi";

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

  const [addBlog, {isLoading}] = useAddBlogsMutation();
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
  if (!content || content.length < 10) {
    return message.error("Content must be at least 10 characters!");
  }

  if (!values.title || values.title.length < 3) {
    return message.error("Title must be at least 3 characters!");
  }

  if (!fileList[0]) {
    return message.error("Please select an image!");
  }

  setLoading(true);

  try {
    
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", content);
    formData.append("image", fileList[0].originFileObj); 

    const response = await addBlog(formData).unwrap();

    if (response?.success) {
      message.success(response?.message || "Blog added successfully!");
      form.resetFields();
      setContent("");
      setFileList([]);
      setOpenAddModal(false);
    } else {
      message.error(response?.message || "Failed to add blog");
    }

  } catch (error) {
    console.error(error);
    message.error(error?.data?.message || "Failed to add blog");
  } finally {
    setLoading(false);
  }
};




// const handleSubmit = async (values) => {
//   if (!content || content.length < 10) {
//     return message.error("Content must be at least 10 characters!");
//   }

//   if (!values.title || values.title.length < 3) {
//     return message.error("Title must be at least 3 characters!");
//   }

//   if (!fileList[0]?.url) {
//     return message.error("Please select or upload an image first!");
//   }
//   console.log("Submitting with fileList:", fileList);

//   setLoading(true);

//   try {
    
//     const blogData = {
//       title: values.title,
//       content: content,
//       image: fileList[0].url, 
//     };
//     console.log("Blog Data to Submit:", blogData);

//     console.log("Submitting Blog Data:", blogData);

//     const response = await addBlog(blogData).unwrap();
//     console.log("Add Blog Response:", response);

//     if (response?.success) {
//       message.success(response?.message || "Blog added successfully!");
//       form.resetFields();
//       setContent("");
//       setFileList([]);
//       setOpenAddModal(false);
//     } else {
//       message.error(response?.message || "Failed to add blog");
//     }

//   } catch (error) {
//     console.error(error);
//     message.error(error?.data?.message || "Failed to add blog");
//   } finally {
//     setLoading(false);
//   }
// };




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
              disabled={isLoading || loading}
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
