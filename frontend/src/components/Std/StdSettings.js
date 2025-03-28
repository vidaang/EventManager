import { useState, useEffect } from 'react';
import "../../styles/index.css";

export default function StdSettings () {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [userMessage, setUserMessage] = useState('');
  const [rsoMessage, setRsoMessage] = useState('');


  useEffect(() => {
    // Fetch user data (replace with actual API call)
    fetch('/api/user')
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error('Error fetching user data:', err));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    
    // Update user data (replace with actual API call)
    const response = await fetch('/api/user/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      setUserMessage('Settings updated successfully!');
    } else {
      setUserMessage('Failed to update settings.');
    }
  };

  const handleRSOSubmit = async (e) => {
    e.preventDefault();
    
    // Update user data (replace with actual API call)
    const response = await fetch('/api/user/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      setRsoMessage('RSO request successfully sent!');
    } else {
      setRsoMessage('Failed to submit RSO request.');
    }
  };

  return (
    <div>
      <h2>Settings</h2>
      <div className="settings-container">
        <h3>Sign In Information</h3>
        {userMessage && <p className="userMessage">{userMessage}</p>}
        <form onSubmit={handleUserSubmit}>
          {["first_name", "last_name", "email", "password", "retype_password"].map((field) => (
            <div className="form-group" key={field}>
              <label htmlFor={field}>{field.replace("_", " ")}:</label>
              <input
                type={field === "password" ? "password" : "text"}
                id={field}
                name={field}
                value={user[field]}
                onChange={handleChange}
              />
            </div>
          ))}
          <button type="submit">Save Changes</button>
        </form>
      </div>
      <div className="settings-container">
        <h3>Request to Form RSO</h3>
        {rsoMessage && <p className="rsoMessage">{rsoMessage}</p>}
        <form onSubmit={handleRSOSubmit}>
          {["rso_name", "description", "email_1", "email_2", "email_3", "email_4"].map((field) => (
            <div className="form-group" key={field}>
              <label htmlFor={field}>{field.replace("_", " ")}:</label>
              <input
                type={field}
                id={field}
                name={field}
                value={user[field]}
                onChange={handleChange}
              />
            </div>
          ))}
          <button type="submit">Submit Request</button>
        </form>
      </div>
    </div>
  );
}