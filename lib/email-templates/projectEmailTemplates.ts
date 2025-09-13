export interface ProjectEmailData {
  projectTitle: string
  projectDescription?: string
  clientName: string
  clientEmail: string
  managerName: string
  managerEmail: string
  companyName: string
  projectUrl: string
  budget: number
  currency: string
  startDate: string
  endDate?: string
}

export interface TaskEmailData {
  taskTitle: string
  taskDescription?: string
  projectTitle: string
  assigneeName: string
  assigneeEmail: string
  projectUrl: string
  dueDate?: string
}

export interface PaymentEmailData {
  projectTitle: string
  clientName: string
  amount: number
  currency: string
  dueDate: string
  invoiceNumber: string
  paymentUrl?: string
}

// Project Creation Email Template for Clients
export const projectCreationClientTemplate = (data: ProjectEmailData) => ({
  subject: `🎉 Welcome to ${data.projectTitle} - Your Project Has Been Created!`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Project Created - ${data.projectTitle}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .info-card { background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; }
        .footer { background-color: #f8fafc; padding: 20px 30px; text-align: center; color: #64748b; font-size: 14px; }
        .highlight { color: #667eea; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">🚀 Project Created Successfully!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Welcome to your project management journey</p>
        </div>
        
        <div class="content">
          <h2 style="color: #1e293b; margin-top: 0;">Hello ${data.clientName}!</h2>
          
          <p>We're excited to inform you that your project <span class="highlight">"${data.projectTitle}"</span> has been successfully created and is now ready to begin!</p>
          
          <div class="info-card">
            <h3 style="margin-top: 0; color: #1e293b;">📋 Project Details</h3>
            <p><strong>Project Name:</strong> ${data.projectTitle}</p>
            ${data.projectDescription ? `<p><strong>Description:</strong> ${data.projectDescription}</p>` : ''}
            <p><strong>Budget:</strong> ${data.currency === 'USD' ? '$' : data.currency === 'INR' ? '₹' : 'Rs.'} ${data.budget.toLocaleString()}</p>
            <p><strong>Start Date:</strong> ${data.startDate}</p>
            ${data.endDate ? `<p><strong>Expected Completion:</strong> ${data.endDate}</p>` : ''}
            <p><strong>Project Manager:</strong> ${data.managerName}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.projectUrl}" class="button">🔗 View Your Project</a>
          </div>
          
          <div style="background-color: #ecfdf5; border-radius: 8px; padding: 20px; border-left: 4px solid #10b981;">
            <h3 style="margin-top: 0; color: #065f46;">✨ What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px; color: #065f46;">
              <li>You'll receive regular updates on project progress</li>
              <li>Access your project dashboard anytime using the link above</li>
              <li>Chat directly with your development team</li>
              <li>Provide feedback and approve deliverables</li>
            </ul>
          </div>
          
          <p>If you have any questions or need assistance, please don't hesitate to reach out to your project manager <a href="mailto:${data.managerEmail}" style="color: #667eea;">${data.managerName}</a>.</p>
          
          <p>Thank you for choosing <strong>${data.companyName}</strong>. We're committed to delivering exceptional results!</p>
          
          <p style="margin-top: 30px;">Best regards,<br><strong>The ${data.companyName} Team</strong></p>
        </div>
        
        <div class="footer">
          <p>This email was sent by ${data.companyName}. If you have any questions, please contact us at <a href="mailto:${data.managerEmail}" style="color: #667eea;">${data.managerEmail}</a></p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
    Welcome to ${data.projectTitle}!
    
    Hello ${data.clientName},
    
    Your project "${data.projectTitle}" has been successfully created!
    
    Project Details:
    - Project Name: ${data.projectTitle}
    ${data.projectDescription ? `- Description: ${data.projectDescription}` : ''}
    - Budget: ${data.currency === 'USD' ? '$' : data.currency === 'INR' ? '₹' : 'Rs.'} ${data.budget.toLocaleString()}
    - Start Date: ${data.startDate}
    ${data.endDate ? `- Expected Completion: ${data.endDate}` : ''}
    - Project Manager: ${data.managerName}
    
    You can view your project at: ${data.projectUrl}
    
    What's Next:
    - Regular progress updates
    - Access to project dashboard
    - Direct communication with development team
    - Feedback and approval system
    
    Contact your project manager: ${data.managerName} (${data.managerEmail})
    
    Best regards,
    The ${data.companyName} Team
  `
})

// Task Assignment Email Template
export const taskAssignmentTemplate = (data: TaskEmailData) => ({
  subject: `📋 New Task Assigned: ${data.taskTitle}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Task Assignment - ${data.taskTitle}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .button { display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; }
        .task-card { background-color: #fff7ed; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #f59e0b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">📋 New Task Assignment</h1>
        </div>
        
        <div class="content">
          <h2 style="color: #1e293b; margin-top: 0;">Hello ${data.assigneeName}!</h2>
          
          <p>A new task has been assigned to you in project <strong>"${data.projectTitle}"</strong>.</p>
          
          <div class="task-card">
            <h3 style="margin-top: 0; color: #92400e;">Task Details</h3>
            <p><strong>Task:</strong> ${data.taskTitle}</p>
            ${data.taskDescription ? `<p><strong>Description:</strong> ${data.taskDescription}</p>` : ''}
            <p><strong>Project:</strong> ${data.projectTitle}</p>
            ${data.dueDate ? `<p><strong>Due Date:</strong> ${data.dueDate}</p>` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.projectUrl}" class="button">View Task Details</a>
          </div>
          
          <p>Please review the task details and update your progress regularly in the project dashboard.</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
    New Task Assignment: ${data.taskTitle}
    
    Hello ${data.assigneeName},
    
    You have been assigned a new task in project "${data.projectTitle}".
    
    Task Details:
    - Task: ${data.taskTitle}
    ${data.taskDescription ? `- Description: ${data.taskDescription}` : ''}
    - Project: ${data.projectTitle}
    ${data.dueDate ? `- Due Date: ${data.dueDate}` : ''}
    
    View task details: ${data.projectUrl}
  `
})

// Payment Reminder Email Template
export const paymentReminderTemplate = (data: PaymentEmailData) => ({
  subject: `💳 Payment Reminder: Invoice ${data.invoiceNumber} - ${data.projectTitle}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Reminder</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .amount { font-size: 32px; font-weight: bold; color: #10b981; text-align: center; margin: 20px 0; }
        .button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">💳 Payment Reminder</h1>
        </div>
        
        <div class="content">
          <h2 style="color: #1e293b; margin-top: 0;">Hello ${data.clientName}!</h2>
          
          <p>This is a friendly reminder about your upcoming payment for project <strong>"${data.projectTitle}"</strong>.</p>
          
          <div class="amount">
            ${data.currency === 'USD' ? '$' : data.currency === 'INR' ? '₹' : 'Rs.'} ${data.amount.toLocaleString()}
          </div>
          
          <p><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
          <p><strong>Due Date:</strong> ${data.dueDate}</p>
          
          ${data.paymentUrl ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.paymentUrl}" class="button">Make Payment</a>
          </div>
          ` : ''}
          
          <p>If you have already made this payment, please disregard this reminder. If you have any questions about this invoice, please don't hesitate to contact us.</p>
          
          <p>Thank you for your business!</p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
    Payment Reminder: Invoice ${data.invoiceNumber}
    
    Hello ${data.clientName},
    
    Reminder for your payment for project "${data.projectTitle}".
    
    Amount: ${data.currency === 'USD' ? '$' : data.currency === 'INR' ? '₹' : 'Rs.'} ${data.amount.toLocaleString()}
    Invoice Number: ${data.invoiceNumber}
    Due Date: ${data.dueDate}
    
    ${data.paymentUrl ? `Make payment: ${data.paymentUrl}` : ''}
    
    Thank you for your business!
  `
})

// Project Status Update Email Template
export const projectStatusUpdateTemplate = (data: {
  projectTitle: string
  clientName: string
  progress: number
  completedTasks: number
  totalTasks: number
  nextMilestone?: string
  projectUrl: string
  managerName: string
}) => ({
  subject: `📊 Weekly Update: ${data.projectTitle} - ${data.progress}% Complete`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Project Update - ${data.projectTitle}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .progress-bar { width: 100%; height: 20px; background-color: #e5e7eb; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); }
        .stat { text-align: center; padding: 15px; margin: 10px; background-color: #f8fafc; border-radius: 8px; }
        .button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">📊 Weekly Project Update</h1>
        </div>
        
        <div class="content">
          <h2 style="color: #1e293b; margin-top: 0;">Hello ${data.clientName}!</h2>
          
          <p>Here's your weekly progress update for <strong>"${data.projectTitle}"</strong>:</p>
          
          <div style="margin: 30px 0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span><strong>Overall Progress</strong></span>
              <span><strong>${data.progress}%</strong></span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${data.progress}%;"></div>
            </div>
          </div>
          
          <div style="display: flex; gap: 20px; margin: 30px 0;">
            <div class="stat" style="flex: 1;">
              <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${data.completedTasks}</div>
              <div>Tasks Completed</div>
            </div>
            <div class="stat" style="flex: 1;">
              <div style="font-size: 24px; font-weight: bold; color: #64748b;">${data.totalTasks - data.completedTasks}</div>
              <div>Tasks Remaining</div>
            </div>
          </div>
          
          ${data.nextMilestone ? `
          <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; border-left: 4px solid #3b82f6;">
            <h3 style="margin-top: 0; color: #1d4ed8;">🎯 Next Milestone</h3>
            <p style="margin-bottom: 0;">${data.nextMilestone}</p>
          </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.projectUrl}" class="button">View Full Project Details</a>
          </div>
          
          <p>Keep an eye on your project dashboard for real-time updates. Feel free to reach out if you have any questions!</p>
          
          <p>Best regards,<br><strong>${data.managerName}</strong></p>
        </div>
      </div>
    </body>
    </html>
  `,
  text: `
    Weekly Project Update: ${data.projectTitle}
    
    Hello ${data.clientName},
    
    Progress update for "${data.projectTitle}":
    
    Overall Progress: ${data.progress}%
    Tasks Completed: ${data.completedTasks}
    Tasks Remaining: ${data.totalTasks - data.completedTasks}
    
    ${data.nextMilestone ? `Next Milestone: ${data.nextMilestone}` : ''}
    
    View project: ${data.projectUrl}
    
    Best regards,
    ${data.managerName}
  `
})