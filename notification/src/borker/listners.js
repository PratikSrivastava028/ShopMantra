const { subscribeToQueue } = require("./borker");
const { sendEmail } = require("../email");
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    fullName: {
        firstName: String,
        lastName: String
    },
    role: String
});

const User = mongoose.models.user || mongoose.model('user', userSchema);

async function getCustomerName(email, fallbackUsername) {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://pratiksrivastava028:pUtXXSWATSffT86z@cluster0.zgi3wt7.mongodb.net/ShopMantra-auth');
        }
        const user = await User.findOne({ email });
        if (user) {
            if (user.fullName && user.fullName.firstName) {
                return user.fullName.firstName + " " + (user.fullName.lastName || "");
            }
            if (user.username && user.username !== 'undefined' && user.username !== 'null') {
                return user.username;
            }
        }
    } catch (err) {
        console.error("Error fetching user name from DB:", err);
    }
    if (fallbackUsername && fallbackUsername !== 'undefined' && fallbackUsername !== 'null') {
        return fallbackUsername;
    }
    return "Valued Customer";
}

const getEmailWrapper = (title, contentHTML) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #F8FAFC;
      color: #111827;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #F8FAFC;
      padding: 40px 20px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
    .header {
      background-color: #059669;
      background-image: linear-gradient(to right, #059669, #14B8A6);
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      color: #FFFFFF;
      font-size: 24px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
    }
    .content {
      padding: 40px 32px;
      font-size: 14px;
      line-height: 1.6;
    }
    .content p {
      margin: 0 0 16px;
    }
    .button-container {
      text-align: center;
      margin: 32px 0 16px;
    }
    .button {
      display: inline-block;
      background-color: #059669;
      color: #FFFFFF !important;
      text-decoration: none;
      padding: 12px 32px;
      font-size: 14px;
      font-weight: 700;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.2);
    }
    .footer {
      background-color: #F8FAFC;
      border-top: 1px solid #E5E7EB;
      padding: 24px 32px;
      text-align: center;
      font-size: 12px;
      color: #64748B;
    }
    .footer p {
      margin: 0 0 8px;
    }
    .highlight {
      font-weight: 700;
      color: #059669;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>${title}</h1>
      </div>
      <div class="content">
        ${contentHTML}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} ShopMantra Inc. All rights reserved.</p>
        <p>100 Innovation Parkway, Suite 500, San Francisco, CA 94107</p>
        <p>Need help? Contact <a href="mailto:support@shopmantra.ai" style="color: #059669; text-decoration: none;">support@shopmantra.ai</a></p>
      </div>
    </div>
  </div>
</body>
</html>
`;

module.exports = function () {

    subscribeToQueue("AUTH_NOTIFICATION.USER_CREATED", async (data) => {
        const title = "Welcome to ShopMantra!";
        const customerName = await getCustomerName(data.email, data.username);
        const emailHTMLTemplate = getEmailWrapper(title, `
        <p>Dear ${customerName},</p>
        <p>Welcome to <span class="highlight">ShopMantra</span>! We are absolutely thrilled to welcome you to our next-generation cognitive e-commerce platform.</p>
        <p>ShopMantra is designed to shift your online shopping experience from manual search grids to intuitive natural language conversations. You can now use our flagship AI companion to find items, compare technical specifications, and add bundles directly to your cart.</p>
        <div class="button-container">
          <a href="http://localhost:5173" class="button">Explore ShopMantra</a>
        </div>
        <p>If you have any questions or feedback, please reach out to us at any time. Happy shopping!</p>
        <p>Warm regards,<br/>The ShopMantra Team</p>
        `);

        await sendEmail(data.email, title, "Welcome to ShopMantra! Thank you for registering with us.", emailHTMLTemplate);
    });

    subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_INITIATED", async (data) => {
        const shortOrderId = data.orderId ? data.orderId.slice(-6) : "Unknown";
        const title = `Payment Initiated - Order #${shortOrderId}`;
        const currencySymbol = data.currency === 'USD' ? '$' : '₹';
        const formattedAmount = Number(data.amount || 0).toLocaleString();
        const customerName = await getCustomerName(data.email, data.username);

        const emailHTMLTemplate = getEmailWrapper(title, `
        <p>Dear ${customerName},</p>
        <p>This email is to confirm that your payment process for order <span class="highlight">#${shortOrderId}</span> has been successfully initiated.</p>
        <p>Here are the payment transaction details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <tr style="border-bottom: 1px solid #E5E7EB;">
            <td style="padding: 8px 0; color: #64748B;">Order Reference:</td>
            <td style="padding: 8px 0; font-weight: 700; text-align: right;">${data.orderId}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E5E7EB;">
            <td style="padding: 8px 0; color: #64748B;">Amount:</td>
            <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #059669;">${currencySymbol}${formattedAmount}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E5E7EB;">
            <td style="padding: 8px 0; color: #64748B;">Status:</td>
            <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #F59E0B;">Processing</td>
          </tr>
        </table>
        <p>We are currently confirming the transaction with the payment gateway. We will send you another email as soon as the payment confirmation goes through.</p>
        <p>Best regards,<br/>The ShopMantra Billing Team</p>
        `);

        await sendEmail(data.email, title, `Your payment of ${currencySymbol}${formattedAmount} for order #${shortOrderId} is being processed.`, emailHTMLTemplate);
    });

    subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_COMPLETED", async (data) => {
        const shortOrderId = data.orderId ? data.orderId.slice(-6) : "Unknown";
        const title = `Order Confirmed - Payment Successful #${shortOrderId}`;
        const currencySymbol = data.currency === 'USD' ? '$' : '₹';
        const formattedAmount = Number(data.amount || 0).toLocaleString();
        const customerName = await getCustomerName(data.email, data.username);

        const emailHTMLTemplate = getEmailWrapper(title, `
        <p>Dear ${customerName},</p>
        <p>Thank you for your purchase! We have successfully received your payment for order <span class="highlight">#${shortOrderId}</span>.</p>
        <p>Your order is now being processed by our seller dashboard and will be prepared for packaging and shipping shortly.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <tr style="border-bottom: 1px solid #E5E7EB;">
            <td style="padding: 8px 0; color: #64748B;">Order Reference:</td>
            <td style="padding: 8px 0; font-weight: 700; text-align: right;">${data.orderId}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E5E7EB;">
            <td style="padding: 8px 0; color: #64748B;">Total Amount Paid:</td>
            <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #059669;">${currencySymbol}${formattedAmount}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E5E7EB;">
            <td style="padding: 8px 0; color: #64748B;">Payment Status:</td>
            <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #22C55E;">Completed / Successful</td>
          </tr>
        </table>
        <div class="button-container">
          <a href="http://localhost:5173/customer/orders" class="button">View Order History</a>
        </div>
        <p>If you need to make any changes to your delivery address or contact information, please get in touch with our support desk immediately.</p>
        <p>Best regards,<br/>The ShopMantra Team</p>
        `);

        await sendEmail(data.email, title, `Your payment of ${currencySymbol}${formattedAmount} was successful and order #${shortOrderId} is confirmed!`, emailHTMLTemplate);
    });

    subscribeToQueue("PAYMENT_NOTIFICATION.PAYMENT_FAILED", async (data) => {
        const shortOrderId = data.orderId ? data.orderId.slice(-6) : "Unknown";
        const title = `Payment Unsuccessful - Order #${shortOrderId}`;
        const currencySymbol = data.currency === 'USD' ? '$' : '₹';
        const formattedAmount = Number(data.amount || 0).toLocaleString();
        const customerName = await getCustomerName(data.email, data.username);

        const emailHTMLTemplate = getEmailWrapper(title, `
        <p>Dear ${customerName},</p>
        <p>We were unable to process your payment for order <span class="highlight">#${shortOrderId}</span>.</p>
        <p>Please review the details below:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
          <tr style="border-bottom: 1px solid #E5E7EB;">
            <td style="padding: 8px 0; color: #64748B;">Order Reference:</td>
            <td style="padding: 8px 0; font-weight: 700; text-align: right;">${data.orderId}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E5E7EB;">
            <td style="padding: 8px 0; color: #64748B;">Attempted Amount:</td>
            <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #EF4444;">${currencySymbol}${formattedAmount}</td>
          </tr>
          <tr style="border-bottom: 1px solid #E5E7EB;">
            <td style="padding: 8px 0; color: #64748B;">Status:</td>
            <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #EF4444;">Failed / Declined</td>
          </tr>
        </table>
        <p>This can occur due to insufficient funds, incorrect payment details, or bank security blocks. No funds have been deducted from your account. You can attempt the payment again by visiting your cart checkout dashboard.</p>
        <div class="button-container">
          <a href="http://localhost:5173/customer/cart" class="button">Retry Payment</a>
        </div>
        <p>If the issue persists, please consult with your bank or contact our support team at support@shopmantra.ai.</p>
        <p>Best regards,<br/>The ShopMantra Billing Team</p>
        `);

        await sendEmail(data.email, title, `Your payment for order #${shortOrderId} failed. Please try again.`, emailHTMLTemplate);
    });

    subscribeToQueue("PRODUCT_NOTIFICATION.PRODUCT_CREATED", async (data) => {
        const customerName = await getCustomerName(data.email, data.username);
        const title = "A New Product is Live on ShopMantra!";
        const emailHTMLTemplate = getEmailWrapper(title, `
        <p>Dear ${customerName},</p>
        <p>We are excited to notify you that a brand new premium product has just been published on <span class="highlight">ShopMantra</span>!</p>
        <p>Be the first to browse its description, compare features with our cognitive AI assistant, and secure yours before stock runs out.</p>
        <div class="button-container">
          <a href="http://localhost:5173/customer/products" class="button">View New Launches</a>
        </div>
        <p>Thank you for being a valued member of the ShopMantra shopping ecosystem.</p>
        <p>Best regards,<br/>The ShopMantra Team</p>
        `);

        await sendEmail(data.email, title, "A new premium product was launched on ShopMantra! Check it out.", emailHTMLTemplate);
    });

}