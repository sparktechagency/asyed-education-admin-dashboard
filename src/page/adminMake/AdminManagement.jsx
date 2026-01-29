import { Input, message, Pagination, Popconfirm, Table } from "antd";
import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Navigate } from "../../Navigate";
import { SearchOutlined } from "@ant-design/icons";
import AddAdmin from "./AddAdmin";
import { useDeleteAdminMutation, useGetAdminsQuery } from "../redux/api/adminApi";

const AdminManagement = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: adminss, isLoading } = useGetAdminsQuery();
  const [deleteAdmin] = useDeleteAdminMutation();

  const admins = adminss?.data || [];

  const [openAddModal, setOpenAddModal] = useState(false);

  // Filter based on search
  const filteredAdmins = admins.filter((admin) =>
    `${admin?.firstName} ${admin?.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    admin?.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const total = filteredAdmins.length;
  const paginatedData = filteredAdmins.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const handleDeleteAdmin = async (id) => {
    try {
      const response = await deleteAdmin(id).unwrap();
      if (response?.success) {
        message.success(response?.message || "Admin deleted successfully");
      } else {
        message.error(response?.message || "Failed to delete admin");
      }
    } catch (error) {
      message.error(error?.data?.message || "Failed to delete admin");
    }
  };

  const columns = [
    {
      title: "SL No.",
      key: "sl",
      render: (_, __, index) => (currentPage - 1) * pageSize + (index + 1),
      align: "center",
    },
    {
      title: "Name",
      key: "name",
      align: "center",
      render: (_, record) => `${record?.firstName} ${record?.lastName}`
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (role) => <span className="capitalize">{role}</span>
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center items-center gap-2">
          <Popconfirm
            title="Are you sure to delete this admin?"
            onConfirm={() => handleDeleteAdmin(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <div className="w-[36px] h-[36px] bg-[#004F44] flex justify-center items-center text-white rounded cursor-pointer">
              <RiDeleteBin6Line />
            </div>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-3 h-[87vh]">
      <div className="flex justify-between mb-4">
        <Navigate title={"Admin Management"} />
        <div className="flex gap-5">
          <Input
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name..."
            prefix={<SearchOutlined />}
            style={{ maxWidth: "500px", height: "40px" }}
          />
          <div>
            <button
              onClick={() => setOpenAddModal(true)}
              className="bg-[#004F44] w-[150px] text-white py-2 rounded"
            >
              Add Admin
            </button>
          </div>
        </div>
      </div>

      <Table
        dataSource={paginatedData}
        columns={columns}
        rowKey="_id"
        pagination={false}
        scroll={{ x: "max-content" }}
        className="custom-table"
        loading={isLoading}
      />

      <div className="mt-4 flex justify-center">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>

      <AddAdmin openAddModal={openAddModal} setOpenAddModal={setOpenAddModal} />
    </div>
  );
};

export default AdminManagement;
