import React, { useState } from "react";
import { Calendar, Tabs } from "antd";

const { TabPane } = Tabs;

const Calender = () => {
  // ================================
  // 📌 Each Category Dates
  // ================================
  const atHomeDates = ["2025-12-01", "2025-12-07", "2025-12-14"];

  const oneToOneDates = ["2025-12-15", "2025-12-18"];

  const groupDates = ["2025-12-16"];

  const classesDates = ["2025-12-22"];

  // ================================
  // Function to Render Dates
  // ================================
  const renderCalendar = (dates, color) => {
    const dateCellRender = (value) => {
      const dateStr = value.format("YYYY-MM-DD");
      const isMatch = dates.includes(dateStr);

      return isMatch ? (
        <div
          className="flex justify-center items-center w-10 h-10 mx-auto rounded-full text-white"
          style={{ backgroundColor: color }}
        >
          {value.date()}
        </div>
      ) : (
        <div className="text-center">{value.date()}</div>
      );
    };

    return <Calendar dateCellRender={dateCellRender} fullscreen={true} />;
  };

  return (
    <div className="bg-white mt-4 p-4 shadow-md">
      <h2 className="text-xl font-semibold mb-5">Tuition Calendar</h2>

      <Tabs defaultActiveKey="1">
        {/* ================================
            TAB: At Home Tutoring
        ================================= */}
        <TabPane tab="At Home Tutoring" key="1">
          {renderCalendar(atHomeDates, "#004F44")}
        </TabPane>

        {/* ================================
            TAB: In Center → 1-1
        ================================= */}
        <TabPane tab="1-1 (In Center)" key="2">
          {renderCalendar(oneToOneDates, "#1E90FF")}
        </TabPane>

        {/* ================================
            TAB: In Center → Group
        ================================= */}
        <TabPane tab="Group (In Center)" key="3">
          {renderCalendar(groupDates, "#FF8C00")}
        </TabPane>

        {/* ================================
            TAB: In Center → Classes
        ================================= */}
        <TabPane tab="Classes (In Center)" key="4">
          {renderCalendar(classesDates, "#8A2BE2")}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Calender;
