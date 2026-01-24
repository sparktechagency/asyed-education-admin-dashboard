import { Input, message, Pagination, Popconfirm, Table } from "antd";
import { useState, useEffect } from "react";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

import { Navigate } from "../../Navigate";
import { SearchOutlined } from "@ant-design/icons";
import AddSubject from "./AddSubject";
import UpdateSubject from "./UpdateSubject";
import { useDeleteSubjectMutation, useGetAllSubjectQuery } from "../redux/api/subjectApi";

const SubjectManage = () => {
    const [deleteData] = useDeleteSubjectMutation()
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: apiData, isLoading } = useGetAllSubjectQuery();
  const [categories, setCategories] = useState([]);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Populate categories from API
  useEffect(() => {
    if (apiData?.data) {
      setCategories(apiData.data);
    }
  }, [apiData]);

  // Filter categories based on search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  // Paginate filtered data
  const total = filteredCategories.length;
  const paginatedData = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const handleDeleteCategory = async (id) => {
   try {
      const res = await deleteData(id).unwrap();
      message.success(res?.message || "Icon deleted successfully");
    } catch (err) {
      message.error(err?.data?.message || "Failed to delete");
    }
  };

  const handleEdit = (record) => {
    setSelectedCategory(record);
    setEditModal(true);
  };

  const columns = [
    {
      title: "SL No.",
      dataIndex: "sl",
      key: "sl",
      render: (_, __, index) => (currentPage - 1) * pageSize + (index + 1),
      align: "center",
    },
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <div className="flex gap-2 justify-end">
          {/* Edit */}
          <div
            onClick={() => handleEdit(record)}
            className="w-[36px] h-[36px] text-lg bg-[#007BFF] flex justify-center items-center text-white rounded cursor-pointer"
          >
            <MdOutlineModeEdit />
          </div>
          {/* Delete */}
          <Popconfirm
            title="Are you sure to delete this Subject?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteCategory(record._id)}
          >
          <div
           
            className="w-[36px] h-[36px] text-lg bg-[#004F44] flex justify-center items-center text-white rounded cursor-pointer"
          >
            <RiDeleteBin6Line />
          </div></Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-3 h-[87vh]">
      <div className="flex justify-between mb-4">
        <Navigate title={"Subject Management"} />
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
              Add Subject
            </button>
          </div>
        </div>
      </div>

      <Table
        dataSource={paginatedData}
        columns={columns}
        rowKey="_id"
        pagination={false}
        className="custom-table"
        scroll={{ x: "max-content" }}
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

      {/* Add and Edit Modals */}
      <AddSubject
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
      />
      <UpdateSubject
        editModal={editModal}
        setEditModal={setEditModal}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default SubjectManage;
