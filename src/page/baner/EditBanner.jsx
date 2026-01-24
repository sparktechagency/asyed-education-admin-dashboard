import { Form, Input, message, Modal, Spin, Upload } from "antd";
import { useEffect, useState } from "react";
import { useUpdateBannerMutation } from "../redux/api/bannerApi";

const EditBanner = ({ editModal, setEditModal, selectedVideo }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [updateBanner] = useUpdateBannerMutation();

  // Handle file selection
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1)); // only keep last file
  };

  // Set initial values when modal opens
  useEffect(() => {
    if (editModal && selectedVideo) {
      form.setFieldsValue({
        title: selectedVideo.title,
      });

      setFileList(
        selectedVideo.videoUrl
          ? [
              {
                uid: "-1",
                name: "current-banner.mp4",
                status: "done",
                url: selectedVideo.videoUrl,
              },
            ]
          : []
      );
    }
  }, [editModal, selectedVideo, form]);


  useEffect(() => {
    if (fileList[0]?.originFileObj) {
      const url = URL.createObjectURL(fileList[0].originFileObj);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (fileList[0]?.url) {
      setPreviewUrl(fileList[0].url);
    } else {
      setPreviewUrl(null);
    }
  }, [fileList]);


  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setEditModal(false);
  };

  // Submit form
  const handleSubmit = async (values) => {
    if (!values.title || values.title.length < 3) {
      return message.error("Title must be at least 3 characters!");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);

      if (fileList[0]?.originFileObj) {
        formData.append("file", fileList[0].originFileObj);
      }

      const response = await updateBanner({
        id: selectedVideo._id,
        data: formData,
      }).unwrap();

      console.log("Update banner response:", response);

      if (response?.success) {
        message.success(response?.message || "Banner updated successfully!");
        handleCancel();
      } else {
        message.error(response?.message || "Failed to update banner");
      }
    } catch (error) {
      console.error(error);
      message.error(error?.data?.message || "Failed to update banner");
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
      width={600}
      destroyOnClose
    >
      <div className="mb-6 mt-4">
        <div className="font-bold text-center mb-6 text-lg">Edit Banner</div>

        <Form form={form} layout="vertical" onFinish={handleSubmit} className="px-2">
          {/* Title */}
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter title!" }]}
          >
            <Input placeholder="Enter title" style={{ height: "40px" }} />
          </Form.Item>

          {/* Video Preview + Upload */}
          <Form.Item label="Video">
            {previewUrl && (
              <video
                width="100%"
                height="240"
                controls
                style={{ marginBottom: "10px", borderRadius: "6px" }}
                key={previewUrl}
              >
                <source src={previewUrl} type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            )}

            <Upload
              fileList={fileList}
              onChange={onChange}
              maxCount={1}
              accept="video/*"
              beforeUpload={() => false} 
              showUploadList={false} 
            >
              <button
                type="button"
                className="bg-[#007BFF] text-white px-3 py-1 rounded"
              >
                {fileList.length ? "Change Video" : "Upload Video"}
              </button>
            </Upload>
          </Form.Item>

          {/* Submit */}
          <Form.Item>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-2 bg-[#004F44] text-white rounded-md flex justify-center items-center gap-2"
            >
              {loading ? <Spin size="small" /> : "Update Banner"}
            </button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default EditBanner;
