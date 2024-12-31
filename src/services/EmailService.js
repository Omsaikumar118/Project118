/**
 * Email Service
 * 
 * Purpose: Handle email notifications and templates for communications
 * Features:
 * - Send email notifications
 * - Manage email templates
 * - Handle notification preferences
 * - Schedule reminder emails
 * 
 * @module EmailService
 * @category Services
 * @requires nodemailer
 * @requires email-templates
 */

import nodemailer from 'nodemailer';
import EmailTemplate from 'email-templates';
import path from 'path';

class EmailService {
  constructor() {
    // Initialize email transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Initialize email template engine
    this.emailTemplate = new EmailTemplate({
      views: {
        root: path.join(__dirname, '../templates/emails'),
        options: {
          extension: 'ejs'
        }
      }
    });
  }

  /**
   * Send an email using a template
   * @param {string} template - Template name
   * @param {Object} recipient - Recipient information
   * @param {Object} data - Template data
   * @returns {Promise} Send result
   */
  async sendTemplatedEmail(template, recipient, data) {
    try {
      const email = await this.emailTemplate.render(template, data);
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'communications@yourcompany.com',
        to: recipient.email,
        subject: email.subject,
        html: email.html
      };

      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send upcoming communication notification
   * @param {Object} communication - Communication details
   * @param {Object} recipient - Recipient information
   */
  async sendUpcomingNotification(communication, recipient) {
    const data = {
      communication,
      recipient,
      date: new Date(communication.date).toLocaleDateString(),
      time: new Date(communication.date).toLocaleTimeString()
    };

    return this.sendTemplatedEmail('upcoming-communication', recipient, data);
  }

  /**
   * Send reminder email
   * @param {Object} communication - Communication details
   * @param {Object} recipient - Recipient information
   * @param {number} minutesBefore - Minutes before the communication
   */
  async sendReminderEmail(communication, recipient, minutesBefore) {
    const data = {
      communication,
      recipient,
      minutesBefore,
      date: new Date(communication.date).toLocaleDateString(),
      time: new Date(communication.date).toLocaleTimeString()
    };

    return this.sendTemplatedEmail('communication-reminder', recipient, data);
  }

  /**
   * Send overdue communication notification
   * @param {Object} communication - Communication details
   * @param {Object} recipient - Recipient information
   */
  async sendOverdueNotification(communication, recipient) {
    const data = {
      communication,
      recipient,
      date: new Date(communication.date).toLocaleDateString(),
      time: new Date(communication.date).toLocaleTimeString()
    };

    return this.sendTemplatedEmail('overdue-communication', recipient, data);
  }
}

export default new EmailService();
