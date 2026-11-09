import React, { useEffect, useState } from 'react';
import { socket } from '../socket';

const Notification = () => {
  const [notif, setNotif] = useState(null);

  useEffect(() => {
    // Listen for order updates
    socket.on('order_update', (data) => {
      setNotif(data.message);
      // Auto-hide after 5 seconds
      setTimeout(() => setNotif(null), 5000);
    });

    return () => socket.off('order_update');
  }, []);

  if (!notif) return null;

  return (
    <div style={styles.toast} className="slide-up">
      <div style={styles.goldLine}></div>
      <p style={styles.text}>{notif}</p>
      <button style={styles.close} onClick={() => setNotif(null)}>✕</button>
    </div>
  );
};

const styles = {
  toast: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #1a1a1a',
    padding: '20px 30px',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
  },
  goldLine: { width: '3px', height: '100%', backgroundColor: '#D4AF37', position: 'absolute', left: 0, top: 0 },
  text: { color: '#fff', fontSize: '0.85rem', letterSpacing: '1.5px', margin: 0, textTransform: 'uppercase' },
  close: { background: 'none', border: 'none', color: '#555', cursor: 'pointer' }
};

export default Notification;