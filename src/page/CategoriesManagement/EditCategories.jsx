import { Form, Input, message, Modal, Spin, Upload } from "antd";
import React, { useEffect, useState } from "react";



const EditCategories = ({ editModal, setEditModal, selectedCategory }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
 

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };


  useEffect(() => {
    if (editModal && selectedCategory) {
      form.setFieldsValue({
        name: selectedCategory?.name,
      });

      setFileList([
        {
          uid: "-1",
          name: "category-image.png",
          status: "done",
          url: `${selectedCategory?.imageUrl}`,
        },
        
      ]);
    }
  }, [editModal, selectedCategory, form]);

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
    setEditModal(false);
  };

  const handleSubmit = async (values) => {
    // setLoading(true);
    // try {
    //   const formData = new FormData();
    //   if (fileList.length && fileList[0].originFileObj) {
    //     formData.append("image", fileList[0].originFileObj);
    //   }
    //   formData.append("name", values.name);

    //   const res = await updateCategory({ formData, id: selectedCategory?._id });
    //   message.success(res?.data?.message || "Updated successfully");
    //   setEditModal(false);
    // } catch (error) {
    //   console.error(error);
    //   message.error(error?.data?.message || "Update failed");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <Modal
      centered
      open={editModal}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose 
    >
      <div className="mb-20 mt-4">
        <div className="font-bold text-center mb-11">Edit Category</div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="px-2"
        >
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Please input title" }]}
          >
            <Input placeholder="Enter title" style={{ height: "40px" }} />
          </Form.Item>

          <Form.Item label="Photos">
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

          <Form.Item>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-2 bg-[#004F44] text-white rounded-md"
            >
              {loading ? <Spin size="small" /> : "Update"}
            </button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default EditCategories;
