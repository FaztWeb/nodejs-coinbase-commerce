const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const { Client, resources, Webhook } = require("coinbase-commerce-node");
const { COINBASE_API_KEY, COINBASE_WEBHOOK_SECRET } = require("./config");

const { Charge } = resources;
Client.init(COINBASE_API_KEY);

const app = express();

app.use(cors());
app.use(morgan("dev"));

// add verify in order to process rawBody
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.get("/create-charge", async (req, res) => {
  const chargeData = {
    name: "Sound Effect",
    description: "An awesome science fiction sound effect",
    local_price: {
      amount: 0.2,
      currency: "USD",
    },
    pricing_type: "fixed_price",
    metadata: {
      customer_id: "id_1005",
      customer_name: "Satoshi Nakamoto",
    },
    redirect_url: "https://coinbase-fazt-test.herokuapp.com/success-payment",
    cancel_url: "https://coinbase-fazt-test.herokuapp.com/cancel-payment",
  };

  const charge = await Charge.create(chargeData);

  console.log(charge);

  res.send(charge);
});

app.post("/payment-handler", (req, res) => {
  const rawBody = req.rawBody;
  const signature = req.headers["x-cc-webhook-signature"];
  const webhookSecret = COINBASE_WEBHOOK_SECRET;

  console.log({ rawBody, signature, webhookSecret });

  let event;

  try {
    event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);
    // console.log(event);

    if (event.type === "charge:pending") {
      // received order
      // user paid, but transaction not confirm on blockchain yet
      console.log("pending payment");
    }

    if (event.type === "charge:confirmed") {
      // fulfill order
      // charge confirmed
      console.log("charge confirme");
    }

    if (event.type === "charge:failed") {
      // cancel order
      // charge failed or expired
      console.log("charge failed");
    }

    res.send(`success ${event.id}`);
  } catch (error) {
    console.log(error);
    res.status(400).send("failure");
  }
});

app.get("/success-payment", (req, res) => {
  res.send("success payment");
});

app.get("/cancel-payment", (req, res) => {
  res.send("cancel payment");
});

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

app.listen(PORT);
console.log("Server on port", PORT);
