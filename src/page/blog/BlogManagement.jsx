import { Input, message, Pagination, Table } from "antd";
import { useEffect, useState } from "react";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

import { Navigate } from "../../Navigate";
import { SearchOutlined } from "@ant-design/icons";
import AddBlog from "./AddBlog";
import EditBlog from "./EditBlog";
import { useDeleteBlogMutation, useGetAllBlogsQuery } from "../redux/api/blogApi";
import { imageUrl } from "../redux/api/baseApi";

const BlogManagement = () => {

  const {data: blogsData, isLoading} = useGetAllBlogsQuery()
  const [deleteFaq] = useDeleteBlogMutation();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [blogs, setBlogs] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  // const isLoading = false; 


    useEffect(() => {
    if (blogsData?.data?.items) {
      console.log("Setting blogs from fetched data", blogsData.data.items);
      setBlogs(blogsData.data.items);
    }
  }, [blogsData]);

  // Filter blogs based on search

  const filteredBlogs = blogs.filter((blog) =>
  blog?.title?.toLowerCase().includes(search?.toLowerCase())
);

  // Paginate filtered data
  const total = filteredBlogs.length;
  const paginatedData = filteredBlogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => setCurrentPage(page);


 const handleDeleteFaq = async (id) => {
  if (!id) {
    return message.error("No FAQ selected");
  }

  try {
    setLoading(true);


    const response = await deleteFaq(id).unwrap();
    console.log("Delete FAQ response:", response);

    if (response?.success) {
      
      setBlogs((prev) => prev.filter((faq) => faq._id !== id));
      message.success(response?.message || "FAQ deleted successfully");
    } else {
      message.error(response?.message || "Failed to delete FAQ");
    }
    
  } catch (error) {
    console.error(error);
    message.error(error?.data?.message || "Failed to delete FAQ");
  } finally {
    setLoading(false);
  }
};



  // const handleDeleteBlog = (id) => {
  //   setBlogs((prev) => prev.filter((blog) => blog._id !== id));
  //   message.success("Blog deleted successfully");
  //   // Adjust page if current page is now empty
  //   if (paginatedData.length === 1 && currentPage > 1) {
  //     setCurrentPage((prev) => Math.max(1, prev - 1));
  //   }
  // };

  //  Edit Handler
  const handleEdit = (record) => {
    setSelectedCategory(record);
    setEditModal(true);
  };

  //  Table Columns
  const columns = [
  {
    title: "SL No.",
    key: "sl",
    render: (_, __, index) =>
      (currentPage - 1) * pageSize + (index + 1),
  },
  {
    title: "Image",
    key: "image",
    align: "center",
    render: (_, record) => (
      <img
        src={`${imageUrl}/${record?.image}`}
        alt={record.title}
        className="w-10 h-10 object-cover rounded mx-auto"
      />
    ),
  },
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    align: "center",
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
        <div
          onClick={() => handleDeleteFaq(record._id)}
          className="w-[36px] h-[36px] bg-[#E63946] flex justify-center items-center text-white rounded cursor-pointer"
        >
          <RiDeleteBin6Line />
        </div>
      </div>
    ),
  },
];

  return (
    <div className="bg-white p-3 h-[87vh]">
      <div className="flex justify-between mb-4">
        <Navigate title={"Blogs"} />
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
            {" "}
            <button
              onClick={() => setOpenAddModal(true)}
              className="bg-[#004F44] w-[150px] text-white py-2 rounded"
            >
              Add Blog
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

      <AddBlog
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
      />
   <EditBlog
  editModal={editModal}
  setEditModal={setEditModal}
  selectedBlog={selectedCategory} 
/>

    </div>
  );
};

export default BlogManagement;