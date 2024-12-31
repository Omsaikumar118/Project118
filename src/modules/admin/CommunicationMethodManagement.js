/**
 * CommunicationMethodManagement Component
 * 
 * Purpose: Manages communication methods and their properties
 * Features:
 * - Add/Edit communication methods
 * - Set sequence and mandatory flags
 * - Display method list
 * - Search and filter methods
 * - Form validation
 * - Success/Error notifications
 */

import React, { useState } from 'react';
import { BsPlus, BsPencil, BsTrash, BsSearch } from 'react-icons/bs';

// Mock data for initial display
const mockMethods = [
  {
    id: 1,
    name: "Email",
    description: "Standard email communication",
    icon: "fa-envelope",
    color: "#3b82f6",
    priority: 1,
    isActive: true
  },
  {
    id: 2,
    name: "Phone Call",
    description: "Direct phone communication",
    icon: "fa-phone",
    color: "#10b981",
    priority: 2,
    isActive: true
  },
  {
    id: 3,
    name: "Video Meeting",
    description: "Virtual face-to-face meeting",
    icon: "fa-video",
    color: "#6366f1",
    priority: 3,
    isActive: true
  },
  {
    id: 4,
    name: "SMS",
    description: "Text message communication",
    icon: "fa-comment",
    color: "#f59e0b",
    priority: 4,
    isActive: true
  },
  {
    id: 5,
    name: "In-Person Meeting",
    description: "Physical face-to-face meeting",
    icon: "fa-users",
    color: "#ec4899",
    priority: 5,
    isActive: true
  }
];

const CommunicationMethodManagement = () => {
  const [methods, setMethods] = useState(mockMethods);
  const [editingMethod, setEditingMethod] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const initialFormState = {
    name: '',
    description: '',
    icon: '',
    color: '#3b82f6',
    priority: 5,
    isActive: true
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingMethod) {
      setMethods(methods.map(method =>
        method.id === editingMethod.id ? { ...formData, id: method.id } : method
      ));
    } else {
      setMethods([...methods, { ...formData, id: Date.now() }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingMethod(null);
    setShowForm(false);
  };

  const handleEdit = (method) => {
    setEditingMethod(method);
    setFormData(method);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this method?')) {
      setMethods(methods.filter(method => method.id !== id));
    }
  };

  const filteredMethods = methods.filter(method =>
    method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    method.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="communication-management">
      <div className="section-header">
        <div className="search-box">
          <BsSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search methods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <BsPlus /> Add Method
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editingMethod ? 'Edit Method' : 'Add New Method'}</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Method Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="icon">Icon (Font Awesome class) *</label>
              <input
                type="text"
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                required
                placeholder="e.g., fa-envelope"
              />
            </div>

            <div className="form-group">
              <label htmlFor="color">Color</label>
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <input
                type="number"
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                min="1"
                max="10"
              />
            </div>

            <div className="form-group">
              <label htmlFor="isActive">Status</label>
              <select
                id="isActive"
                name="isActive"
                value={formData.isActive}
                onChange={handleInputChange}
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Describe the communication method..."
              />
            </div>

            <div className="form-actions full-width">
              <button type="submit" className="btn btn-primary">
                {editingMethod ? 'Update Method' : 'Add Method'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Method Name</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMethods.map(method => (
              <tr key={method.id}>
                <td>
                  <div className="method-name">
                    <i className={`fas ${method.icon}`} style={{ color: method.color }} />
                    <span>{method.name}</span>
                  </div>
                </td>
                <td>{method.description}</td>
                <td>{method.priority}</td>
                <td>
                  <span className={`status-badge ${method.isActive ? 'active' : 'inactive'}`}>
                    {method.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(method)}
                      title="Edit"
                    >
                      <BsPencil />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(method.id)}
                      title="Delete"
                    >
                      <BsTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommunicationMethodManagement;
