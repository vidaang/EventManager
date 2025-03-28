import { useState, useEffect } from 'react';
import "../../styles/index.css";

export default function RsoSettings () {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

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
      setMessage('Settings updated successfully!');
    } else {
      setMessage('Failed to update settings.');
    }
  };

  const handleRsoSubmit = async (e) => {
    e.preventDefault();
    
    // Update user data (replace with actual API call)
    const response = await fetch('/api/user/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      setMessage('Settings updated successfully!');
    } else {
      setMessage('Failed to update settings.');
    }
  };

  return (
    <div>
      <h2>Settings</h2>
      <div className="settings-container">
        <h3>RSO Information</h3>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleRsoSubmit}>
          {["name", "description"].map((field) => (
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
          <button type="submit">Save Changes</button>
          <button type="submit">Cancel</button>
        </form>
      </div>
      <div className="settings-container">
        <h3>Sign In Information</h3>

        {message && <p className="message">{message}</p>}
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
          <button type="submit">Cancel</button>
        </form>
      </div>
    </div>
  );
}