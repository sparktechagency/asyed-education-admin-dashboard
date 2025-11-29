import { Input, message, Pagination, Table } from "antd";
import { useState } from "react";
import { MdOutlineModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";

import { Navigate } from "../../Navigate";
import { SearchOutlined } from "@ant-design/icons";
import AddVideo from "./AddVideo";

const VideoManage = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [videos, setVideos] = useState([
    {
      _id: "1",
      title: "React Tutorial",
      description: "Learn React step by step",
      videoUrl:
        "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4",
    },
    {
      _id: "2",
      title: "Node.js Basics",
      description: "Introduction to Node.js",
      videoUrl:
        "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4",
    },
  ]);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const isLoading = false;

  // Filter videos based on search
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase())
  );

  const total = filteredVideos.length;
  const paginatedData = filteredVideos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const handleDeleteVideo = (id) => {
    setVideos((prev) => prev.filter((v) => v._id !== id));
    message.success("Video deleted successfully");
  };

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
      title: "Description",
      dataIndex: "description",
      key: "description",
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
            onClick={() => handleDeleteVideo(record._id)}
            className="w-[36px] h-[36px] text-lg bg-[#004F44] flex justify-center items-center text-white rounded cursor-pointer"
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
        <Navigate title={"Video Management"} />
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
              Add Video
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

      <AddVideo openAddModal={openAddModal} setOpenAddModal={setOpenAddModal} />
    </div>
  );
};

export default VideoManage;
