import { Input, message, Pagination, Table, Modal } from "antd";
import { useState } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiBlock } from "react-icons/bi";

import { Navigate } from "../../Navigate";


import AddConsultation from "./AddConsultation";


const ConsultationReq = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [tutors, setTutors] = useState([
    {
      _id: "1",
      name: "Mr. Rahman",
      email: "rahman@example.com",
      subject: "Mathematics",
      location: "Dhaka, Bangladesh",
      imageUrl: "https://i.ibb.co/1QbVGFw/teacher1.png",
      blocked: false,
    },
    {
      _id: "2",
      name: "Mrs. Amina",
      email: "amina@example.com",
      subject: "Science",
      location: "Chittagong, Bangladesh",
      imageUrl: "https://i.ibb.co/5nC2vbf/teacher2.png",
      blocked: false,
    },
    {
      _id: "3",
      name: "Mr. Karim",
      email: "karim@example.com",
      subject: "English",
      location: "Khulna, Bangladesh",
      imageUrl: "https://i.ibb.co/KWDFBH0/teacher3.png",
      blocked: true,
    },
  ]);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search Filter
  const filteredTutors = tutors.filter((tutor) =>
    tutor.name.toLowerCase().includes(search.toLowerCase())
  );

  // Paginate filtered data
  const total = filteredTutors.length;
  const paginatedData = filteredTutors.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const handleDeleteTutor = (_id) => {
    setTutors((prev) => prev.filter((t) => t._id !== _id));
    message.success("Tutor deleted successfully");
  };

  const handleBlockTutor = (id) => {
    setTutors((prev) =>
      prev.map((t) =>
        t._id === id ? { ...t, blocked: !t.blocked } : t
      )
    );
    message.success("Tutor status updated");
  };

  const handleView = (tutor) => {
    setSelectedTutor(tutor);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "SL No.",
      key: "sl",
      render: (_, __, index) => (currentPage - 1) * pageSize + (index + 1),
      align: "center",
    },
    {
      title: "Tutor Name",
      key: "tutor",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <img
            src={record.imageUrl}
            alt={record.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span>{record.name}</span>
        </div>
      ),
      align: "center",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      align: "center",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      align: "center",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => handleView(record)}
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
          >
            <EyeOutlined />
          </button>

     
          <button
            onClick={() => handleBlockTutor(record._id)}
            className={`p-2 rounded text-white transition-all ${
              record.blocked ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-600 hover:bg-gray-700"
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
        <Navigate title={"Consultaion Management"} />
        <div className="flex gap-5">
          <Input
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name..."
            style={{ maxWidth: "500px", height: "40px" }}
          />
         <div>
             <button
            onClick={() => setOpenAddModal(true)}
            className="bg-[#004F44] w-[150px] text-white py-2 rounded"
          >
            Add Consultation
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

      <AddConsultation openAddModal={openAddModal} setOpenAddModal={setOpenAddModal} />

      {/* View Modal */}
      <Modal
        title="Tutor Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {selectedTutor && (
          <div className="text-center">
            <img
              src={selectedTutor.imageUrl}
              alt={selectedTutor.name}
              className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-bold">{selectedTutor.name}</h2>
            <p><strong>E-mail:</strong> {selectedTutor.email}</p>
            <p><strong>Subject:</strong> {selectedTutor.subject}</p>
            <p><strong>Location:</strong> {selectedTutor.location}</p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedTutor.blocked ? "Blocked" : "Active"}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ConsultationReq;
