import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { RequestBody } from "@/types";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const body: RequestBody = await request.json();
        const { name, email, password, referralCode } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (existingUser) {
            return NextResponse.json({ message: "User alreay exist with this email" }, { status: 501 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verifyToken = Math.random().toString(36).substring(2);
        const verifyTokenExpiry = new Date();
        verifyTokenExpiry.setHours(verifyTokenExpiry.getHours() + 72);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword,
                verifyToken,
                verifyTokenExpiry
            }
        })

        const verifyUrl = `${process.env.NEXTAUTH_URL}/verify?token=${verifyToken}`

        // console.log("Starting sening email");
        // await resend.emails.send({
        //     from: 'Nilesh <business@eventeye.in>',
        //     to: email,
        //     subject: 'Verify Your Email',
        //     html: `
        //         <!DOCTYPE html>
        //   <html lang="en">
        //     <head>
        //       <meta charset="UTF-8">
        //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //       <style>
        //         /* Base styles */
        //         body { 
        //           font-family: 'Helvetica Neue', Arial, sans-serif; 
        //           background-color: #f7f7f7; 
        //           margin: 0; 
        //           padding: 0; 
        //           color: #333333;
        //           line-height: 1.6;
        //         }

        //         /* Container with improved styling */
        //         .container { 
        //           width: 100%; 
        //           max-width: 550px; 
        //           margin: 40px auto; 
        //           background-color: #ffffff; 
        //           border-radius: 12px; 
        //           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); 
        //           overflow: hidden; 
        //         }

        //         /* Header with more appealing styling */
        //         .header { 
        //           background-color: #181818; 
        //           color: #ffffff; 
        //           padding: 30px 20px; 
        //           text-align: center; 
        //         }

        //         .header h1 {
        //           margin: 0;
        //           font-weight: 500;
        //           font-size: 24px;
        //           letter-spacing: -0.5px;
        //         }

        //         /* Logo styling */
        //         .logo {
        //           margin-bottom: 15px;
        //         }

        //         .logo img {
        //           height: 40px;
        //           width: auto;
        //         }

        //         /* Content area with better spacing */
        //         .content { 
        //           padding: 35px 30px;
        //           color: #333333;
        //         }

        //         .content p {
        //           margin: 0 0 16px;
        //           font-size: 16px;
        //         }

        //         /* Improved button styling */
        //         .button-container {
        //           text-align: center;
        //           margin: 30px 0;
        //         }

        //         .button { 
        //           display: inline-block; 
        //           padding: 14px 28px; 
        //           background-color: #181818; 
        //           color: #ffffff !important; 
        //           text-decoration: none; 
        //           border-radius: 8px; 
        //           font-size: 16px;
        //           font-weight: 500;
        //           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
        //           transition: all 0.2s ease;
        //         }

        //         .button:hover {
        //           background-color: #333333;
        //           transform: translateY(-2px);
        //           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
        //         }

        //         /* Support text styling */
        //         .support {
        //           margin-top: 30px;
        //           padding-top: 20px;
        //           border-top: 1px solid #eeeeee;
        //           font-size: 14px;
        //           color: #666666;
        //         }

        //         .support a {
        //           color: #181818;
        //           text-decoration: none;
        //           font-weight: 500;
        //           border-bottom: 1px solid #cccccc;
        //           padding-bottom: 1px;
        //           transition: border-color 0.2s ease;
        //         }

        //         .support a:hover {
        //           border-color: #181818;
        //         }

        //         /* Footer with improved styling */
        //         .footer { 
        //           background-color: #f7f7f7; 
        //           color: #999999; 
        //           text-align: center; 
        //           padding: 20px; 
        //           font-size: 13px;
        //         }

        //         /* Responsive adjustments */
        //         @media only screen and (max-width: 600px) {
        //           .container {
        //             margin: 20px auto;
        //             width: 90%;
        //           }

        //           .content {
        //             padding: 25px 20px;
        //           }
        //         }
        //       </style>
        //     </head>
        //     <body>
        //       <div class="container">
        //         <div class="header">
        //           <div class="logo">
        //             <!-- You can replace this with an actual logo -->
        //             <svg width="120" height="30" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        //               <rect width="30" height="30" rx="6" fill="white"/>
        //               <path d="M7 15H23M15 7V23" stroke="#181818" stroke-width="2" stroke-linecap="round"/>
        //               <text x="40" y="21" fill="white" font-family="Helvetica Neue" font-size="18" font-weight="500">EventEye</text>
        //             </svg>
        //           </div>
        //           <h1>Verify Your Email Address</h1>
        //         </div>
        //         <div class="content">
        //           <p>Hi ${name},</p>
        //           <p>Thank you for signing up with EventEye! We're excited to have you on board.</p>
        //           <p>Please verify your email address to get started:</p>

        //           <div class="button-container">
        //             <a href="${verifyUrl}" class="button">Verify Email Address</a>
        //           </div>

        //           <p>This link will expire in 24 hours. If you didn't create an account with EventEye, you can safely ignore this email.</p>

        //           <div class="support">
        //             <p>Need help? Feel free to <a href="mailto:support@eventeye.in">contact our support team</a>.</p>
        //           </div>
        //         </div>
        //         <div class="footer">
        //           <p>&copy; 2023 EventEye. All rights reserved.</p>
        //           <p>123 Event Street, City, Country</p>
        //         </div>
        //       </div>
        //     </body>
        //   </html>
        //     `
        // });
        // console.log("Email sent");

        return NextResponse.json(
            {
                message: "User created successfully",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 200 }
        );
    } catch (err: any) {
        console.log(err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}