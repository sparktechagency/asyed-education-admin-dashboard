import React, { useState } from "react";
import {
  Table,
  Avatar,
  Modal,
  Tag,
  Button,
  message,
  Descriptions,
  Divider,
} from "antd";
import { LuEye } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import { useGetAllPackagesQuery, useDeletePackagesMutation } from "../redux/api/parantsApi";
import { Navigate } from "../../Navigate";

const PackageManagement = () => {
  const { data: packageData, isLoading } = useGetAllPackagesQuery();
  const [deletePackages] = useDeletePackagesMutation();

  const [openModal, setOpenModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleView = (record) => {
    setSelectedPackage(record);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await deletePackages(id).unwrap();
      message.success(res?.message || "Package deleted successfully");
    } catch (err) {
      message.error(err?.data?.message || "Failed to delete package");
    }
  };

  const columns = [
    {
      title: "Parent",
      render: (_, record) => {
        const parent = record?.parentId;
        return (
          <div className="flex items-center gap-3">
            <Avatar size={40}>
              {parent?.user?.firstName?.charAt(0)}
            </Avatar>
            <div>
              <p className="font-medium">
                {parent?.user?.firstName} {parent?.user?.lastName}
              </p>
              <p className="text-xs text-gray-500">
                {parent?.phoneNumber}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Address",
      dataIndex: ["parentId", "address"],
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "rejected" ? "red" : status === "draft" ? "orange" : "green"}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Price",
      render: (_, record) => (
        <span className="font-medium">
          {record?.price?.amount} {record?.price?.currency}
        </span>
      ),
    },
    {
      title: "Action",
      align: "center",
      render: (_, record) => (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => handleView(record)}
            className="text-xl text-blue-600 hover:text-blue-800"
          >
            <LuEye />
          </button>

          <button
            onClick={() => handleDelete(record?._id)}
            className="text-xl text-red-600 hover:text-red-800"
          >
            <MdDelete />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-3 h-[87vh]">
      <Navigate title="Package Management" />

      <Table
        loading={isLoading}
        dataSource={packageData?.data || []}
        columns={columns}
        rowKey="_id"
        pagination={false}
        className="custom-table"
      />

      {/* ================= MODAL ================= */}
      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
        width={800}
        title="Package Details"
      >
        {selectedPackage && (
          <>
            {/* Parent Info */}
            <Divider orientation="left">Parent Information</Divider>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Name">
                {selectedPackage?.parentId?.user?.firstName}{" "}
                {selectedPackage?.parentId?.user?.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                {selectedPackage?.parentId?.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Address" span={2}>
                {selectedPackage?.parentId?.address}
              </Descriptions.Item>
            </Descriptions>

            {/* Children */}
            <Divider orientation="left">Children</Divider>
            <ul className="list-disc ml-6">
              {selectedPackage?.childrenIds?.map((child) => (
                <li key={child?._id}>{child?.name}</li>
              ))}
            </ul>

            {/* Tutor Info */}
            <Divider orientation="left">Tutor Information</Divider>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Tutor Name">
                {selectedPackage?.tutorId?.user?.firstName}{" "}
                {selectedPackage?.tutorId?.user?.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Bio">
                {selectedPackage?.tutorId?.bio}
              </Descriptions.Item>
              <Descriptions.Item label="Qualifications" span={2}>
                {selectedPackage?.tutorId?.qualifications?.join(", ")}
              </Descriptions.Item>
              <Descriptions.Item label="Subject">
                {selectedPackage?.subjectId?.name || "N/A"}
              </Descriptions.Item>
            </Descriptions>

            {/* Package Info */}
            <Divider orientation="left">Package Details</Divider>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Hours / Week">
                {selectedPackage?.hoursPerWeek}
              </Descriptions.Item>
              <Descriptions.Item label="Duration (Weeks)">
                {selectedPackage?.durationInWeeks}
              </Descriptions.Item>
              <Descriptions.Item label="Tuition Days">
                {selectedPackage?.tuitionDays?.join(", ")}
              </Descriptions.Item>
              <Descriptions.Item label="Hourly Rate">
                {selectedPackage?.hourlyRate}
              </Descriptions.Item>
              <Descriptions.Item label="Start Time">
                {selectedPackage?.startTime || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="End Time">
                {selectedPackage?.endTime || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag>{selectedPackage?.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Price">
                {selectedPackage?.price?.amount}{" "}
                {selectedPackage?.price?.currency}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
};

export default PackageManagement;
