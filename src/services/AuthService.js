/**
 * Authentication Service
 * 
 * Purpose: Handle authentication-related API calls and token management
 * Features:
 * - Login/Register API calls
 * - Token management
 * - Password reset
 * 
 * @module AuthService
 * @category Services
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class AuthService {
  /**
   * Login user
   * @param {string} email User email
   * @param {string} password User password
   * @returns {Promise} Response with user data and token
   */
  async login(email, password) {
    console.log('Login attempt:', { email }); // Debug log
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      console.log('Login response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message); // Debug log
      throw this.handleError(error);
    }
  }

  /**
   * Register new user
   * @param {Object} userData User registration data
   * @returns {Promise} Response with user data
   */
  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Request password reset
   * @param {string} email User email
   * @returns {Promise} Response with reset token
   */
  async requestPasswordReset(email) {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, { email });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Reset password with token
   * @param {string} token Reset token
   * @param {string} newPassword New password
   * @returns {Promise} Response with success status
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password/${token}`, {
        password: newPassword
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Set auth token in localStorage and axios headers
   * @param {string} token JWT token
   */
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }

  /**
   * Get current auth token
   * @returns {string|null} JWT token
   */
  getAuthToken() {
    return localStorage.getItem('token');
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getAuthToken();
  }

  /**
   * Logout user
   */
  logout() {
    this.setAuthToken(null);
  }

  /**
   * Handle API errors
   * @param {Error} error API error
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';
      const status = error.response.status;
      return new Error(`${status}: ${message}`);
    }
    if (error.request) {
      // Request made but no response
      return new Error('No response from server');
    }
    // Other errors
    return error;
  }
}

export default new AuthService();
