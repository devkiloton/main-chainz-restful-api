export const welcomeEmail = (data: { name: string }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <style>
          /* Apply the black background to the header */
          .header {
              text-align: center;
              padding: 20px;
              font-size: 24px;
              font-weight: bold;
              color: #fff;
              background-color: #000;
          }
  
          /* Apply a sophisticated light gradient background to the body */
          body {
              background: linear-gradient(45deg, #f8f8f8, #e6e6e6);
              background-size: 400% 400%;
              padding: 20px;
          }
      </style>
  </head>
  <body>
      <div class="header">MY_COMPANY</div>
      <p>Dear ${data.name},</p>
  
      <p>Welcome to [Your Crypto Exchange Name]! We're thrilled to have you on board and to introduce you to the world of cryptocurrencies and digital assets where you are the protagonist.</p>
  
      <p>At [Your Crypto Exchange Name], we're dedicated to providing you with a secure, seamless, and as anonymously as possible platform for trading and managing cryptocurrencies. We're here to support you every step of the way.</p>
  
      <p>Here's what you can expect from us:</p>
  
      <ul>
          <li>Access to cryptocurrencies for trading and investment.</li>
          <li>Customer support to answer your questions and provide assistance.</li>
          <li>User-friendly tools and resources to help you navigate the crypto market.</li>
          <li>Robust security measures to keep your digital assets safe.</li>
          <li>Freedom to sell any coin to other people in the P2P market place, you define your taxes, </li>
      </ul>
  
      <p>We're not just a crypto exchange; we're your partner in your cryptocurrency journey. Our mission is to make crypto accessible, secure, and user-friendly for everyone, and we're excited to have you as a part of our community.</p>
      
      <p>If you ever have questions, concerns, or simply want to chat about cryptocurrencies, don't hesitate to reach out to our support team. We're here to help you make the most of your crypto experience.</p>
      
      <p>Thank you for choosing [Your Crypto Exchange Name]. Let's explore the exciting world of cryptocurrencies together!</p>
      
      <p>Best regards,<br>Your [Your Crypto Exchange Name] Team</p>
  
  </body>
  </html>
    `;
};
