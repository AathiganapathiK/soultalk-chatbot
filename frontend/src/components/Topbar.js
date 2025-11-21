import React, { useState, useRef, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import GoogleLoginButton from './GoogleLoginButton';

const Topbar = ({ user, onLogout, setUser }) => {
  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdown(!dropdown);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };

    if (dropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdown]);

  return (
    <div className="glass-nav" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      background: 'rgba(20,20,20,0.85)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #2c2c35',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      color: '#f5f5f5',
      fontFamily: 'Calibri'
    }}>
      {/* Left: Navbar brand */}
      <span className="navbar-brand fw-bold fs-3 gradient-text" style={{
        background: 'linear-gradient(90deg, #ff6ec7, #61daefff)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        cursor: 'default'
      }}>
        SoulTalk 💬
      </span>

      {/* Right: User profile */}
      {user && (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <img
            src={user.photoURL}
            alt="Profile"
            width={42}
            height={42}
            style={{
              borderRadius: '50%',
              cursor: 'pointer',
              border: '2px solid #fff',
              transition: 'transform 0.2s ease'
            }}
            onClick={toggleDropdown}
            onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
          />
          {dropdown && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: 0,
              background: 'rgba(30,30,40,0.95)',
              border: '1px solid #3a3a48',
              borderRadius: '10px',
              boxShadow: '0px 4px 12px rgba(0,0,0,0.3)',
              padding: '12px',
              minWidth: '200px',
              zIndex: 1000,
              color: '#f5f5f5'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '0.95em' }}>
                {user.displayName}
              </div>
              <div style={{ fontSize: '0.85em', color: '#c5c5c5', marginBottom: '10px' }}>
                {user.email}
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #3a3a48', margin: '10px 0' }} />
              <button
                onClick={handleLogout}
                style={{
                  background: 'linear-gradient(135deg, #c444efff, #1674f9ff)',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  width: '100%',
                  transition: 'opacity 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = 0.85}
                onMouseOut={(e) => e.currentTarget.style.opacity = 1}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Show Google Login Button if no user */}
      {!user && <GoogleLoginButton onLogin={setUser} />}
    </div>
  );
};

export default Topbar;