import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, token } = body;

        if (!name || !email || !token) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const activationLink = `${baseUrl}/activate?token=${token}`;

        const mailOptions = {
            from: process.env.FROM_EMAIL,
            to: email,
            subject: `Activate your Fade&Blade Account`,
            text: `Hi ${name},\n\nPlease activate your account by clicking the link below:\n${activationLink}\n\nThis link will expire in 24 hours.`,
            html: `
                <div style="font-family: Montserrat; color: #fff; background-color: #686868ff; padding: 20px; border-radius: 10px;">
                    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap" rel="stylesheet">
                    <h2 style="font-family: Montserrat; color: #fff;">Welcome to Fade&Blade!</h2>
                    <p style="font-family: Montserrat; color: #fff;">Hi ${name},</p>
                    <p style="font-family: Montserrat; color: #fff;">Please click the button below to activate your account:</p>
                    <a href="${activationLink}" style="background-color: #FFB52B; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Activate Account</a>
                    <p style="font-family: Montserrat; color: #fff;">Or copy this link: <a href="${activationLink}" style="font-family: Montserrat; color: #ffb52b;">${activationLink}</a></p>
                    <p style="font-family: Montserrat; color: #fff;">This link will expire in 24 hours.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { message: 'Email sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Email sending error:', error);
        return NextResponse.json(
            { message: 'Failed to send email' },
            { status: 500 }
        );
    }
}
