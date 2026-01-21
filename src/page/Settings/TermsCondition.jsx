import { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Navigate } from "../../Navigate";
import { useCreateTermsAndConditionsMutation, useGetTermsAndConditionsQuery } from "../redux/api/legalApi";
import { message } from "antd";

const TermsCondition = () => {

    const [createTermsAndConditions, { isLoading }] = useCreateTermsAndConditionsMutation()
    const { data } = useGetTermsAndConditionsQuery()
       useEffect(() => {
        if (data?.data?.content) {
          setContent(data?.data?.content);
        }
      }, [data]);

  const editor = useRef(null);
  const [content, setContent] = useState("");
  // const [isLoading, seLoading] = useState(false)
  const navigate = useNavigate();
  // const handleTerms = () => {
  //     console.log(content)
  // }
  const config = {
    readonly: false,
    placeholder: "Start typings...",
    style: {
      height: 650,
    },
    buttons: [
      "image",
      "fontsize",
      "bold",
      "italic",
      "underline",
      "|",
      "font",
      "brush",
      "align",
    ],
  };

   const onSubmit = async () => {
    try {
      const response = await createTermsAndConditions({ content: content }).unwrap();
      console.log("Terms And Conditions response:", response);
      if (response.success) {
        message.success(response.message)
      }
      console.log(response)
    } catch (error) {
      message.error(error.data.message)
      console.error(error);
    }
  };

  return (
    <div className=" bg-white p-3 ">
       <Navigate title="Terms And Condition" />

      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1}
        onBlur={(newContent) => setContent(newContent)}
        // onChange={newContent => { }}
      />

      <div className="mt-5 flex justify-center">
        <button
        onClick={onSubmit}
        className="bg-[#004F44] py-2 px-4 rounded text-white">
          {isLoading ? "Saving..." : "Save & change"}
        </button>
      </div>
    </div>
  );
};

export default TermsCondition;
