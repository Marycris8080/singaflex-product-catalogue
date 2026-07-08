const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const data = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Email to customer
    await transporter.sendMail({
      from: `"Singaflex" <${process.env.GMAIL_USER}>`,
      to: data.email,
      subject: "Your Singaflex Catalogue Request",
      html: `
        <h2>Thank you for your enquiry.</h2>

        <p>Dear ${data.fullname},</p>

        <p>We have received your catalogue request.</p>

        <p>Our sales team will review your request and send you the requested catalogues shortly.</p>

        <p>Thank you,<br>Singaflex</p>
      `,
    });

    // Notification email to your inbox
    await transporter.sendMail({
      from: `"Singaflex Website" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: "New Catalogue Request",
      html: `
        <h2>New Catalogue Request</h2>

        <p><strong>Name:</strong> ${data.fullname}</p>
        <p><strong>Company:</strong> ${data.company}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Country:</strong> ${data.country}</p>
        <p><strong>Industry:</strong> ${data.industry}</p>

        <p><strong>Catalogues Requested:</strong></p>

        <pre>${JSON.stringify(data.catalogues, null, 2)}</pre>

        <p><strong>Comments:</strong></p>

        <p>${data.comments || "None"}</p>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
      }),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};