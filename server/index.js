import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads folder if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/uploads", express.static("uploads"));

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String },
    category: { type: String, enum: ["men", "women", "kids"] },
    shoeNo: { type: String },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", ContactSchema);

// Email configuration
const createTransporter = () => {
  // If email credentials are provided, use them; otherwise return null
  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log("Using custom SMTP email configuration");
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Fallback: Try Gmail SMTP if Gmail credentials are provided
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    console.log("Using Gmail SMTP configuration");
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  console.warn("⚠️  Email not configured! No GMAIL_USER/GMAIL_APP_PASSWORD or EMAIL_HOST/EMAIL_USER/EMAIL_PASS found in .env");
  return null;
};

const sendContactEmail = async (name, email, message) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn("❌ Email not configured. Contact message saved to database only.");
    console.warn("   Please add GMAIL_USER and GMAIL_APP_PASSWORD to your .env file");
    return null;
  }

  // Escape HTML to prevent XSS
  const escapeHtml = (text) => {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.GMAIL_USER || "noreply@babysneakers.com",
    to: "yohannesfk123@gmail.com",
    subject: `New Contact Form Submission from ${safeName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #f472b6; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-left: 4px solid #f472b6; margin-top: 10px; border-radius: 4px;">
            ${safeMessage}
          </div>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          This message was sent from the Baby Sneakers contact form.
        </p>
      </div>
    `,
    text: `
New Contact Form Submission

Name: ${name}
Email: ${email}

Message:
${message}

---
This message was sent from the Baby Sneakers contact form.
    `.trim(),
    replyTo: email,
  };

  try {
    console.log(`📧 Attempting to send email to yohannesfk123@gmail.com from ${mailOptions.from}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
    console.log("   Message ID:", info.messageId);
    console.log("   Response:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:");
    console.error("   Error code:", error.code);
    console.error("   Error message:", error.message);
    if (error.response) {
      console.error("   SMTP response:", error.response);
    }
    throw error;
  }
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Test email endpoint
app.post("/api/test-email", async (req, res) => {
  try {
    console.log("\n🧪 Testing email configuration...");
    const transporter = createTransporter();

    if (!transporter) {
      return res.status(400).json({
        error: "Email not configured",
        message: "Please add GMAIL_USER and GMAIL_APP_PASSWORD to your .env file"
      });
    }

    const testMailOptions = {
      from: process.env.EMAIL_FROM || process.env.GMAIL_USER || "noreply@babysneakers.com",
      to: "yohannesfk123@gmail.com",
      subject: "Test Email from Baby Sneakers",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Test Email</h2>
          <p>This is a test email to verify your email configuration is working correctly.</p>
          <p>If you received this, your email setup is working! ✅</p>
        </div>
      `,
      text: "This is a test email to verify your email configuration is working correctly.",
    };

    const info = await transporter.sendMail(testMailOptions);
    console.log("✅ Test email sent successfully:", info.messageId);
    res.json({
      success: true,
      message: "Test email sent successfully",
      messageId: info.messageId
    });
  } catch (error) {
    console.error("❌ Test email failed:", error);
    res.status(500).json({
      error: "Failed to send test email",
      message: error.message,
      code: error.code
    });
  }
});

// List products
app.get("/api/products", async (_req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Create product
app.post("/api/products", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category, shoeNo } = req.body;
    let imagePath = "";
    if (req.file) {
      // Add backend base url so frontend fetches the right file
      // Wait, frontend can prepend API_BASE or we can store relative path
      // Actually, storing local relative path is fine since we serve it
      imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.image && req.body.image.startsWith('data:image')) {
      // Fallback if they sent base64 anyway
      imagePath = req.body.image;
    }

    if (!name || price === undefined || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const created = await Product.create({
      name,
      price: Number(price),
      description,
      image: imagePath,
      category,
      shoeNo,
    });
    res.status(201).json(created);
  } catch (e) {
    console.error("Create error:", e);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Update product
app.put("/api/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category, shoeNo } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (price !== undefined) updateData.price = Number(price);
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (shoeNo !== undefined) updateData.shoeNo = shoeNo;

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updated);
  } catch (e) {
    console.error("Update error:", e);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete all products (use with caution!)
app.delete("/api/products", async (req, res) => {
  try {
    const result = await Product.deleteMany({});
    res.json({
      message: "All products deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete products" });
  }
});

// Delete a single product
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully", product: deleted });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Create contact message
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save to database
    const created = await Contact.create({ name, email, message });

    // Send email (don't fail if email fails, just log it)
    let emailStatus = { sent: false, error: null };
    try {
      console.log(`\n📬 Processing contact form submission from ${name} (${email})...`);
      const emailResult = await sendContactEmail(name, email, message);
      if (emailResult) {
        console.log("✅ Contact form processed successfully - email sent and saved to database\n");
        emailStatus.sent = true;
      } else {
        console.log("⚠️  Contact form saved to database but email was not sent (email not configured)\n");
        emailStatus.error = "Email not configured - check server logs";
      }
    } catch (emailError) {
      console.error("❌ Failed to send email, but message saved to database");
      console.error("   Error code:", emailError.code);
      console.error("   Error message:", emailError.message);
      if (emailError.response) {
        console.error("   SMTP response:", emailError.response);
      }
      emailStatus.error = emailError.message;
      // Continue even if email fails - message is still saved
    }

    res.status(201).json({
      ...created.toObject(),
      emailStatus
    });
  } catch (e) {
    console.error("Contact form error:", e);
    res.status(500).json({ error: "Failed to create contact message" });
  }
});

const PORT = process.env.PORT || 5177;
const MONGODB_URI = process.env.MONGODB_URI;

async function start() {
  try {
    if (!MONGODB_URI) {
      console.error("Missing MONGODB_URI in environment");
      process.exit(1);
    }

    // Check email configuration on startup
    console.log("\n📧 Checking email configuration...");
    const transporter = createTransporter();
    if (transporter) {
      console.log("✅ Email is configured and ready to send emails");
      console.log(`   Sending emails to: yohannesfk123@gmail.com`);
    } else {
      console.log("⚠️  WARNING: Email is NOT configured!");
      console.log("   Contact form submissions will be saved to database only.");
      console.log("   To enable email, add to your .env file:");
      console.log("   GMAIL_USER=your_email@gmail.com");
      console.log("   GMAIL_APP_PASSWORD=your_16_char_app_password\n");
    }

    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`✅ API listening on http://localhost:${PORT}`);
      console.log("   Health check: http://localhost:5177/api/health");
      console.log("   Test email: POST http://localhost:5177/api/test-email\n");
    });
  } catch (e) {
    console.error("Failed to start server", e);
    process.exit(1);
  }
}

start();
