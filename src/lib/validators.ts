import { z } from "zod";

export const paymentFormSchema = z.object({
  productType: z.enum(["Spot", "Forward", "Swap", "NDF"], {
    required_error: "Product type is required",
  }),
  direction: z.enum(["Buy", "Sell"], {
    required_error: "Direction is required",
  }),
  currencyPair: z.string().min(1, "Currency pair is required").regex(
    /^[A-Z]{3}\/[A-Z]{3}$/,
    "Invalid currency pair format"
  ),
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be positive")
    .min(1000, "Minimum amount is 1,000")
    .max(50_000_000, "Maximum amount is 50,000,000"),
  valueDate: z.string().min(1, "Value date is required").refine(
    (date) => {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    },
    { message: "Value date cannot be in the past" }
  ),
  settlementType: z.enum(["Gross", "Net", "PVP"], {
    required_error: "Settlement type is required",
  }),
  counterparty: z
    .string()
    .min(2, "Counterparty name must be at least 2 characters")
    .max(100, "Counterparty name must be less than 100 characters")
    .regex(
      /^[a-zA-Z0-9\s\-&.,'()]+$/,
      "Counterparty contains invalid characters"
    ),
});

export type PaymentFormSchema = z.infer<typeof paymentFormSchema>;

export const transactionFilterSchema = z.object({
  search: z.string().optional(),
  productType: z.array(z.enum(["Spot", "Forward", "Swap", "NDF"])).optional(),
  status: z
    .array(z.enum(["Completed", "Pending", "Failed", "Processing"]))
    .optional(),
  currencyPair: z.array(z.string()).optional(),
});

export const orderFormSchema = z.object({
  pair: z.string().min(1, "Currency pair is required").regex(
    /^[A-Z]{3}\/[A-Z]{3}$/,
    "Invalid currency pair format"
  ),
  direction: z.enum(["Buy", "Sell"], {
    required_error: "Direction is required",
  }),
  type: z.enum(["LIMIT", "STOP", "TWAP", "VWAP"], {
    required_error: "Order type is required",
  }),
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be positive")
    .min(10_000, "Minimum amount is 10,000")
    .max(50_000_000, "Maximum amount is 50,000,000"),
  currency: z.string().min(1, "Currency is required"),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive("Price must be positive"),
  tif: z.enum(["GTC", "IOC", "FOK", "GTD", "DAY"], {
    required_error: "Time in force is required",
  }),
  notes: z.string().max(200, "Notes must be under 200 characters").optional(),
});

export type OrderFormSchema = z.infer<typeof orderFormSchema>;
