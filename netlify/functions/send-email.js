const nodemailer = require("nodemailer");
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxPFV-tOvh28rUPCCtJg2_FbQPkHdEYCIfFqK0y92kBzb_EdmzIpqmqQKk8k9eKEYjeUA/exec";

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

    // Google Drive links
    const catalogueLinks = {
      "Composite Hose":
        "https://drive.google.com/drive/folders/1XomIMMNTL1j1iKPoyttvUic58Wc19wdR?usp=sharing",

      "Expansion Joint":
        "https://drive.google.com/drive/folders/16maT2CyXUFOs2_LN9AkIlANNeXJ03ODu?usp=drive_link",

      "Polylock":
        "https://drive.google.com/drive/folders/1s-8o0nQY38H1p1o5Tv27zlIyO423C26t?usp=drive_link",

      "PTFE Hose":
        "https://drive.google.com/drive/folders/1g6_HgcC8RA6nRWmz8uJfO51ixEgDB_7d?usp=drive_link",

      "Rubber Flexible Joint":
        "https://drive.google.com/drive/folders/1A4h2KdSydD9Rlj21se4N2y95rukAOgrz?usp=drive_link",

      "Stainless Steel Flexible Hose":
        "https://drive.google.com/drive/folders/1ld7vYHPq1SXeJyEw2NTSwAN588aR92OX?usp=drive_link",
    };

    const catalogueList = (data.catalogues || [])
      .map(
        (catalogue) => `
          <li>
            <strong>${catalogue}</strong><br>
            <a href="${catalogueLinks[catalogue]}">
              Download ${catalogue}
            </a>
          </li>
        `
      )
      .join("");

    // Customer Email
    await transporter.sendMail({
      from: `"Singaflex" <${process.env.GMAIL_USER}>`,
      to: data.email,
      subject: "Your Singaflex Catalogue Request",
      html: `
        <h2>Thank you for your enquiry.</h2>

        <p>Dear ${data.fullname},</p>

        <p>Thank you for your interest in Singaflex.</p>

        <p>You can download the catalogue(s) you requested using the links below:</p>

        <ul>
          ${catalogueList}
        </ul>

        <p><strong>Where did you hear about us?</strong> ${data.leadSource}</p>

        ${
          data.eventName
            ? `<p><strong>Event Name:</strong> ${data.eventName}</p>`
            : ""
        }

        <p>If you require additional technical information or a quotation, simply reply to this email and our sales team will be happy to assist you.</p>

        <br>

        <p>Best Regards,</p>

        <p><strong>Singaflex</strong></p>
      `,
    });

    // Admin Notification
    await transporter.sendMail({
      from: `"Singaflex Website" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: "New Catalogue Request",
      html: `
        <h2>New Catalogue Request</h2>

        <p><strong>Name:</strong> ${data.fullname}</p>
        <p><strong>Company:</strong> ${data.company}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || "-"}</p>
        <p><strong>Country:</strong> ${data.country || "-"}</p>
        <p><strong>Industry:</strong> ${data.industry || "-"}</p>

        <p><strong>Where did you hear about us?</strong> ${data.leadSource}</p>

        <p><strong>Event Name:</strong> ${data.eventName || "-"}</p>

        <h3>Requested Catalogues</h3>

        <ul>
          ${(data.catalogues || [])
            .map((c) => `<li>${c}</li>`)
            .join("")}
        </ul>

        <p><strong>Comments:</strong></p>

        <p>${data.comments || "None"}</p>
      `,
    });

  try {

  const sheetResponse = await fetch(GOOGLE_SCRIPT_URL, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({

      fullname: data.fullname,
      company: data.company,
      email: data.email,
      phone: data.phone,
      country: data.country,
      industry: data.industry,
      leadSource: data.leadSource,
      eventName: data.eventName,
      catalogues: data.catalogues,
      comments: data.comments

    })

  });

  if (!sheetResponse.ok) {
  throw new Error(`Google Sheets returned ${sheetResponse.status}`);
}

console.log("Google Sheets updated successfully.");

} catch (err) {

  console.error("Failed to write to Google Sheets:", err);

}

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