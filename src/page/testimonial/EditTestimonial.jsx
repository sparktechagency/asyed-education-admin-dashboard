import { Form, Input, message, Modal, Spin, Upload, Switch } from "antd";
import React, { useState, useEffect } from "react";
import { useUpdateTestimonialMutation } from "../redux/api/testimonialApi";

const EditTestimonial = ({ editModal, setEditModal, selectedTestimonial }) => {
    const [updateTestimonial, { isLoading }] = useUpdateTestimonialMutation();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedTestimonial) {
            form.setFieldsValue({
                quote: selectedTestimonial.quote,
                authorName: selectedTestimonial.authorName,
                authorTitle: selectedTestimonial.authorTitle,
                isActive: selectedTestimonial.isActive,
            });
            if (selectedTestimonial.authorAvatar) {
                setFileList([
                    {
                        uid: "-1",
                        name: "avatar.png",
                        status: "done",
                        url: selectedTestimonial.authorAvatar,
                    },
                ]);
            }
        }
    }, [selectedTestimonial, form]);

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        setEditModal(false);
    };

    const handleSubmit = async (values) => {
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("quote", values.quote);
            formData.append("authorName", values.authorName);
            formData.append("authorTitle", values.authorTitle);
            formData.append("isActive", values.isActive);

            if (fileList[0] && fileList[0].originFileObj) {
                formData.append("image", fileList[0].originFileObj);
            }

            const response = await updateTestimonial({
                id: selectedTestimonial._id,
                data: formData,
            }).unwrap();

            if (response?.success) {
                message.success(response?.message || "Testimonial updated successfully!");
                handleCancel();
            } else {
                message.error(response?.message || "Failed to update testimonial");
            }
        } catch (error) {
            console.error(error);
            message.error(error?.data?.message || "Failed to update testimonial");
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
        >
            <div className="mb-4 mt-4">
                <div className="font-bold text-center mb-6 text-lg">Edit Testimonial</div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="px-2"
                >
                    <Form.Item label="Author Avatar">
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={onChange}
                            maxCount={1}
                            beforeUpload={() => false}
                        >
                            {fileList.length < 1 && "+ Upload"}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Quote"
                        name="quote"
                        rules={[{ required: true, message: "Please enter quote!" }]}
                    >
                        <Input.TextArea placeholder="Enter quote" rows={4} />
                    </Form.Item>

                    <Form.Item
                        label="Author Name"
                        name="authorName"
                        rules={[{ required: true, message: "Please enter author name!" }]}
                    >
                        <Input placeholder="Enter author name" style={{ height: "40px" }} />
                    </Form.Item>

                    <Form.Item
                        label="Author Title"
                        name="authorTitle"
                        rules={[{ required: true, message: "Please enter author title!" }]}
                    >
                        <Input placeholder="Enter author title" style={{ height: "40px" }} />
                    </Form.Item>

                    <Form.Item label="Active" name="isActive" valuePropName="checked">
                        <Switch />
                    </Form.Item>

                    <Form.Item>
                        <button
                            type="submit"
                            disabled={isLoading || loading}
                            className="w-full py-2 mt-2 bg-[#004F44] text-white rounded-md flex justify-center items-center gap-2"
                        >
                            {loading ? <Spin size="small" /> : "Update Testimonial"}
                        </button>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default EditTestimonial;
