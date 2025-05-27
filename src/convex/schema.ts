import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Renamed from 'UserReceipts' to 'CompanyReceipts' to match your mutation's insertion target.
  // This table will now accurately reflect the data structure of your saved receipts.
  CompanyReceipts: defineTable({
    receiptUrl: v.string(), // Corresponds to base64 image data
    company: v.string(),
    TIN: v.string(), // Added from your mutation arguments
    ORnumber: v.string(), // Case corrected to match mutation's input
    companyAddress: v.string(), // Added from your mutation arguments
    date: v.string(), // Added from your mutation arguments
    clientName: v.string(), // Added from your mutation arguments
    clientAddress: v.optional(v.string()), // Added, and made optional as per mutation args
    serviceName: v.string(), // Added from your mutation arguments
    serviceDetails: v.optional(v.string()), // Added, and made optional as per mutation args
    price: v.number(), // Corresponds to the 'price' from mutation (using v.number() for float compatibility)
    // Removed 'category', 'owner', 'timestamp', 'txHash' as they were not being saved by saveReceipt.
    // If you need these, uncomment them and ensure saveReceipt provides them or marks them v.optional().
    // Convex automatically adds `_creationTime` and `_id`.
  }),
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    image: v.string(),
    username: v.string(),
  }),
});
