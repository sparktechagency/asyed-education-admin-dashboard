
import logo from "../../assets/header/image.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FaChevronRight, FaHome } from "react-icons/fa";
import { IoIosLogIn } from "react-icons/io";
import { logout } from "../../page/redux/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { FiUser } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { TbCategory2 } from "react-icons/tb";
import { MdManageAccounts, MdOutlineAdminPanelSettings, MdOutlineOndemandVideo } from "react-icons/md";
import { GrUserManager } from "react-icons/gr";
import { BsCameraVideo } from "react-icons/bs";
import { BiSolidInstitution } from "react-icons/bi";
import { PiGitlabLogoLight } from "react-icons/pi";
import { CiBoxes } from "react-icons/ci";

const icons = {
  FaHome,
  FiUser,
  TbCategory2,
  IoSettingsOutline,
};

const items = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: < FaHome />,
    link: "/"
  },
  {
    key: "userManagement",
    label: "Parents Management",
    icon: <FiUser/>,
    link: "/dashboard/parentsManagement"
  },
  {
    key: "tutorManagement",
    label: "Tutor Management",
    icon: <MdManageAccounts />,
    link: "/dashboard/tutorManagement"
  },
   {
    key: "subjectManagement",
    label: "Subject Management",
    icon: <BiSolidInstitution />,
    link: "/dashboard/subjectManagement"
  },
   {
    key: "childManagement",
    label: "Child Management",
    icon: <GrUserManager />,
    link: "/dashboard/childManagement"
  },
  {
    key: "conultManagement",
    label: "Consult Management",
    icon: <BsCameraVideo />,
    link: "/dashboard/consultManagement"
  },
  {
    key: "tutionManagement",
    label: "Tution Management",
    icon: <BiSolidInstitution />,
    link: "/dashboard/tutionManagement"
  },
 
  {
    key: "adminManage",
    label: "Admin Management",
    icon: <MdOutlineAdminPanelSettings />,
    link: "/dashboard/adminManage"
  },
   {
    key: "blogManagement",
    label: "Blog Management",
    icon: <PiGitlabLogoLight />,
    link: "/dashboard/blogManagement"
  },
  {
    key: "videoCreatorManagement",
    label: "Video Management",
    icon: <MdOutlineOndemandVideo />,
    link: "/dashboard/videoCreatorManagement"
  },
   
  {
    key: "banerManagement",
    label: "baner Management",
    icon: <CiBoxes />,
    link: "/dashboard/bannerManagement"
  },

  
  {
    key: "settings",
    label: "Settings",
    icon: <IoSettingsOutline/>,
    link: "/dashboard/Settings/profile",
    children: [
      {
        key: "profile",
        label: "Profile",
        link: "/dashboard/Settings/profile"
      },
      {
        key: "terms",
        label: "Terms & Condition",
        link: "/dashboard/Settings/Terms&Condition"
      },
      {
        key: "privacy",
        label: "Privacy Policy",
        link: "/dashboard/Settings/PrivacyPolicy"
      },
      {
        key: "faq",
        label: "FAQ",
        link: "/dashboard/Settings/FAQ"
      },
      {
        key: "about",
        label: "About Us",
        link: "/dashboard/Settings/aboutUs"
      }
    ]
  }
];

const SidBar = () => {
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const [expandedKeys, setExpandedKeys] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef({});
  const dispatch = useDispatch();

  useEffect(() => {
    const currentPath = location.pathname;

    let activeParent = null;

    items.forEach((item) => {
      if (item.link === currentPath) {
        activeParent = item;
      } else if (
        item.children &&
        item.children.some((child) => child.link === currentPath)
      ) {
        activeParent = item;
      }
    });

    if (activeParent) {
      setSelectedKey(
        activeParent.children
          ? activeParent.children.find((child) => child.link === currentPath)
              ?.key || activeParent.key
          : activeParent.key
      );

      if (activeParent.children && !expandedKeys.includes(activeParent.key)) {
        setExpandedKeys([...expandedKeys, activeParent.key]);
      }
    }
  }, [location]);

  const onParentClick = (key) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  // Logout Function
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="custom-sidebar h-[100vh] bg-[#004F44] text-white">
      <div className="custom-sidebar-logo flex justify-center pb-6 pt-4">
        <img src={logo} alt="Logo"  />
      </div>
      <div className="menu-items">
        {items.map((item) => {
          const isSettingsActive =
            item.key === "settings" &&
            item.children.some((child) => child.link === location.pathname);

          const isCreatorActive =
            item.key === "creatorManagement" &&
            item.children.some((child) => child.link === location.pathname);

          const isCategoriesActive =
            item.key === "categoriesManagement" &&
            item.children.some((child) => child.link === location.pathname);
          
          return (
            <div key={item.key}>
              <Link
                to={item.link}
                className={`menu-item my-2  py-[10px] px-4 flex items-center cursor-pointer ${
                  selectedKey === item.key ||
                  isSettingsActive ||
                  isCreatorActive ||
                  isCategoriesActive
                    ? "bg-gradient-to-r from-[#ffb144] border-l-2 border-green-500 to-[#ffffff00] text-white  "
                    : "  hover:bg-gradient-to-r hover:from-[#EF991F]"
                }`}
                onClick={(e) => {
                  if (item.children) {
                    e.preventDefault();
                    onParentClick(item.key);
                  } else {
                    setSelectedKey(item.key);
                  }
                }}
              >
            <h1 className="w-4 mr-2">{item.icon}</h1>

                <span className="block w-full ">{item.label}</span>

                {/* Show dropdown arrow if children exist */}
                {item.children && (
                  <FaChevronRight
                    className={`ml-auto transform transition-all text-[10px] duration-300 ${
                      expandedKeys.includes(item.key) ? "rotate-90" : ""
                    }`}
                  />
                )}
              </Link>

              {/* Show children menu if expanded */}
              {item.children && (
                <div
                  className={`children-menu  ml-6 mx-2  transition-all duration-300 ${
                    expandedKeys.includes(item.key) ? "expanded" : ""
                  }`}
                  style={{
                    maxHeight: expandedKeys.includes(item.key)
                      ? `${contentRef.current[item.key]?.scrollHeight}px`
                      : "0",
                  }}
                  ref={(el) => (contentRef.current[item.key] = el)}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.key}
                      to={child.link}
                      className={`menu-item p-2 flex items-center cursor-pointer ${
                        selectedKey === child.key
                          ? " text-red-500"
                          : "hover:bg-gradient-to-r hover:from-[#470e0e]"
                      }`}
                     onClick={() => {
                        setSelectedKey(child.key); 
                        
                      }}
                    >
                      <span className="block w-full ">{child.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="mx-4 ">
        <div className=" border-red-600 rounded w-full p-3 border mt-4">
        <button
          onClick={handleLogout}
          className=" flex items-center text-red-600 text-start rounded-md  "
        >
          <span className="text-2xl">
            <IoIosLogIn />
          </span>
          <span className="ml-3">Log Out</span>
        </button>
      </div>
      </div>
    </div>
  );
};

export default SidBar;
