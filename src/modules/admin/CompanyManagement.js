import React, { useState } from 'react';
import { BsPlus, BsPencil, BsTrash, BsSearch } from 'react-icons/bs';
import CompanyForm from './CompanyForm';

// Mock data for initial display
const mockCompanies = [
  {
    id: 1,
    companyName: "Tech Solutions Inc",
    email: "contact@techsolutions.com",
    phone: "+1-234-567-8900",
    address: "123 Tech Park, Silicon Valley",
    status: "active",
    industry: "Technology",
    website: "www.techsolutions.com",
    contactPerson: "",
    communicationPreference: "",
    notes: "",
    lastContactDate: "",
    nextFollowUp: ""
  },
  {
    id: 2,
    companyName: "Global Innovations Ltd",
    email: "info@globalinnovations.com",
    phone: "+1-345-678-9012",
    address: "456 Innovation Hub, New York",
    status: "active",
    industry: "Research",
    website: "www.globalinnovations.com",
    contactPerson: "",
    communicationPreference: "",
    notes: "",
    lastContactDate: "",
    nextFollowUp: ""
  },
  {
    id: 3,
    companyName: "Green Energy Co",
    email: "contact@greenenergy.com",
    phone: "+1-456-789-0123",
    address: "789 Eco Street, San Francisco",
    status: "inactive",
    industry: "Energy",
    website: "www.greenenergy.com",
    contactPerson: "",
    communicationPreference: "",
    notes: "",
    lastContactDate: "",
    nextFollowUp: ""
  },
  {
    id: 4,
    companyName: "Digital Marketing Pro",
    email: "hello@digitalmarketing.com",
    phone: "+1-567-890-1234",
    address: "321 Social Ave, Austin",
    status: "active",
    industry: "Marketing",
    website: "www.digitalmarketing.com",
    contactPerson: "",
    communicationPreference: "",
    notes: "",
    lastContactDate: "",
    nextFollowUp: ""
  },
  {
    id: 5,
    companyName: "Healthcare Plus",
    email: "info@healthcareplus.com",
    phone: "+1-678-901-2345",
    address: "567 Medical Center, Boston",
    status: "active",
    industry: "Healthcare",
    website: "www.healthcareplus.com",
    contactPerson: "",
    communicationPreference: "",
    notes: "",
    lastContactDate: "",
    nextFollowUp: ""
  }
];

const CompanyManagement = () => {
  const [companies, setCompanies] = useState(mockCompanies);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    communicationPreference: '',
    status: 'active',
    notes: '',
    lastContactDate: '',
    nextFollowUp: ''
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData(company);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      setCompanies(companies.filter(company => company.id !== id));
    }
  };

  const handleSave = (companyData) => {
    if (editingCompany) {
      setCompanies(companies.map(company =>
        company.id === editingCompany.id ? { ...companyData, id: company.id } : company
      ));
    } else {
      setCompanies([...companies, { ...companyData, id: Date.now() }]);
    }
    setShowForm(false);
    setEditingCompany(null);
    setFormData({
      companyName: '',
      industry: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      communicationPreference: '',
      status: 'active',
      notes: '',
      lastContactDate: '',
      nextFollowUp: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredCompanies = companies.filter(company =>
    Object.values(company).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="company-management">
      <div className="section-header">
        <div className="search-box">
          <BsSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <BsPlus /> Add Company
        </button>
      </div>

      {showForm && (
        <CompanyForm
          formData={formData}
          editingCompany={editingCompany}
          handleSave={handleSave}
          handleInputChange={handleInputChange}
        />
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Industry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map(company => (
              <tr key={company.id}>
                <td>{company.companyName}</td>
                <td>{company.email}</td>
                <td>{company.phone}</td>
                <td>{company.industry}</td>
                <td>
                  <span className={`status-badge ${company.status}`}>
                    {company.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon"
                      onClick={() => handleEdit(company)}
                      title="Edit"
                    >
                      <BsPencil />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(company.id)}
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

export default CompanyManagement;
