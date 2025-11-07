// src/App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

function App() {
  const [data, setData] = useState([]);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [newData, setNewData] = useState({ category: "", value: "" });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get("http://localhost:5000/api/data")
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  };

  const handleInputChange = (e) => {
    setNewData({ ...newData, [e.target.name]: e.target.value });
  };

  const handleAddData = (e) => {
    e.preventDefault();
    if (!newData.category || !newData.value) return;

    axios.post("http://localhost:5000/api/data", { 
      category: newData.category, 
      value: Number(newData.value) 
    })
      .then(res => {
        fetchData();
        setNewData({ category: "", value: "" });
      })
      .catch(err => console.error(err));
  };

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  const sidebarStyle = {
    width: "220px",
    background: "#1f2937",
    color: "#fff",
    minHeight: "100vh",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    position: "fixed"
  };

  const menuItemStyle = (menu) => ({
    padding: "12px",
    margin: "8px 0",
    borderRadius: "8px",
    cursor: "pointer",
    background: activeMenu === menu ? "#374151" : "transparent",
    transition: "0.3s"
  });

  const headerStyle = {
    height: "60px",
    background: "#f9fafb",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000
  };

  const mainContentStyle = {
    marginLeft: "240px",
    padding: "30px",
    background: "#f4f6f8",
    minHeight: "100vh"
  };

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    padding: "20px",
    margin: "10px",
    minWidth: "250px",
    flex: 1,
    textAlign: "center"
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h2 style={{ marginBottom: "30px" }}>Admin Panel</h2>
        <div style={menuItemStyle("dashboard")} onClick={() => setActiveMenu("dashboard")}>Dashboard</div>
        <div style={menuItemStyle("reports")} onClick={() => setActiveMenu("reports")}>Reports</div>
        <div style={menuItemStyle("settings")} onClick={() => setActiveMenu("settings")}>Settings</div>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        <div style={headerStyle}>
          <h2 style={{ color: "#111827" }}>{activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}</h2>
        </div>

        {/* Dashboard */}
        {activeMenu === "dashboard" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", marginTop: "20px" }}>
              <div style={cardStyle}>
                <h3>Total Categories</h3>
                <p style={{ fontSize: "28px", fontWeight: "bold", color: "#0088FE" }}>{data.length}</p>
              </div>
              <div style={cardStyle}>
                <h3>Total Value</h3>
                <p style={{ fontSize: "28px", fontWeight: "bold", color: "#00C49F" }}>{totalValue}</p>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around", marginTop: "40px" }}>
              <div style={cardStyle}>
                <h3>Bar Chart</h3>
                <BarChart width={400} height={300} data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </div>

              <div style={cardStyle}>
                <h3>Line Chart</h3>
                <LineChart width={400} height={300} data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={3} />
                </LineChart>
              </div>

              <div style={cardStyle}>
                <h3>Pie Chart</h3>
                <PieChart width={400} height={300}>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </div>
          </>
        )}

        {/* Reports */}
        {activeMenu === "reports" && (
          <div style={{ marginTop: "30px" }}>
            <h3>Chart Data Table</h3>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "10px", overflow: "hidden" }}>
              <thead>
                <tr style={{ background: "#1f2937", color: "#fff" }}>
                  <th style={{ padding: "10px" }}>Category</th>
                  <th style={{ padding: "10px" }}>Value</th>
                  <th style={{ padding: "10px" }}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr key={item._id}>
                    <td style={{ padding: "10px" }}>{item.category}</td>
                    <td style={{ padding: "10px" }}>{item.value}</td>
                    <td style={{ padding: "10px" }}>{new Date(item.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Settings */}
        {activeMenu === "settings" && (
          <div style={{ marginTop: "30px", background: "#fff", padding: "20px", borderRadius: "10px" }}>
            <h3>Add New Chart Data</h3>
            <form onSubmit={handleAddData}>
              <div style={{ marginBottom: "15px" }}>
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={newData.category}
                  onChange={handleInputChange}
                  style={{ padding: "10px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <input
                  type="number"
                  name="value"
                  placeholder="Value"
                  value={newData.value}
                  onChange={handleInputChange}
                  style={{ padding: "10px", width: "100%", borderRadius: "8px", border: "1px solid #ccc" }}
                />
              </div>
              <button type="submit" style={{ padding: "10px 20px", background: "#0088FE", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>
                Add Data
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
