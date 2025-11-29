import { Input, message, Pagination, Table } from "antd";
import { useState } from "react";
import { BiBlock } from "react-icons/bi";

import { Navigate } from "../../Navigate";
import { SearchOutlined } from "@ant-design/icons";
import AddAdmin from "./AddAdmin";

const AdminManagement = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [admins, setAdmins] = useState([
    {
      _id: "1",
      name: "Foisal Uddin",
      email: "foisal@example.com",
      userType: "Super Admin",
      blocked: false,
    },
    {
      _id: "2",
      name: "Amina Khan",
      email: "amina@example.com",
      userType: "Admin",
      blocked: false,
    },
    {
      _id: "3",
      name: "Karim Ali",
      email: "karim@example.com",
      userType: "Moderator",
      blocked: true,
    },
  ]);

  const [openAddModal, setOpenAddModal] = useState(false);

  // Filter based on search
  const filteredAdmins = admins.filter((admin) =>
    admin.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const total = filteredAdmins.length;
  const paginatedData = filteredAdmins.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const handleBlockAdmin = (id) => {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin._id === id ? { ...admin, blocked: !admin.blocked } : admin
      )
    );
    message.success("Admin status updated");
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
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "User Type",
      dataIndex: "userType",
      key: "userType",
      align: "center",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => handleBlockAdmin(record._id)}
            className={`p-2 rounded text-white transition-all ${
              record.blocked
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            <BiBlock />
          </button>
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
