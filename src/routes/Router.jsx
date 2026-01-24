import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layout/dashboardLayout/DashboardLayout";
import Dashboard from "../components/Dashboard/Dashboard";
import UserManagement from "../page/UserManagement/UserManagement";
import CreatorManagement from "../page/CreatorManagement/CreatorManagement";


import Profile from "../page/Settings/Profile";
import TermsCondition from "../page/Settings/TermsCondition";
import FAQ from "../page/Settings/FAQ";
import PrivacyPolicy from "../page/Settings/PrivacyPolicy";
import Categories from "../page/CategoriesManagement/Categories";
import Subcategory from "../page/CategoriesManagement/Subcategory";

import ForgetPass from "../Auth/ForgetPass";
import Verify from "../Auth/Verify";
import ResetPass from "../Auth/ResetPass";
import Notification from "../page/Notification/Notification";
import About from "../page/Settings/About";
import Login from "../Auth/Login";
import ParentsManagement from "../page/parantsManagement/ParentsManagement";
import TutorManagement from "../page/tutorManage/TutorManagement";
import ConsultationReq from "../page/consultationRewuest/ConsultationReq";
import ManageTution from "../page/manageTution/ManageTution";
import VedioManage from "../page/videoManagement/VedioManage";
import Baner from "../page/baner/Baner";
import ChildManagement from "../page/child/ChildManagement";
import AdminManagement from "../page/adminMake/AdminManagement";
import BlogManagement from "../page/blog/BlogManagement";
import SubjectManage from "../page/subject/SubjectManage";
import PackageManagement from "../page/package/PackageManagement";
import SupportTab from "../page/support/SupportTab";


export const router = createBrowserRouter([
  {
    path: "/",
    element: (
     
        <DashboardLayout></DashboardLayout>
      
    ),
    children: [
      {
        path: "/",
        element: <Dashboard></Dashboard>,
      },
      {
        path: "/dashboard/UserManagement",
        element: <UserManagement></UserManagement>,
      },
       {
        path: "/dashboard/parentsManagement",
        element: <ParentsManagement></ParentsManagement>,
      },
       {
        path: "/dashboard/tutorManagement",
        element: <TutorManagement></TutorManagement>,
      },
      {
        path: "/dashboard/childManagement",
        element: <ChildManagement></ChildManagement>,
      },
      {
        path: "/dashboard/subjectManagement",
        element: <SubjectManage></SubjectManage>,
      },
       {
        path: "/dashboard/packageManagement",
        element: <PackageManagement></PackageManagement>
      },
       {
        path: "/dashboard/support",
        element: <SupportTab></SupportTab>
      },
       {
        path: "/dashboard/consultManagement",
        element: <ConsultationReq></ConsultationReq>,
      },
      {
        path: "/dashboard/tutionManagement",
        element: <ManageTution></ManageTution>,
      },
       {
        path: "/dashboard/videoCreatorManagement",
        element: <VedioManage></VedioManage>,
      },
       {
        path: "/dashboard/adminManage",
        element:<AdminManagement></AdminManagement>,
      },
       {
        path: "/dashboard/bannerManagement",
        element: <Baner></Baner>
      },
       {
        path: "/dashboard/blogManagement",
        element: <BlogManagement></BlogManagement>,
      },
      {
        path: "/dashboard/CategoriesManagement/Categories",
        element: <Categories></Categories>,
      },
      {
        path: "/dashboard/CategoriesManagement/Categories",
        element: <Categories></Categories>,
      },
      {
        path: "/dashboard/CategoriesManagement/Subcategory",
        element: <Subcategory></Subcategory>,
      },
      
      {
        path: "/dashboard/Settings/profile",
        element: <Profile></Profile>,
      },
      {
        path: "/dashboard/Settings/profile",
        element: <Profile></Profile>,
      },
      {
        path: "/dashboard/Settings/notification",
        element: <Notification></Notification>,
      },
      {
        path: "/dashboard/Settings/Terms&Condition",
        element: <TermsCondition></TermsCondition>,
      },
      {
        path: "/dashboard/Settings/FAQ",
        element: <FAQ></FAQ>,
      },
      {
        path: "/dashboard/Settings/aboutUs",
        element: <About></About>,
      },
      {
        path: "/dashboard/Settings/PrivacyPolicy",
        element: <PrivacyPolicy></PrivacyPolicy>,
      },
    ],
  },

  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/forgot-password",
    element: <ForgetPass></ForgetPass>,
  },
  {
    path: "/verification",
    element: <Verify></Verify>,
  },
  {
    path: "/reset-password",
    element: <ResetPass></ResetPass>,
  },
]);
