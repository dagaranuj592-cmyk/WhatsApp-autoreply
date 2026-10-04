export default function handler(req, res) {
  res.status(200).setHeader("Content-Type", "text/html");
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Privacy Policy - Autoreply Bot</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      <h1>Privacy Policy</h1>

      <p>Last updated: October 4, 2026</p>

      <h2>Information We Receive</h2>
      <p>
        Autoreply Bot may receive WhatsApp messages and basic information
        required to respond to messages through the WhatsApp Business Platform.
      </p>

      <h2>How We Use Information</h2>
      <p>
        Information received through WhatsApp is used to provide automated
        replies and operate the messaging service.
      </p>

      <h2>Data Sharing</h2>
      <p>We do not sell or rent users' personal information.</p>

      <h2>Data Security</h2>
      <p>
        We take reasonable measures to protect information processed by the service.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us
        through the contact information associated with this application.
      </p>
    </body>
    </html>
  `);
}
