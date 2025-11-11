# Email Invitation System - Setup Guide

## Overview

The email invitation system has been successfully implemented! Users can now receive email invitations to join projects, and they must accept the invitation before becoming a project member.

## Features Implemented

1. **Email Invitations**: When you assign a user to a task, they automatically receive an email invitation
2. **Accept/Reject**: Users can accept or reject invitations via email link or the invitations page
3. **Expiration**: Invitations expire after 7 days
4. **Notification Badge**: Home page shows the count of pending invitations
5. **Invitation Management**: Users can view all their invitations (pending and responded) at `/invitations`

## How It Works

1. **Sending Invitations**:
   - Project owners click "Invite Member" button in the project page
   - Enter the email address of the person to invite
   - System sends an email invitation to that user
   - The invitation includes a secure link to accept/reject

2. **Receiving Invitations**:
   - User receives an email with an "Accept Invitation" button
   - User can click the link in the email OR visit the Invitations page
   - User accepts or declines the invitation

3. **After Acceptance**:
   - User is added to the project as a member
   - User can access the project and see all tasks
   - User appears in the "Assigned To" dropdown for tasks
   - User appears in the project member list

4. **Assigning Tasks**:
   - Only project members appear in the "Assigned To" dropdown
   - You must invite users first before you can assign them to tasks
   - This ensures all collaborators have explicitly accepted the invitation

## SMTP Email Configuration

To send emails, you need to configure SMTP settings in your `.env` file:

### Option 1: Gmail (Recommended for Development)

1. **Create a Gmail App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Sign in to your Google account
   - Click "Select app" → Choose "Mail"
   - Click "Select device" → Choose "Other" and give it a name
   - Click "Generate"
   - Copy the 16-character password

2. **Update your `.env` file**:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
```

### Option 2: SendGrid (Recommended for Production)

1. Sign up at https://sendgrid.com/
2. Create an API key
3. Update your `.env` file:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

### Option 3: Ethereal Email (For Testing Only)

1. Go to https://ethereal.email/
2. Click "Create Ethereal Account"
3. Copy the credentials provided
4. Update your `.env` file with the provided SMTP settings

**Note**: Ethereal emails are NOT real and won't reach actual inboxes. Use it only for testing.

## Files Modified/Created

### New Files:
- `src/models/invitationmodel.ts` - MongoDB schema for invitations
- `src/utils/emailService.ts` - Email sending functionality
- `src/app/api/invitations/send/route.ts` - API to send invitations
- `src/app/api/invitations/respond/route.ts` - API to accept/reject invitations
- `src/app/api/invitations/route.ts` - API to get user's invitations
- `src/app/invitations/page.tsx` - UI for managing invitations
- `src/app/invitations/accept/page.tsx` - UI for accepting invitations from email

### Modified Files:
- `src/app/projects/[id]/page.tsx` - Changed to send invitations instead of direct assignment
- `src/app/home/page.tsx` - Added invitations button with notification badge
- `.env.example` - Added SMTP configuration template

## Testing the Feature

1. **Set up SMTP** (see configuration above)

2. **Test sending an invitation**:
   - Go to a project page
   - Click "Invite Member" button in the Members section
   - Enter an email address (must be a registered user)
   - Click "Send Invite"
   - Check the console for confirmation

3. **Test receiving an invitation**:
   - Open the email inbox of the invited user
   - Look for an email with subject "You're invited to join..."
   - Click the "Accept Invitation" button

4. **Test the invitations page**:
   - Go to http://localhost:3000/invitations
   - You should see all pending invitations
   - Accept or decline from there

5. **Test assigning tasks**:
   - After a user accepts the invitation
   - Go to the project page
   - Try to assign them to a task
   - They should now appear in the "Assigned To" dropdown

## Important Notes

- **Security**: The invitation token is cryptographically secure
- **Expiration**: Invitations automatically expire after 7 days
- **Duplicate Protection**: Users can't be invited twice to the same project
- **Email Failures**: If email sending fails, the invitation is not created
- **Status Tracking**: All invitations are tracked (pending, accepted, rejected)
- **Project Owner**: The project owner is automatically added as a member when creating a project
- **Member-Only Assignment**: Only accepted project members appear in the "Assigned To" dropdown
- **Registered Users Only**: You can only invite users who have already registered on the platform

## Troubleshooting

### Emails Not Sending

1. Check your `.env` file has correct SMTP credentials
2. For Gmail, ensure you're using an App Password, not your regular password
3. Check server console for error messages
4. Verify SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASSWORD are set

### "Failed to send invitation email"

- This means the SMTP configuration is incorrect
- Double-check your credentials
- Try using Ethereal Email for testing first

### Invitation Link Not Working

- Ensure the `NEXTAUTH_URL` in `.env` is correct
- For development, it should be `http://localhost:3000`
- For production, it should be your deployed URL

### User Not Appearing in Dropdown

- Ensure the user has accepted the invitation
- Refresh the project page after they accept
- Check the "Project Members" section to verify they're listed

### "User not found" Error

- The email must belong to a registered user
- Ask them to sign up first, then send the invitation
- Verify the email address is correct

## API Endpoints

- `POST /api/invitations/send` - Send an invitation
- `POST /api/invitations/respond` - Accept or reject an invitation
- `GET /api/invitations` - Get all invitations for logged-in user

## Next Steps

1. Configure your SMTP settings in `.env`
2. Restart your development server
3. Test by inviting a user to a project
4. Check your email for the invitation

Enjoy your new invitation system! 🎉
