import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const html = this.getVerificationEmailTemplate(email, verificationUrl);
    
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify Your Email - Notes App',
      html: html,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const html = this.getPasswordResetEmailTemplate(email, resetUrl);
    
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Your Password - Notes App',
      html: html,
    });
  }

  async sendWelcomeEmail(email: string, name?: string) {
    const html = this.getWelcomeEmailTemplate(email, name);
    
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Notes App!',
      html: html,
    });
  }

  async sendNotebookSharedEmail(email: string, notebookTitle: string, sharedBy: string) {
    const html = this.getNotebookSharedEmailTemplate(email, notebookTitle, sharedBy);
    
    await this.mailerService.sendMail({
      to: email,
      subject: `Notebook Shared: ${notebookTitle}`,
      html: html,
    });
  }

  async sendWeeklySummaryEmail(email: string, summary: any) {
    const html = this.getWeeklySummaryEmailTemplate(email, summary);
    
    await this.mailerService.sendMail({
      to: email,
      subject: 'Your Weekly Notes Summary',
      html: html,
    });
  }

  generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private getVerificationEmailTemplate(email: string, verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f4f4f4;
              }
              .container {
                  background-color: white;
                  padding: 30px;
                  border-radius: 10px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .header {
                  text-align: center;
                  margin-bottom: 30px;
              }
              .logo {
                  font-size: 24px;
                  font-weight: bold;
                  color: #007bff;
                  margin-bottom: 10px;
              }
              .button {
                  display: inline-block;
                  background-color: #007bff;
                  color: white;
                  padding: 12px 30px;
                  text-decoration: none;
                  border-radius: 5px;
                  margin: 20px 0;
              }
              .footer {
                  text-align: center;
                  margin-top: 30px;
                  color: #666;
                  font-size: 14px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">Notes App</div>
                  <h2>Verify Your Email Address</h2>
              </div>
              
              <p>Hello!</p>
              
              <p>Thank you for signing up for Notes App. To complete your registration, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                  <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #007bff;">${verificationUrl}</p>
              
              <p>This link will expire in 24 hours for security reasons.</p>
              
              <p>If you didn't create an account with Notes App, you can safely ignore this email.</p>
              
              <div class="footer">
                  <p>Best regards,<br>The Notes App Team</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  private getPasswordResetEmailTemplate(email: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f4f4f4;
              }
              .container {
                  background-color: white;
                  padding: 30px;
                  border-radius: 10px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .header {
                  text-align: center;
                  margin-bottom: 30px;
              }
              .logo {
                  font-size: 24px;
                  font-weight: bold;
                  color: #dc3545;
                  margin-bottom: 10px;
              }
              .button {
                  display: inline-block;
                  background-color: #dc3545;
                  color: white;
                  padding: 12px 30px;
                  text-decoration: none;
                  border-radius: 5px;
                  margin: 20px 0;
              }
              .footer {
                  text-align: center;
                  margin-top: 30px;
                  color: #666;
                  font-size: 14px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">Notes App</div>
                  <h2>Reset Your Password</h2>
              </div>
              
              <p>Hello!</p>
              
              <p>We received a request to reset your password for your Notes App account. Click the button below to create a new password:</p>
              
              <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #dc3545;">${resetUrl}</p>
              
              <p>This link will expire in 1 hour for security reasons.</p>
              
              <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              
              <div class="footer">
                  <p>Best regards,<br>The Notes App Team</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  private getWelcomeEmailTemplate(email: string, name?: string): string {
    const userName = name || email.split('@')[0];
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Notes App!</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f4f4f4;
              }
              .container {
                  background-color: white;
                  padding: 30px;
                  border-radius: 10px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .header {
                  text-align: center;
                  margin-bottom: 30px;
              }
              .logo {
                  font-size: 24px;
                  font-weight: bold;
                  color: #28a745;
                  margin-bottom: 10px;
              }
              .button {
                  display: inline-block;
                  background-color: #28a745;
                  color: white;
                  padding: 12px 30px;
                  text-decoration: none;
                  border-radius: 5px;
                  margin: 20px 0;
              }
              .footer {
                  text-align: center;
                  margin-top: 30px;
                  color: #666;
                  font-size: 14px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">Notes App</div>
                  <h2>Welcome to Notes App!</h2>
              </div>
              
              <p>Hello ${userName}!</p>
              
              <p>Welcome to Notes App! We're excited to have you on board. You can now start creating and organizing your notes.</p>
              
              <h3>Getting Started:</h3>
              <ul>
                  <li>Create your first note</li>
                  <li>Organize notes with titles</li>
                  <li>Access your notes from anywhere</li>
                  <li>Share notes with others</li>
              </ul>
              
              <div style="text-align: center;">
                  <a href="${process.env.FRONTEND_URL}" class="button">Start Creating Notes</a>
              </div>
              
              <p>If you have any questions or need help getting started, feel free to reach out to our support team.</p>
              
              <div class="footer">
                  <p>Happy note-taking!<br>The Notes App Team</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  private getNotebookSharedEmailTemplate(email: string, notebookTitle: string, sharedBy: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Notebook Shared</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f4f4f4;
              }
              .container {
                  background-color: white;
                  padding: 30px;
                  border-radius: 10px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .header {
                  text-align: center;
                  margin-bottom: 30px;
              }
              .logo {
                  font-size: 24px;
                  font-weight: bold;
                  color: #17a2b8;
                  margin-bottom: 10px;
              }
              .footer {
                  text-align: center;
                  margin-top: 30px;
                  color: #666;
                  font-size: 14px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">Notes App</div>
                  <h2>Notebook Shared with You</h2>
              </div>
              
              <p>Hello!</p>
              
              <p><strong>${sharedBy}</strong> has shared a notebook with you:</p>
              
              <h3>"${notebookTitle}"</h3>
              
              <p>You can now view and collaborate on this notebook in your Notes App dashboard.</p>
              
              <div class="footer">
                  <p>Best regards,<br>The Notes App Team</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }

  private getWeeklySummaryEmailTemplate(email: string, summary: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Weekly Summary</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f4f4f4;
              }
              .container {
                  background-color: white;
                  padding: 30px;
                  border-radius: 10px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              }
              .header {
                  text-align: center;
                  margin-bottom: 30px;
              }
              .logo {
                  font-size: 24px;
                  font-weight: bold;
                  color: #6f42c1;
                  margin-bottom: 10px;
              }
              .footer {
                  text-align: center;
                  margin-top: 30px;
                  color: #666;
                  font-size: 14px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">Notes App</div>
                  <h2>Your Weekly Notes Summary</h2>
              </div>
              
              <p>Hello!</p>
              
              <p>Here's your weekly summary from Notes App:</p>
              
              <ul>
                  <li>Notes created this week: ${summary.notesCreated || 0}</li>
                  <li>Notes updated this week: ${summary.notesUpdated || 0}</li>
                  <li>Total notes: ${summary.totalNotes || 0}</li>
              </ul>
              
              <p>Keep up the great work with your note-taking!</p>
              
              <div class="footer">
                  <p>Best regards,<br>The Notes App Team</p>
              </div>
          </div>
      </body>
      </html>
    `;
  }
} 