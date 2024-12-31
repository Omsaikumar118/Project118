/**
 * Company Form Component
 * 
 * Purpose: Form for adding and editing company information
 * Features:
 * - Company details input
 * - Contact information management
 * - Communication periodicity settings
 */

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCompany,
  updateCompany,
  selectSelectedCompany,
  clearSelectedCompany
} from '../../store/slices/companySlice';

const CompanyForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const selectedCompany = useSelector(selectSelectedCompany);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    linkedinProfile: '',
    emails: [''],
    phoneNumbers: [''],
    comments: '',
    communicationPeriodicity: '14' // Default: 2 weeks
  });

  useEffect(() => {
    if (selectedCompany) {
      setFormData(selectedCompany);
    }
  }, [selectedCompany]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item))
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    // Remove empty emails and phone numbers
    const cleanedData = {
      ...formData,
      emails: formData.emails.filter(email => email.trim()),
      phoneNumbers: formData.phoneNumbers.filter(phone => phone.trim())
    };

    if (selectedCompany) {
      dispatch(updateCompany({ id: selectedCompany.id, ...cleanedData }));
    } else {
      dispatch(addCompany(cleanedData));
    }

    dispatch(clearSelectedCompany());
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Company Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location *
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      {/* LinkedIn Profile */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          LinkedIn Profile
        </label>
        <input
          type="url"
          name="linkedinProfile"
          value={formData.linkedinProfile}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="https://linkedin.com/company/..."
        />
      </div>

      {/* Emails */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email Addresses
        </label>
        {formData.emails.map((email, index) => (
          <div key={index} className="flex mt-1 gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => handleArrayInputChange(index, 'emails', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="email@company.com"
            />
            <button
              type="button"
              onClick={() => removeArrayField('emails', index)}
              className="px-2 py-1 text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayField('emails')}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          + Add Email
        </button>
      </div>

      {/* Phone Numbers */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phone Numbers
        </label>
        {formData.phoneNumbers.map((phone, index) => (
          <div key={index} className="flex mt-1 gap-2">
            <input
              type="tel"
              value={phone}
              onChange={(e) => handleArrayInputChange(index, 'phoneNumbers', e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="+1234567890"
            />
            <button
              type="button"
              onClick={() => removeArrayField('phoneNumbers', index)}
              className="px-2 py-1 text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayField('phoneNumbers')}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          + Add Phone Number
        </button>
      </div>

      {/* Communication Periodicity */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Communication Periodicity (days)
        </label>
        <select
          name="communicationPeriodicity"
          value={formData.communicationPeriodicity}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="7">Weekly (7 days)</option>
          <option value="14">Bi-weekly (14 days)</option>
          <option value="30">Monthly (30 days)</option>
          <option value="90">Quarterly (90 days)</option>
          <option value="180">Semi-annually (180 days)</option>
          <option value="365">Annually (365 days)</option>
        </select>
      </div>

      {/* Comments */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Comments
        </label>
        <textarea
          name="comments"
          value={formData.comments}
          onChange={handleInputChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Add any additional notes or comments..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => {
            dispatch(clearSelectedCompany());
            onClose();
          }}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          {selectedCompany ? 'Update Company' : 'Add Company'}
        </button>
      </div>
    </form>
  );
};

export default CompanyForm;
