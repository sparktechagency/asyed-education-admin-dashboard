import { Input, Pagination, Table, Modal, Tag } from "antd";
import { useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { BiBlock } from "react-icons/bi";
import { Navigate } from "../../Navigate";
import { useGetAllTutorsQuery } from "../redux/api/parantsApi";
import AddTutor from "./AddTutor";
import { RiDeleteBin6Line } from "react-icons/ri";
const TutorManagement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
const [openAddModal, setOpenAddModal] = useState(false);

  const { data, isLoading } = useGetAllTutorsQuery({
    search,
    page,
    limit,
  });

  const tutors = data?.data || [];
  const meta = data?.meta;

  const [selectedTutor, setSelectedTutor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = (record) => {
    setSelectedTutor(record);
    setIsModalOpen(true);
  };

  /* ================= TABLE COLUMNS ================= */

  const columns = [
    {
      title: "SL",
      render: (_, __, index) => (page - 1) * limit + index + 1,
      align: "center",
    },
    {
      title: "Tutor Name",
      render: (_, record) => (
        <span className="font-medium">
          {record.user.firstName} {record.user.lastName}
        </span>
      ),
    },
    {
      title: "Email",
      render: (_, record) => record.user.email,
    },
    {
      title: "Subjects",
      render: (_, record) => (
        <Tag color="blue">{record.subjects.length} Subjects</Tag>
      ),
      align: "center",
    },
    
    {
      title: "Action",
      align: "center",
      render: (_, record) => (
     <div className="flex justify-center items-center gap-2">
      
       <BiBlock
          size={22}
          className={`cursor-pointer ${
            record.user.isActive ? "text-green-600" : "text-red-600"
          }`}
        />
         <button
          onClick={() => handleView(record)}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <EyeOutlined />
        </button>
        <button  className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all" > <RiDeleteBin6Line /> </button>
     </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 h-[87vh] overflow-auto">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <Navigate title="Tutor Management" />
       <div className="flex gap-5">
         <Input
          placeholder="Search tutor..."
          allowClear
          style={{ width: 300 }}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button onClick={() => setOpenAddModal(true)} className="bg-[#004F44] w-[150px] text-white py-2 rounded" > Add Tutor </button>
       </div>
      </div>

      {/* Table */}
      <Table
        loading={isLoading}
        dataSource={tutors}
        columns={columns}
        rowKey="_id"
        pagination={false}
        className="custom-table"
      />

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
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
        title="Tutor Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {selectedTutor && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">
              {selectedTutor.user.firstName} {selectedTutor.user.lastName}
            </h2>

            <p>
              <strong>Email:</strong> {selectedTutor.user.email}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <Tag color={selectedTutor.user.isActive ? "green" : "red"}>
                {selectedTutor.user.isActive ? "Active" : "Blocked"}
              </Tag>
            </p>

            <p>
              <strong>Bio:</strong> {selectedTutor.bio}
            </p>

            <p>
              <strong>Qualifications:</strong>
            </p>
            <ul className="list-disc ml-5">
              {selectedTutor.qualifications.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>

            <p className="font-semibold mt-3">Availability:</p>
            {Object.entries(selectedTutor.availability).map(
              ([day, times]) => (
                <p key={day}>
                  <strong className="capitalize">{day}:</strong>{" "}
                  {times.join(", ")}
                </p>
              )
            )}
          </div>
        )}
      </Modal>
      <AddTutor openAddModal={openAddModal} setOpenAddModal={setOpenAddModal} />
    </div>
  );
};

export default TutorManagement;
