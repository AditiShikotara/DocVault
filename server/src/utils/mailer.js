import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

const sendPasswordResetEmail = async (email, resetUrl) => {
    try {
        await transporter.sendMail({
            from: `"DocVault" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Reset your DocVault password",

            html: `
                <div style="
                    background: #f1f5f9;
                    padding: 40px 20px;
                    font-family: 'Segoe UI', Arial, sans-serif;
                ">

                    <div style="
                        max-width: 480px;
                        margin: 0 auto;
                        background: #ffffff;
                        border-radius: 20px;
                        overflow: hidden;
                        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
                    ">

                        <!-- Header banner -->
                        <div style="
                            background: linear-gradient(135deg, #2563eb, #1d4ed8);
                            padding: 32px 30px;
                            text-align: center;
                        ">
                            <div style="
                                display: inline-block;
                                width: 56px;
                                height: 56px;
                                line-height: 56px;
                                background: rgba(255,255,255,0.15);
                                border-radius: 16px;
                                font-size: 26px;
                                margin-bottom: 12px;
                            ">
                                📚
                            </div>

                            <h1 style="
                                color: #ffffff;
                                font-size: 20px;
                                font-weight: 700;
                                margin: 0;
                                letter-spacing: 0.3px;
                            ">
                                DocVault
                            </h1>
                        </div>

                        <!-- Body -->
                        <div style="padding: 36px 32px;">

                            <h2 style="
                                color: #0f172a;
                                font-size: 20px;
                                font-weight: 700;
                                margin: 0 0 12px;
                            ">
                                Reset your password
                            </h2>

                            <p style="
                                color: #64748b;
                                font-size: 15px;
                                line-height: 1.7;
                                margin: 0 0 8px;
                            ">
                                We received a request to reset the password for
                                your DocVault account.
                            </p>

                            <p style="
                                color: #64748b;
                                font-size: 15px;
                                line-height: 1.7;
                                margin: 0 0 28px;
                            ">
                                Click the button below to choose a new password.
                                For your security, this link will expire in
                                <strong style="color:#0f172a;">15 minutes</strong>.
                            </p>

                            <div style="text-align: center; margin-bottom: 28px;">
                                <a
                                    href="${resetUrl}"
                                    style="
                                        display: inline-block;
                                        padding: 14px 36px;
                                        background: #2563eb;
                                        color: #ffffff;
                                        text-decoration: none;
                                        border-radius: 12px;
                                        font-weight: 600;
                                        font-size: 15px;
                                        box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
                                    "
                                >
                                    Reset Password
                                </a>
                            </div>

                            <p style="
                                color: #94a3b8;
                                font-size: 13px;
                                text-align: center;
                                margin: 0 0 24px;
                            ">
                                Button not working? Copy and paste this link:<br />
                                <a href="${resetUrl}" style="color: #2563eb; word-break: break-all;">
                                    ${resetUrl}
                                </a>
                            </p>

                            <div style="
                                border-top: 1px solid #e2e8f0;
                                padding-top: 20px;
                            ">
                                <p style="
                                    color: #94a3b8;
                                    font-size: 13px;
                                    line-height: 1.6;
                                    margin: 0;
                                ">
                                    If you didn't request a password reset, you can
                                    safely ignore this email — your password will
                                    remain unchanged.
                                </p>
                            </div>

                        </div>

                        <!-- Footer -->
                        <div style="
                            background: #f8fafc;
                            padding: 20px 32px;
                            text-align: center;
                            border-top: 1px solid #e2e8f0;
                        ">
                            <p style="
                                color: #94a3b8;
                                font-size: 12px;
                                margin: 0;
                            ">
                                © 2026 DocVault. All rights reserved.
                            </p>
                        </div>

                    </div>
                </div>
            `,
        });

        console.log("Password reset email sent to:", email);

    } catch (error) {
        console.error("Email sending error:", error);
        throw new Error("Failed to send password reset email");
    }
};

export default sendPasswordResetEmail;