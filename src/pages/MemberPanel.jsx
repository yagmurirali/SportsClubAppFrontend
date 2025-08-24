import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./PanelStyles.css";
import LogoutButton from "./LogoutButton";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const MemberPanel = () => {
  const [memberId, setMemberId] = useState(null);
  const [remainingCourses, setRemainingCourses] = useState(0);
  const [attendances, setAttendances] = useState([]);
  const [username, setUsername] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileInfo, setProfileInfo] = useState(null);
  const gyms = [
    { name: "SClub 1", lat: 41.015137, lng: 28.979530 },
    { name: "SClub 2", lat: 41.0082, lng: 28.9784 },
    { name: "SClub 3", lat: 40.9901, lng: 29.0293 },
    { name: "SClub 4", lat: 41.0305, lng: 28.9936 },    
    { name: "SClub 5", lat: 40.9983, lng: 29.0450 },    
    { name: "SClub 6", lat: 41.0380, lng: 28.8966 },    
    { name: "SClub 7", lat: 41.0250, lng: 29.1100 },    
    { name: "SClub 8", lat: 41.0660, lng: 28.9861 },    
    { name: "SClub 9", lat: 40.9610, lng: 29.0802 }     
  ];

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);
    if (storedUsername) {
      fetchMemberId(storedUsername);
    }
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
});

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMemberId = async (uname) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/member/username/${uname}/id`);
      const id = response.data;
      setMemberId(id);
      fetchRemainingCourses(id);
      fetchAttendances(id);
    } catch (error) {
      console.error("Failed to fetch member ID", error);
    }
  };

  const fetchRemainingCourses = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/member/${id}/remaining`);
      setRemainingCourses(response.data);
    } catch (error) {
      console.error("Failed to fetch remaining courses", error);
    }
  };

  const fetchAttendances = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/member/${id}/attendances`);
      const dates = response.data.map((a) => new Date(a.date));
      setAttendances(dates);
    } catch (error) {
      console.error("Failed to fetch attendances", error);
    }
  };

  const buyCourseBundle = async () => {
    try {
      await axios.post(`http://localhost:8080/api/member/${memberId}/buy`);
      alert("Course bundle purchased!");
      fetchRemainingCourses(memberId);
    } catch (error) {
      console.error("Failed to buy course bundle", error);
    }
  };

  const addAttendance = async () => {
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }
    const formattedDate = selectedDate.toISOString().split("T")[0];
    try {
      await axios.post(`http://localhost:8080/api/member/${memberId}/attendance`, {
        date: formattedDate,
      });
      alert("Attendance recorded!");
      fetchAttendances(memberId);
      fetchRemainingCourses(memberId);
    } catch (error) {
      console.error("Failed to add attendance", error);
    }
  };

  const toggleProfile = async () => {
    setShowProfile(!showProfile);
    if (!profileInfo && !showProfile) {
      try {
        const res = await axios.get(`http://localhost:8080/api/member/username/${username}/details`);
        setProfileInfo({
          username: res.data.username,
          email: res.data.email,
          phone: res.data.phone,
          remainingCourses: res.data.remainingCourses,
        });
      } catch (err) {
        console.error("Failed to fetch profile info", err);
      }
    }
  };

  return (
    <div className="member-container">
      <LogoutButton />
      <h1>Welcome, {username}</h1>

      <div className="member-info">
        <button onClick={toggleProfile}>
          {showProfile ? "Hide Profile Info" : "Show Profile Info"}
        </button>

        {showProfile && profileInfo && (
          <div className="profile-card">
            <h3>👤 Profile Information</h3>
            <p><strong>Username:</strong> {profileInfo.username}</p>
            <p><strong>Email:</strong> {profileInfo.email}</p>
            <p><strong>Phone:</strong> {profileInfo.phone}</p>
          </div>
        )}

        <p><strong>Remaining Courses:</strong> {remainingCourses}</p>
        <button onClick={buyCourseBundle}>Buy Course Bundle</button>
      </div>

      <div className="calendar-section">
        <h2>My Attendance Calendar</h2>
        <Calendar
          onClickDay={(date) => {
            setSelectedDate(date);
          }}
          tileClassName={({ date }) => {
            const isAttendance = attendances.some((d) => new Date(d).toDateString() === date.toDateString());
            if (isAttendance) return "attendance-day";
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            if (isSelected) return "selected-day";
            return null;
          }}
        />
        {selectedDate && (
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <p>Selected: {selectedDate.toDateString()}</p>
            <button className="add-attendance-button" onClick={addAttendance}>
              Add Attendance
            </button>
          </div>
        )}
      </div>
      <div className="map-container">
        <h2>Nearby Gym Locations</h2>
        <MapContainer center={[41.015137, 28.979530]} zoom={12} style={{ height: "300px", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {gyms.map((gym, index) => (
            <Marker key={index} position={[gym.lat, gym.lng]}>
              <Popup>{gym.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MemberPanel;
