import React, { useState } from 'react';
import "../../styles/index.css";

const rsos = [
  { id: 1, name: "Tech Club", university_id: 1, admin_id: 2, status: "pending" },
  { id: 2, name: "Science Society", university_id: 1, admin_id: 2, status: "active" },
  { id: 3, name: "Debate Team", university_id: 1, admin_id: 2, status: "active" },
  { id: 4, name: "Photography Club", university_id: 1, admin_id: 2, status: "pending" },
  { id: 5, name: "AI Research Group", university_id: 1, admin_id: 2, status: "active" },
  { id: 6, name: "Environmental Club", university_id: 1, admin_id: 2, status: "pending" },
  { id: 7, name: "Music Ensemble", university_id: 1, admin_id: 2, status: "active" },
  { id: 8, name: "Cooking Club", university_id: 1, admin_id: 2, status: "pending" }
];

const students = [
    { id: 1, first_name: "Emma", last_name: "Johnson", email: "emmajohnson@example.com", status: "pending", rso_name: ["Science Society", "Tech Club"], role: "student", university_id: 1 },
    { id: 2, first_name: "Liam", last_name: "Brown", email: "liambrown@example.com", status: "pending", rso_name: ["Science Society"], role: "ss_rso_admin", university_id: 1 },
    { id: 3, first_name: "Olivia", last_name: "Miller", email: "oliviamiller@example.com", status: "pending", rso_name: ["Debate Team"], role: "student", university_id: 1 },
    { id: 4, first_name: "Noah", last_name: "Davis", email: "noahdavis@example.com", status: "pending", rso_name: ["Debate Team", "AI Research Group"], role: "student", university_id: 1 },
    { id: 5, first_name: "Ava", last_name: "Garcia", email: "avagarcia@example.com", status: "pending", rso_name: ["Photography Club"], role: "pc_rso_admin", university_id: 1 },
    { id: 6, first_name: "William", last_name: "Martinez", email: "williammartinez@example.com", status: "pending", rso_name: ["AI Research Group"], role: "student", university_id: 1 },
    { id: 7, first_name: "David", last_name: "Wilson", email: "davidwilson@example.com", status: "pending", rso_name: ["Tech Club"], role: "student", university_id: 7 },
    { id: 8, first_name: "Sophia", last_name: "Martinez", email: "sophiamartinez@example.com", status: "pending", rso_name: ["Tech Club", "Environmental Club"], role: "tch_rso_admin", university_id: 8 },
    { id: 9, first_name: "James", last_name: "Lopez", email: "jameslopez@example.com", status: "pending", rso_name: ["Environmental Club"], role: "student", university_id: 1 },
    { id: 10, first_name: "Isabella", last_name: "Taylor", email: "isabellataylor@example.com", status: "pending", rso_name: ["Music Ensemble"], role: "me_rso_admin", university_id: 1 },
    { id: 11, first_name: "Mason", last_name: "Anderson", email: "masonanderson@example.com", status: "pending", rso_name: ["Cooking Club"], role: "student", university_id: 1 }
  ];    

export default function UniDashboard() {
  const [rsoList, setRsoList] = useState(rsos);
  const [studentList, setStudentList] = useState(students);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("PendingRSO");
  
  const openEditModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const handleEditChange = (e) => {
    setSelectedItem({ ...selectedItem, [e.target.name]: e.target.value });
  };

  const approveStudent = async (student) => {
    const isConfirmed = alert(`Are you sure you want to approve ${student.first_name} ${student.last_name}?`);
  
    if (!isConfirmed) return;
  
    try {
      const response = await fetch(`https://your-api.com/user/${student.id}`, {
        method: "UPDATE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      alert("Student approved successfully!");

      window.location.reload();
    } catch (error) {
      alert("Failed to delete university: " + error.message);
    }
  };

  const denyStudent = async (student) => {
    const isConfirmed = alert(`Are you sure you want to deny ${student.first_name} ${student.last_name}?`);
  
    if (!isConfirmed) return;
  
    try {
      const response = await fetch(`https://your-api.com/user/${student.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      alert("RSO denied successfully!");

      window.location.reload();
    } catch (error) {
      alert("Failed to deny university: " + error.message);
    }
  };

  const approveRSO = async (rso) => {
    const isConfirmed = alert(`Are you sure you want to approve ${rso.name}?`);
  
    if (!isConfirmed) return;
  
    try {
      const response = await fetch(`https://your-api.com/user/${rso.id}`, {
        method: "UPDATE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      alert("RSO approved successfully!");

      window.location.reload();
    } catch (error) {
      alert("Failed to delete university: " + error.message);
    }
  };

  const denyRSO = async (rso) => {
    const isConfirmed = alert(`Are you sure you want to deny ${rso.name}?`);
  
    if (!isConfirmed) return;
  
    try {
      const response = await fetch(`https://your-api.com/user/${rso.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      alert("RSO denied successfully!");

      window.location.reload();
    } catch (error) {
      alert("Failed to deny university: " + error.message);
    }
  };

  const deleteRSO = async (rso) => {
    const isConfirmed = alert(`Are you sure you want to delete ${rso.name}?`);
  
    if (!isConfirmed) return;
  
    try {
      const response = await fetch(`https://your-api.com/rso/${rso.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      alert("RSO deleted successfully!");

      window.location.reload();
    } catch (error) {
      alert("Failed to delete rso: " + error.message);
    }
  };

  const deleteUser = async (user) => {
    const isConfirmed = alert(`Are you sure you want to delete ${user.first_name} ${user.last_name}?`);
  
    if (!isConfirmed) return;
  
    try {
      const response = await fetch(`https://your-api.com/user/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      alert("RSO deleted successfully!");

      window.location.reload();
    } catch (error) {
      alert("Failed to delete user: " + error.message);
    }
  };

  const saveChanges = () => {
    if (activeTab === "PendingRSO") {
      setRsoList(rsoList.map(rso => (rso.id === selectedItem.id ? selectedItem : rso)));
    } else if (activeTab === "PendingStudents") {
      setRsoList(rsoList.map(rso => (rso.id === selectedItem.id ? selectedItem : rso)));
    } else if (activeTab === "RSOs") {
      setRsoList(rsoList.map(rso => (rso.id === selectedItem.id ? selectedItem : rso)));
    } else if (activeTab === "Students") {
      setStudentList(studentList.map(student => (student.id === selectedItem.id ? selectedItem : student)));
    }
    closeEditModal();
  };

  return (
    <div>
      <h2>Uni Dashboard</h2>
      <div className="table-tabs">
        <button
          className={`admin-tabs ${activeTab === "PendingRSO" ? "active" : ""}`}
          onClick={() => setActiveTab("PendingRSO")}
        >
          Pending RSOs
        </button>
        <button
          className={`admin-tabs ${activeTab === "PendingStudents" ? "active" : ""}`}
          onClick={() => setActiveTab("PendingStudents")}
        >
          Pending Students
        </button>
        <button
          className={`admin-tabs ${activeTab === "RSOs" ? "active" : ""}`}
          onClick={() => setActiveTab("RSOs")}
        >
          Manage RSOs
        </button>
        <button
          className={`admin-tabs ${activeTab === "Students" ? "active" : ""}`}
          onClick={() => setActiveTab("Students")}
        >
          Manage Students
        </button>
      </div>
      <table>
        <thead>
          <tr>
          {/* HEADINGS FOR THE DIFFERENT TABLE TABS */}
            {activeTab === "PendingRSO" && 
              <>
                <th>University Name</th>
                <th>Status</th>
              </>}
            {activeTab === "PendingStudents" && 
              <>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Status</th>
              </>}
            {activeTab === "RSOs" && 
              <>
                <th>RSO Name</th>
                <th>Status</th>
              </>}
            {activeTab === "Students" && 
              <>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Afilliated RSO</th>
                <th>Role</th>
              </>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {/* PENDING RSO APPROVALS TAB */}
          {activeTab === "PendingRSO" && rsos.map(rso => (
                <tr key={rso.id}>
                <td>{rso.name}</td>
                <td>{rso.status}</td>
                <td>
                    <button          
                    type="submit"
                    onClick={() => approveRSO(rso)}>
                    Approve
                    </button>
                    <button          
                    type="submit"
                    onClick={() => denyRSO(rso)}>
                    Deny
                    </button>
                </td>
                </tr>
            ))}
        {/* PENDING STUDENT APPROVALS TAB */}
          {activeTab === "PendingStudents" && studentList.map(student => (
                <tr key={student.id}>
              <td>{student.first_name}</td>
              <td>{student.last_name}</td>                
              <td>{student.status}</td>
                <td>
                    <button          
                    type="submit"
                    onClick={() => approveStudent(student)}>
                    Approve
                    </button>
                    <button          
                    type="submit"
                    onClick={() => denyStudent(student)}>
                    Deny
                    </button>
                </td>
                </tr>
            ))}
          {/* MANAGE RSO TAB */}
          {activeTab === "RSOs" && rsoList.map(rso => (
            <tr key={rso.id}>
              <td>{rso.name}</td>
              <td>{rso.status}</td>
              <td>
                <button          
                  type="submit"
                  onClick={() => openEditModal(rso)}>
                  Edit
                </button>
                <button          
                  type="submit"
                  onClick={() => deleteRSO(rso)}>
                  Delete
                </button>
              </td>            
            </tr>
          ))}
          {/* MANAGE STUDENTS TAB */}
          {activeTab === "Students" && studentList.map(student => (
            <tr key={student.id}>
              <td>{student.first_name}</td>
              <td>{student.last_name}</td>
              <td>{student.email}</td>
              <td>{Array.isArray(student.rso_name) ? student.rso_name.join(", ") : student.rso_name}</td>
              <td>{student.role}</td>
              <td>
                <button          
                  type="submit"
                  onClick={() => openEditModal(student)}>
                  Edit
                </button>
                <button          
                  type="submit"
                  onClick={() => deleteUser(student)}>
                  Delete
                </button>
              </td>            
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={closeEditModal}>&times;</button>
            <h2 className="modal-title">Edit Details</h2>
            {selectedItem && Object.keys(selectedItem).map((key) => {
                switch (key) {
                    case "name":
                    return (
                        <label key={key}>
                        {key}: 
                        <input type="name" name={key} value={selectedItem[key]} onChange={handleEditChange} />
                        </label>
                    );
                    case "first_name":
                    return (
                        <label key={key}>
                        {key}: 
                        <input type="first_name" name={key} value={selectedItem[key]} onChange={handleEditChange} />
                        </label>
                    );
                    case "last_name":
                    return (
                        <label key={key}>
                        {key}: 
                        <input type="last_name" name={key} value={selectedItem[key]} onChange={handleEditChange} />
                        </label>
                    );
                    case "status":
                    return (
                        <label key={key}>
                        {key}: 
                        <select name={key} value={selectedItem[key]} onChange={handleEditChange}>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                        </select>
                        </label>
                    );
                    case "role":
                        return (
                          <label key={key}>
                            {key}: 
                            <select name={key} value={selectedItem[key]} onChange={handleEditChange}>
                              <option value="student">Student</option>
                              <option value="rso_admin">RSO Admin</option>
                            </select>
                          </label>
                        );
                default:
              }
            })}
            <div className="modal-buttons">
                <button className="save-btn" onClick={saveChanges}>Save</button>
                <button className="cancel-btn" onClick={closeEditModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}