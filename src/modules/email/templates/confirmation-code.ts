export const confirmationCode = (data: { code: string }) => `
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
    <p>Dear Valued User,</p>
    <p><strong>Your Confirmation Code:</strong> <span id="confirmationCode">${data.code}</span></p>
    <div class="tooltip" id="copyTooltip">Code Copied!</div>
    

    <p>If you have any questions or require assistance, please do not hesitate to contact our dedicated support team!</p>
    <p>Best regards,<br>Your Name</p>
</body>
</html>
`;
