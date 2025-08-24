import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PanelStyles.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import LogoutButton from "./LogoutButton";

const AdminPanel = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [attendances, setAttendances] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/members");
      setMembers(response.data);
    } catch (error) {
      console.error("Failed to fetch members", error);
    }
  };

  const fetchAttendances = async (memberId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/member/${memberId}/attendances`);
      const dates = response.data.map((a) => new Date(a.date));
      setAttendances(dates);
    } catch (error) {
      console.error("Failed to fetch attendances", error);
    }
  };

  const sellCourse = async (memberId) => {
    try {
      await axios.post(`http://localhost:8080/api/admin/sell/${memberId}`);
      alert("Course bundle sold!");
      fetchMembers(); 
    } catch (error) {
      console.error("Failed to sell course", error);
    }
  };

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    fetchAttendances(member.uid);
  };

  return (
    <div className="admin-container">
      <LogoutButton />
      <h1>Admin Panel-Welcome</h1>
      <div className="member-list">
        <h2>Members</h2>
        <div className="member-card-list">
          {members.map((member) => (
            <div
              className={`member-card ${member.remainingCourses === 0 ? "no-course" : ""}`}
              key={member.uid}
              onClick={() => handleSelectMember(member)}
            >
              <p><strong>{member.username}</strong></p>
              <p>Email: {member.email}</p>
              <p>Remaining Courses: {member.remainingCourses}</p>
              <button onClick={(e) => { e.stopPropagation(); sellCourse(member.uid); }}>
                Sell Course Bundle
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedMember && (
        <div className="calendar-section">
          <h2>Attendance Calendar for {selectedMember.username}</h2>
          <Calendar
            tileClassName={({ date }) =>
              attendances.some((d) => new Date(d).toLocaleDateString() === date.toLocaleDateString()) ? "highlight-member" : ""
            }
          />
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
