export default async function handler(req, res) {

  // =========================
  // META WEBHOOK VERIFICATION
  // =========================
  if (req.method === "GET") {

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }

    return res.status(403).send("Verification failed");
  }


  // =========================
  // WHATSAPP INCOMING MESSAGE
  // =========================
  if (req.method === "POST") {

    try {

      const body = req.body;

      const message =
        body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

      // No message = ignore
      if (!message) {
        return res.status(200).send("EVENT_RECEIVED");
      }

      const from = message.from;

      // Only handle text messages
      if (message.type !== "text") {
        return res.status(200).send("EVENT_RECEIVED");
      }

      const receivedText = message.text?.body || "";

      console.log("Message received:", receivedText);
      console.log("From:", from);


      // =========================
      // AUTO REPLY
      // =========================

      const replyText =
        "Hello 👋\n\n" +
        "Thanks for messaging us!\n" +
        "Your message has been received successfully. ✅";


      // =========================
      // SEND REPLY THROUGH META
      // =========================

      const response = await fetch(
        `https://graph.facebook.com/${process.env.GRAPH_API_VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",

          headers: {
            "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`,
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: from,
            type: "text",
            text: {
              preview_url: false,
              body: replyText
            }
          })
        }
      );


      const result = await response.json();

      console.log("Meta response:", result);


      // Webhook received successfully
      return res.status(200).send("EVENT_RECEIVED");

    } catch (error) {

      console.error("Webhook error:", error);

      return res.status(200).send("EVENT_RECEIVED");
    }
  }


  // =========================
  // OTHER METHODS
  // =========================

  return res.status(405).send("Method Not Allowed");
}
