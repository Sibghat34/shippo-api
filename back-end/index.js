import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { Shippo } from "shippo";

const shippoClient = new Shippo({
  apiKeyHeader: process.env.SHIPPO_API,
  shippoApiVersion: "2018-02-08",
});

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));
app.use(express.json());

const createShipment = async (addressFrom, addressTo, parcel) => {
  try {
    const result = await shippoClient.shipments.create({
      addressFrom: addressFrom,
      addressTo: addressTo,
      parcels: [parcel],
    });

    console.log(result);

    const rate = result.rates[0];
    const transaction = await shippoClient.transactions.create({
      rate: rate.objectId,
      label_file_type: "PDF",
      async: false,
    });

    if (transaction.status === "SUCCESS") {
      return { labelUrl: transaction.labelUrl };
    } else {
      throw new Error(transaction.messages[0].text);
    }
  } catch (error) {
    console.log("this is error:", error);
    throw new Error(`Error creating shipment: ${error}`);
  }
};

app.post("/create-shipping-label", async (req, res) => {
  const {
    senderName,
    senderAddress,
    receiverName,
    receiverAddress,
    packageWeight,
    length,
    width,
    height,
  } = req.body;

  console.log(
    senderName,
    senderAddress,
    receiverName,
    receiverAddress,
    packageWeight,
    height,
    length,
    width
  );

  const addressFrom = {
    name: senderName,
    company: "Shippo",
    street1: senderAddress,
    street3: "",
    streetNo: "",
    city: "San Francisco",
    state: "CA",
    zip: "94117",
    country: "US",
    phone: "+1 555 341 9393",
    email: "shippotle@shippo.com",
    isResidential: true,
    metadata: "Customer ID 123456",
    validate: true,
  };

  const addressTo = {
    name: receiverName,
    street1: receiverAddress,
    street3: "",
    streetNo: "",
    city: "San Francisco",
    state: "CA",
    zip: "94117",
    country: "US",
    phone: "5555555555",
    email: "receiver@example.com",
    isResidential: true,
    metadata: "Customer ID 12345678",
    validate: true,
  };

  const parcel = {
    extra: {
      cod: {
        amount: "5.5",
        currency: "USD",
        paymentMethod: "CASH",
      },
      insurance: {
        amount: "5.5",
        content: "Laptop",
        currency: "USD",
        provider: "UPS",
      },
    },
    metadata: "Customer ID 123456",
    massUnit: "kg",
    weight: `${packageWeight}`,
    distanceUnit: "cm",
    height: `${height}`,
    length: `${length}`,
    width: `${width}`,
    template: "USPS_FlatRateGiftCardEnvelope",
  };

  try {
    const result = await createShipment(addressFrom, addressTo, parcel);
    res.json(result);
  } catch (error) {
    console.error("Error creating shipment:", error);
    res.status(500).json({ error: error.message || "Unknown error occurred" });
  }
});

app.listen(8000, () => {
  console.log("Server listening on port 8000");
});
