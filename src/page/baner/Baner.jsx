import { Input, message, Pagination, Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

import { Navigate } from "../../Navigate";
import { SearchOutlined } from "@ant-design/icons";
import AddBaner from "./AddBaner";
import {  useDeleteBannerMutation, useGetAllBannersQuery } from "../redux/api/bannerApi";

const Baner = () => {

  const { data: bannersData, isLoading } = useGetAllBannersQuery();
  const [deleteBanner] = useDeleteBannerMutation();
 

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [videos, setVideos] = useState([]);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);

   useEffect(() => {
        if (bannersData?.data) {
          console.log("Banner Data", bannersData?.data);
          setVideos(bannersData?.data);
        }
      }, [bannersData]);


  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase())
  );

  const total = filteredVideos.length;
  const paginatedData = filteredVideos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => setCurrentPage(page);



     const handleDeleteVideo = async (id) => {
    
  if (!id) {
    return message.error("No Video selected");
  }

  try {
    setLoading(true);


    const response = await deleteBanner(id).unwrap();
    console.log("Delete Banner response:", response);

    if (response?.success) {
      
      setVideos((prev) => prev.filter((vid) => vid._id !== id));
      message.success(response?.message || "Banner deleted successfully");
    } else {
      message.error(response?.message || "Failed to delete Banner");
    }
    
  } catch (error) {
    console.error(error);
    message.error(error?.data?.message || "Failed to delete Banner");
  } finally {
    setLoading(false);
  }
};




  // const handleDeleteVideo = (id) => {
  //   setVideos((prev) => prev.filter((v) => v._id !== id));
  //   message.success("Video deleted successfully");
  // };

  const handleEdit = (record) => {
    setSelectedVideo(record);
    setEditModal(true);
  };

  const columns = [
    {
      title: "SL No.",
      dataIndex: "sl",
      key: "sl",
      render: (_, __, index) => (currentPage - 1) * pageSize + (index + 1),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    
    {
      title: "Video",
      dataIndex: "videoUrl",
      key: "video",
      align: "center",
      render: (url) => (
        <video width="120" height="70" controls>
          <source src={url} type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      align: "right",
      render: (_, record) => (
        <div className="flex gap-2 justify-end">
          
          <div
            // onClick={() => handleDeleteVideo(record._id)}
            className="w-[36px] h-[36px] text-lg bg-[#004F44] flex justify-center items-center text-white rounded cursor-pointer"
          >
            <Popconfirm
            title="Are you sure to delete this Subject?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteVideo(record._id)}
          >
            <RiDeleteBin6Line />
            </Popconfirm>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-3 h-[87vh]">
      <div className="flex justify-between mb-4">
        <Navigate title={"Banner Management"} />
        <div className="flex gap-5">
          <Input
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by title..."
            prefix={<SearchOutlined />}
            style={{ maxWidth: "500px", height: "40px" }}
          />
          <div>
            <button
            onClick={() => setOpenAddModal(true)}
            className="bg-[#004F44] w-[150px] text-white py-2 rounded"
          >
            Add Banner
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

      <AddBaner openAddModal={openAddModal} setOpenAddModal={setOpenAddModal} />
    </div>
  );
};

export default Baner;
