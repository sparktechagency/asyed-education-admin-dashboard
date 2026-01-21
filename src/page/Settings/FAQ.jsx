import { useEffect, useState } from "react";
import { message, Modal } from "antd";
import { FaRegQuestionCircle } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { Navigate } from "../../Navigate";
import { useCreateFAQMutation, useDeleteFaqMutation, useGetAllFaqQuery, useUpdateFaqMutation } from "../redux/api/faqApi";

const FAQ = () => {

  const { data: faqData, isLoading } = useGetAllFaqQuery();

  const [createFAQ] = useCreateFAQMutation();
  const [updateFaq] = useUpdateFaqMutation();
   const [deleteFaq] = useDeleteFaqMutation();
  console.log("FAQ Data:", faqData?.data);

  const [isAccordionOpen, setIsAccordionOpen] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // Dummy data
  const [faqs, setFaqs] = useState([]);
  useEffect(() => {
  if (faqData?.data) {
    setFaqs(faqData.data);
  }
}, [faqData]);

  // Accordion click
  const handleClick = (index) => {
    setIsAccordionOpen((prevIndex) => (prevIndex === index ? null : index));
  };

  // create FaQ function.
  const handleAddFaq = async () => {
  if (!question || !answer) {
    
    return message.warning("Please fill all fields");
  }

  try {
    setLoading(true);
    const payload = {
      question,
      answer,
    };

   const result = await createFAQ(payload).unwrap();
   console.log("Create FAQ Result:", result);

    message.success("FAQ added successfully");

    setAddModalOpen(false);
    setQuestion("");
    setAnswer("");

  } catch (error) {
    console.error(error);
    message.error(
      error?.data?.message || "Failed to add FAQ"
    );
  }
  finally {
      setLoading(false);
    }
};

// upodate faq function
const handleUpdateFaq = async () => {
  if (!question || !answer) {
    return message.warning("Please fill all fields");
  }

  try {
   const result = await updateFaq({
      id: selectedFaq._id,   
      question,              
      answer,
    }).unwrap();

    console.log("Update FAQ Result:", result);

    message.success("FAQ updated successfully");

    setUpdateModalOpen(false);
    setSelectedFaq(null);
    setQuestion("");
    setAnswer("");

  } catch (error) {
    console.error(error);
    message.error(
      error?.data?.message || "Failed to update FAQ"
    );
  }
};

 // Delete FAQ
const handleDeleteFaq = async () => {
  setLoading(true);
  if (!selectedFaq?._id) {
    return message.error("No FAQ selected");
  }

  try {
    setLoading
    await deleteFaq(selectedFaq._id).unwrap();

    message.success("FAQ deleted successfully");

    setDeleteModalOpen(false);
    setSelectedFaq(null);

  } catch (error) {
    console.error(error);
    message.error(
      error?.data?.message || "Failed to delete FAQ"
    );
  }
  finally {
      setLoading(false);
    }
};


  if(isLoading){
    return <div className="min-h-screen flex flex-col items-center justify-center text-2xl font-semibold">Loading....</div>
  }

  return (
    <div className="relative bg-white p-3 h-[87vh]">
      <div className="flex justify-between items-center">
         <Navigate title={"Faq"} />
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-[#004F44] text-white font-semibold px-5 py-2 rounded transition duration-200"
        >
         {loading ? "Loading..." : "+ Add FAQ"}
        </button>
      </div>

      <div className="flex gap-2 flex-col w-full mt-5 p-5">
        {faqs.map((faq, index) => (
          <section key={faq._id} className="border-b border-[#e5eaf2] rounded py-3">
            <div
              className="flex gap-2 cursor-pointer items-center justify-between w-full"
              onClick={() => handleClick(index)}
            >
              <h2 className="text-base font-normal md:font-bold md:text-2xl flex gap-2 items-center">
                <FaRegQuestionCircle className="w-5 h-5 hidden md:flex" />
                {faq.question}
              </h2>
              <div className="flex gap-2 md:gap-4 items-center">
                <div className="border-2 px-1.5 py-1 rounded border-[#004F44] bg-[#f0fcf4]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFaq(faq);
                      setQuestion(faq.question);
                      setAnswer(faq.answer);
                      setUpdateModalOpen(true);
                    }}
                  >
                    <CiEdit className="text-2xl cursor-pointer text-[#004F44] font-bold transition-all" />
                  </button>
                </div>
                <div className="border-2 px-1.5 py-1 rounded border-[#004F44] bg-[#f0fcf4]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFaq(faq);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <RiDeleteBin6Line className="text-2xl cursor-pointer text-red-500 transition-all" />
                  </button>
                </div>
              </div>
            </div>
            <div
              className={`grid transition-all duration-300 overflow-hidden ease-in-out ${
                isAccordionOpen === index ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <p className="text-[#424242] text-[0.9rem] overflow-hidden">{faq.answer}</p>
            </div>
          </section>
        ))}
      </div>

      {/* Add FAQ Modal */}
      <Modal open={addModalOpen} centered onCancel={() => setAddModalOpen(false)} footer={null}>
        <div className="p-5">
          <h2 className="text-2xl font-bold text-center mb-2">Add FAQ</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Question</label>
              <input
                type="text"
                placeholder="Enter the FAQ"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Answer</label>
              <textarea
                placeholder="Enter the FAQ Answer"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => setAddModalOpen(false)}
              className="py-2 px-4 rounded-lg border border-[#004F44] bg-red-50"
            >
              Cancel
            </button>
            <button onClick={handleAddFaq} className="py-2 px-4 rounded-lg bg-[#004F44] text-white">
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Update FAQ Modal */}
      <Modal open={updateModalOpen} centered onCancel={() => setUpdateModalOpen(false)} footer={null}>
        <div className="p-5">
          <h2 className="text-2xl font-bold text-center mb-2">Update FAQ</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Question</label>
              <input
                type="text"
                placeholder="Enter the FAQ"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Answer</label>
              <textarea
                placeholder="Enter the FAQ Answer"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => setUpdateModalOpen(false)}
              className="py-2 px-4 rounded-lg border border-[#004F44] bg-red-50"
            >
              Cancel
            </button>
            <button onClick={handleUpdateFaq} className="py-2 px-4 rounded-lg bg-[#004F44] text-white">
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete FAQ Modal */}
      <Modal open={deleteModalOpen} centered onCancel={() => setDeleteModalOpen(false)} footer={null} loading={loading}>
        <div className="p-5 text-center">
          <h2 className="text-2xl font-bold mb-6">Are you sure you want to delete?</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="py-2 px-4 rounded-lg border border-[#004F44] bg-red-50"
            >
              Cancel
            </button>
            <button onClick={handleDeleteFaq} className="py-2 px-4 rounded-lg bg-[#004F44] text-white">
             {loading ? "Loading..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FAQ;