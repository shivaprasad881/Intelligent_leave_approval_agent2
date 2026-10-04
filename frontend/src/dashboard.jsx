import React, { useState } from "react";

function Dashboard() {
  const [user_requested_text, setUser_requested_text] = useState("");
  const [response, setResponse] = useState(null);
  const [calendarDates, setCalendarDates] = useState([]);
  const [confirmDate, setConfirmDate] = useState(null);   // NEW: stores clicked date for confirmation

  const handleClick = async () => {
    let userdata = {
      empid: "EMP005",
      user_requested_text: user_requested_text,
    };

    const res = await fetch("http://localhost:8000/send_user_request_to_backend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userdata),
    });

    const data = await res.json();
    setResponse(data);
  };

  const getcalenderdates = async () => {
    try {
      const res = await fetch("http://localhost:8000/get_calender_dates", {
        method: "GET",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setCalendarDates(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setResponse({ error: err.message });
    }
  };

  const handleDateClick = (item) => {
    setConfirmDate(item);   // NEW: just store the clicked item, show popup — no API call yet
  };

  // NEW: reason state for the popup
  const [toggleReason, setToggleReason] = useState("");

  const handleCancel = () => {
    setConfirmDate(null);
    setToggleReason("");   // clear reason on cancel
  };

const handleConfirm = async () => {
    if (!toggleReason.trim()) return;   // block if reason is empty

    let userdata = {
      clicked_date: confirmDate.date,
      reason: toggleReason,
    };

    const res = await fetch("http://localhost:8000/toggle_the_clicked_date", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userdata),
    });

    setConfirmDate(null);
    setToggleReason("");   // clear reason after confirm
    getcalenderdates();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Dashboard</h2>

      <input
        type="text"
        placeholder="Enter something..."
        value={user_requested_text}
        onChange={(e) => setUser_requested_text(e.target.value)}
        style={{ padding: "8px", width: "300px", marginRight: "10px" }}
      />

      <button onClick={handleClick} style={{ padding: "8px 16px" }}>
        Submit
      </button>

      <div
        style={{
          marginTop: "20px",
          padding: "12px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          minHeight: "60px",
          background: "#f9f9f9",
          whiteSpace: "pre-wrap",
        }}
      >
        {response ? JSON.stringify(response, null, 2) : "Response will appear here..."}
      </div>

      <br />

      <button onClick={getcalenderdates} style={{ padding: "8px 16px" }}>
        get_calender_dates
      </button>

      {/* Calendar dates display */}
      {calendarDates.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Calendar Dates</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {calendarDates.map((item, index) => (
              <div
                key={index}
                onClick={() => handleDateClick(item)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  background: item.isblacklisted ? "#ffcccc" : "#ccffcc",
                  color: item.isblacklisted ? "#cc0000" : "#006600",
                  fontWeight: "bold",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {item.date}
              </div>
            ))}
          </div>
          <div style={{ marginTop: "10px", fontSize: "12px" }}>
            <span style={{ color: "#cc0000", fontWeight: "bold" }}>■ Blacklisted</span>
            &nbsp;&nbsp;
            <span style={{ color: "#006600", fontWeight: "bold" }}>■ Available</span>
          </div>
        </div>
      )}

      {/* NEW: Confirmation popup */}
      {confirmDate && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "8px",
            minWidth: "300px",
            textAlign: "center",
          }}>
            <p style={{ marginBottom: "12px", fontWeight: "bold" }}>
              {confirmDate.isblacklisted
                ? `Remove blacklist for ${confirmDate.date}?`
                : `Blacklist ${confirmDate.date}?`}
            </p>

            {/* NEW: reason input */}
            <input
              type="text"
              placeholder="Enter reason (required)"
              value={toggleReason}
              onChange={(e) => setToggleReason(e.target.value)}
              style={{
                padding: "8px",
                width: "100%",
                marginBottom: "16px",
                boxSizing: "border-box",
                border: !toggleReason.trim() ? "1px solid #cc0000" : "1px solid #ccc",
                borderRadius: "4px",
              }}
            />

            <button
              onClick={handleCancel}
              style={{ padding: "8px 16px", marginRight: "12px" }}
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              disabled={!toggleReason.trim()}   // visually disabled when empty
              style={{
                padding: "8px 16px",
                background: !toggleReason.trim() ? "#ccc" : "#cc0000",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: !toggleReason.trim() ? "not-allowed" : "pointer",
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;