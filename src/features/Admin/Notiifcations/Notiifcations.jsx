import React, { useState } from 'react';
import { FaFileAlt, FaClock, FaCheckCircle, FaExclamationCircle, FaUser, FaBell } from 'react-icons/fa';


function Notiifcations() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'purchase',
      title: 'New Purchase Order #PO-2024-089 requires your approval',
      from: 'Client: ABC Corporation',
      time: '2 hours ago',
      read: false,
      category: 'Today'
    },
    {
      id: 2,
      type: 'timesheet',
      title: 'Timesheet submission reminder',
      description: 'Please submit your timesheet for the week ending Jan 14',
      time: '3 hours ago',
      read: false,
      category: 'Today'
    },
    {
      id: 3,
      type: 'project',
      title: 'Project "Holiday Package Design" completed',
      description: 'All deliverables have been approved',
      time: 'Yesterday at 4:24 PM',
      read: true,
      category: 'Yesterday'
    },
    {
      id: 4,
      type: 'invoice',
      title: 'Invoice #INV-2024-045 is overdue',
      description: 'Payment was due on Jan 10, 2024',
      time: 'Yesterday at 2:15 PM',
      read: false,
      category: 'Yesterday'
    },
    {
      id: 5,
      type: 'team',
      title: 'New team member added to Project "Brand Guidelines"',
      description: 'Sarah Johnson has joined as Junior Designer',
      time: 'Jan 11, 2024',
      read: false,
      category: 'Earlier'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'purchase':
        return <FaFileAlt />;
      case 'timesheet':
        return <FaClock />;
      case 'project':
        return <FaCheckCircle />;
      case 'invoice':
        return <FaExclamationCircle />;
      case 'team':
        return <FaUser />;
      default:
        return <FaBell />;
    }
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case 'purchase':
        return 'bg-primary bg-opacity-10';
      case 'timesheet':
        return 'bg-warning bg-opacity-10';
      case 'project':
        return 'bg-success bg-opacity-10';
      case 'invoice':
        return 'bg-danger bg-opacity-10';
      case 'team':
        return 'bg-info bg-opacity-10';
      default:
        return '';
    }
  };

  const filteredNotifications = notifications.filter(notif =>
    selectedCategory === 'All Categories' || notif.type === selectedCategory.toLowerCase()
  );

  const categories = ['All Categories', 'Purchase', 'Timesheet', 'Project', 'Invoice', 'Team'];

  return (
    <div className="container-fluid py-4">
      <div className="notifications-container bg-white rounded shadow-sm p-4">
        <div className="notification-header d-flex justify-content-between align-items-center mb-4">
      <h3>Notiifcations</h3>
          <div className="d-flex align-items-center">
            <select
              className="form-select me-3"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-link text-decoration-none text-muted"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        </div>

        {['Today', 'Yesterday', 'Earlier'].map(category => {
          const categoryNotifications = filteredNotifications.filter(n => n.category === category);
          if (categoryNotifications.length === 0) return null;

          return (
            <div key={category} className="mb-4">
              <h6 className="text-muted mb-3">{category}</h6>
              {categoryNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-card mb-3 p-3 bg-light rounded-3 position-relative ${!notification.read ? 'unread' : ''}`}
                >
                  <div className="d-flex align-items-start">
                    <div className={`notification-icon rounded-circle p-2 me-3 ${getNotificationClass(notification.type)}`}>
                      <span className="fs-5">{getNotificationIcon(notification.type)}</span>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="notification-title mb-1 fw-semibold">{notification.title}</h6>
                      {notification.from && <p className="text-muted small mb-1">{notification.from}</p>}
                      {notification.description && <p className="text-muted small mb-1">{notification.description}</p>}
                      <span className="text-muted smaller d-block">{notification.time}</span>
                    </div>
                    <button
                      className="btn-close position-absolute top-0 end-0 mt-2 me-2"
                      onClick={() => removeNotification(notification.id)}
                      aria-label="Close"
                    ></button>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Notiifcations;
