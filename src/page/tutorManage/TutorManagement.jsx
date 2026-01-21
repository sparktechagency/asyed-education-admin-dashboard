import { Input, Pagination, Table, Modal, Tag } from "antd";
import { useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { BiBlock } from "react-icons/bi";
import { Navigate } from "../../Navigate";
import { useGetAllTutorsQuery } from "../redux/api/parantsApi";
import AddTutor from "./AddTutor";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineModeEdit } from "react-icons/md";
import UpdateTutor from "./UpdateTutor";
const TutorManagement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
const [openAddModal, setOpenAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
  const handleEdit = (record) => {
    setSelectedCategory(record);
    setEditModal(true);
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
       <div
                  onClick={() => handleEdit(record)}
                  className="w-[36px] h-[36px] text-lg bg-[#007BFF] flex justify-center items-center text-white rounded cursor-pointer"
                >
                  <MdOutlineModeEdit />
                </div>
      
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
  {/* ================= MODAL ================= */}
<Modal
  title="Tutor Details"
  open={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  footer={null}
  width={600}
  centered
>
  {selectedTutor && (
    <div className="space-y-4">
      {/* Tutor Basic Info */}
      <div className="flex items-center gap-4">
        <img
          src={selectedTutor.user.profileImage || "https://i.ibb.co/1QbVGFw/teacher1.png"}
          alt={`${selectedTutor.user.firstName} ${selectedTutor.user.lastName}`}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-semibold">
            {selectedTutor.user.firstName} {selectedTutor.user.lastName}
          </h2>
          <p className="text-gray-600">{selectedTutor.user.email}</p>
          <Tag color={selectedTutor.user.isActive ? "green" : "red"} className="mt-1">
            {selectedTutor.user.isActive ? "Active" : "Blocked"}
          </Tag>
        </div>
      </div>

      {/* Subjects */}
      <div>
        <h3 className="font-semibold mb-1">Subjects:</h3>
        <div className="flex flex-wrap gap-2">
          {selectedTutor.subjects.map((sub) => (
            <Tag color="blue" key={sub._id}>
              {sub.name}
            </Tag>
          ))}
        </div>
      </div>

      {/* Bio */}
      {selectedTutor.bio && (
        <div>
          <h3 className="font-semibold mb-1">Bio:</h3>
          <p className="text-gray-700">{selectedTutor.bio}</p>
        </div>
      )}

      {/* Qualifications */}
      {selectedTutor.qualifications.length > 0 && (
        <div>
          <h3 className="font-semibold mb-1">Qualifications:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedTutor.qualifications.map((q, i) => (
              <Tag color="purple" key={i}>
                {q}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      {Object.keys(selectedTutor.availability).length > 0 && (
        <div>
          <h3 className="font-semibold mb-1">Availability:</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(selectedTutor.availability).map(([day, times]) => (
              <p key={day}>
                <strong className="capitalize">{day}:</strong> {times.join(" - ")}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )}
</Modal>

      <AddTutor openAddModal={openAddModal} setOpenAddModal={setOpenAddModal} />
       <UpdateTutor
        editModal={editModal}
        setEditModal={setEditModal}
        selectedTutor={selectedCategory}
      />
    </div>
  );
};

export default TutorManagement;
