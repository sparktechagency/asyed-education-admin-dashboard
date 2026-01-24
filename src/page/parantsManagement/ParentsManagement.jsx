import React, { useState } from "react";
import {
  Input,
  Modal,
  Pagination,
  Table,
  Tag,
  Avatar,
  Divider,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { MdBlockFlipped } from "react-icons/md";
import { LuEye } from "react-icons/lu";
import { AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
import { GoLocation } from "react-icons/go";
import { Navigate } from "../../Navigate";
import { useGetAllParentsQuery } from "../redux/api/parantsApi";
import { BsSendArrowUp } from "react-icons/bs";
import AddPackage from "./AddPackage";

const ParentsManagement = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  
  const [selectedParants, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
const [search, setSearch] = useState("");
  const [selectedParent, setSelectedParent] = useState(null);
  const limit = 10;

  const { data, isLoading } = useGetAllParentsQuery({
    page,
    limit,
    search,
  });
  const handleEdit = (record) => {
    console.log(record)
    setSelectedCategory(record);
    setOpenAddModal(true);
  };
  const parents = data?.data || [];
  const meta = data?.meta;

  // ================= TABLE COLUMNS =================
  const columns = [
    {
      title: "No",
      render: (_, __, index) => (page - 1) * limit + index + 1,
    },
    {
      title: "Parent",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar size={40}>
            {record?.user?.firstName?.charAt(0)}
          </Avatar>
          <div>
            <p className="font-medium">
              {record?.user?.firstName} {record?.user?.lastName}
            </p>
            <p className="text-xs text-gray-500">
              {record?.user?.role}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      title: "Email",
      render: (_, record) => record?.user?.email,
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Status",
      render: (_, record) => (
        <Tag color={record?.user?.isActive ? "green" : "red"}>
          {record?.user?.isActive ? "Active" : "Blocked"}
        </Tag>
      ),
    },
    {
      title: "Action",
      align: "end",
      render: (_, record) => (
        <div className="flex items-center justify-end gap-3">
           <button
         
         onClick={() => handleEdit(record)}
            className="bg-[#6d999327] border border-[#096e61] text-[#096e61]  px-3 py-1 rounded flex justify-center items-center gap-1 transition-all"
          >
            Package Request <BsSendArrowUp />
          </button>
          <button
            onClick={() => setSelectedParent(record)}
            className="text-xl text-blue-600 hover:text-blue-800"
          >
            <LuEye />
          </button>

          <div
            className={`w-8 h-8 flex items-center justify-center rounded-md text-white ${
              record?.user?.isActive
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            <MdBlockFlipped />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 h-[87vh] overflow-auto rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Navigate title="Parents Management" />

        <Input
          placeholder="Search by name or email"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 300, height: 40 }}
        />
      </div>

      {/* Table */}
      <Table
        loading={isLoading}
        dataSource={parents}
        columns={columns}
        rowKey="_id"
        pagination={false}
        scroll={{ x: "max-content" }}
      />

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <Pagination
          current={page}
          total={meta?.total || 0}
          pageSize={limit}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
        />
      </div>

      {/* ================= MODAL ================= */}
      <Modal
        open={!!selectedParent}
        onCancel={() => setSelectedParent(null)}
        footer={null}
        centered
        width={600}
      >
        {selectedParent && (
          <div>
            {/* Parent Info */}
            <div className="flex items-center gap-4">
              <Avatar size={80}>
                {selectedParent?.user?.firstName?.charAt(0)}
              </Avatar>

              <div>
                <h2 className="text-xl font-semibold">
                  {selectedParent?.user?.firstName}{" "}
                  {selectedParent?.user?.lastName}
                </h2>

                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <AiOutlineMail />
                  <span>{selectedParent?.user?.email}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <AiOutlinePhone />
                  <span>{selectedParent?.phoneNumber}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <GoLocation />
                  <span>{selectedParent?.address}</span>
                </div>
              </div>
            </div>

            <Divider />

            {/* Children Info */}
            <h3 className="text-lg font-semibold mb-3">
              Children Information
            </h3>

            <div className="space-y-3">
              {selectedParent?.children?.map((child) => (
                <div
                  key={child._id}
                  className="p-3 border rounded-lg"
                >
                  <p className="font-medium">{child.name}</p>
                  <p className="text-sm text-gray-600">
                    Age: {child.age}
                  </p>
                  <p className="text-sm text-gray-600">
                    Grade: {child.grade}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
      <AddPackage selectedParants={selectedParants} openAddModal={openAddModal} setOpenAddModal={setOpenAddModal}/>
    </div>
  );
};

export default ParentsManagement;
