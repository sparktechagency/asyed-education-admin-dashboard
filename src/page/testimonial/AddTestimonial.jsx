import { Form, Input, message, Modal, Spin, Upload, Switch } from "antd";
import React, { useState } from "react";
import { useAddTestimonialMutation } from "../redux/api/testimonialApi";

const AddTestimonial = ({ openAddModal, setOpenAddModal }) => {
    const [addTestimonial, { isLoading }] = useAddTestimonialMutation();
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
        if (!fileList[0]) {
            return message.error("Please select an image!");
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("quote", values.quote);
            formData.append("authorName", values.authorName);
            formData.append("authorTitle", values.authorTitle);
            formData.append("isActive", values.isActive === undefined ? true : values.isActive);
            formData.append("image", fileList[0].originFileObj);

            const response = await addTestimonial(formData).unwrap();

            if (response?.success) {
                message.success(response?.message || "Testimonial added successfully!");
                handleCancel();
            } else {
                message.error(response?.message || "Failed to add testimonial");
            }
        } catch (error) {
            console.error(error);
            message.error(error?.data?.message || "Failed to add testimonial");
        } finally {
            setLoading(false);
        }
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
                <div className="font-bold text-center mb-6 text-lg">+ Add Testimonial</div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="px-2"
                    initialValues={{ isActive: true }}
                >
                    <Form.Item label="Author Avatar" required>
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

                    {/* <Form.Item label="Active" name="isActive" valuePropName="checked">
                        <Switch />
                    </Form.Item> */}

                    <Form.Item>
                        <button
                            type="submit"
                            disabled={isLoading || loading}
                            className="w-full py-2 mt-2 bg-[#004F44] text-white rounded-md flex justify-center items-center gap-2"
                        >
                            {loading ? <Spin size="small" /> : "Add Testimonial"}
                        </button>
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
};

export default AddTestimonial;
