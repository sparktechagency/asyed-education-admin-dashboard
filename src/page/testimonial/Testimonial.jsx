import { Input, message, Pagination, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { SearchOutlined } from "@ant-design/icons";
import { Navigate } from "../../Navigate";
import { useDeleteTestimonialMutation, useGetAllTestimonialsQuery } from "../redux/api/testimonialApi";
import AddTestimonial from "./AddTestimonial";
import EditTestimonial from "./EditTestimonial";

const Testimonial = () => {
  const { data: testimonialData, isLoading } = useGetAllTestimonialsQuery();
  const [deleteTestimonial] = useDeleteTestimonialMutation();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [testimonials, setTestimonials] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (testimonialData?.data) {
      setTestimonials(testimonialData.data);
    }
  }, [testimonialData]);

  const filteredTestimonials = testimonials.filter((t) =>
    t?.authorName?.toLowerCase().includes(search?.toLowerCase()) ||
    t?.quote?.toLowerCase().includes(search?.toLowerCase())
  );

  const paginatedData = filteredTestimonials.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await deleteTestimonial(id).unwrap();
      if (response?.success) {
        message.success(response?.message || "Testimonial deleted successfully");
      } else {
        message.error(response?.message || "Failed to delete testimonial");
      }
    } catch (error) {
      message.error(error?.data?.message || "Failed to delete testimonial");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setSelectedTestimonial(record);
    setEditModal(true);
  };

  const columns = [
    {
      title: "SL No.",
      key: "sl",
      render: (_, __, index) => (currentPage - 1) * pageSize + (index + 1),
    },
    {
      title: "Avatar",
      key: "authorAvatar",
      align: "center",
      render: (_, record) => (
        <img
          src={record?.authorAvatar}
          alt={record.authorName}
          className="w-10 h-10 object-cover rounded-full mx-auto"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "authorName",
      key: "authorName",
      align: "center",
    },
    {
      title: "Title",
      dataIndex: "authorTitle",
      key: "authorTitle",
      align: "center",
    },
    {
      title: "Quote",
      dataIndex: "quote",
      key: "quote",
      align: "center",
      ellipsis: true,
      render: (text) => <div className="max-w-[300px] truncate mx-auto">{text}</div>
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <div className="flex gap-2 justify-end">
          <div
            onClick={() => handleEdit(record)}
            className="w-[36px] h-[36px] bg-[#007BFF] flex justify-center items-center text-white rounded cursor-pointer"
          >
            <MdOutlineModeEdit />
          </div>
          <Popconfirm
            title="Are you sure to delete this testimonial?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record._id)}
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
        <Navigate title={"Testimonials"} />
        <div className="flex gap-5">
          <Input
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name or quote..."
            prefix={<SearchOutlined />}
            style={{ maxWidth: "200px", height: "40px" }}
          />
          <button
            onClick={() => setOpenAddModal(true)}
            className="bg-[#004F44] px-6 text-white py-2 rounded"
          >
            Add Testimonial
          </button>
        </div>
      </div>

      <Table
        dataSource={paginatedData}
        columns={columns}
        rowKey="_id"
        pagination={false}
        className="custom-table"
        scroll={{ x: "max-content" }}
        loading={isLoading || loading}
      />

      <div className="mt-4 flex justify-center">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredTestimonials.length}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>

      <AddTestimonial
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
      />

      <EditTestimonial
        editModal={editModal}
        setEditModal={setEditModal}
        selectedTestimonial={selectedTestimonial}
      />
    </div>
  );
};

export default Testimonial;
