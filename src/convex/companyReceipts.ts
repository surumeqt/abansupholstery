import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const saveReceipt = mutation({
  args: {
    receiptUrl: v.string(),
    company: v.string(),
    TIN: v.string(),
    ORnumber: v.string(),
    companyAddress: v.string(),
    date: v.string(),
    clientName: v.string(),
    clientAddress: v.optional(v.string()),
    serviceName: v.string(),
    serviceDetails: v.optional(v.string()),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    // Ensure this table name matches your schema exactly: 'CompanyReceipts'
    await ctx.db.insert('CompanyReceipts', {
      receiptUrl: args.receiptUrl,
      company: args.company,
      TIN: args.TIN,
      ORnumber: args.ORnumber, // Matches schema's ORnumber
      companyAddress: args.companyAddress,
      date: args.date,
      clientName: args.clientName,
      clientAddress: args.clientAddress,
      serviceName: args.serviceName,
      serviceDetails: args.serviceDetails,
      price: args.price, // Matches schema's price
    });
  },
});

export const getByReceiptId = query({
  args: { receiptId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("CompanyReceipts") // Matches schema's CompanyReceipts
      .withIndex("by_ORnumber", (q) => q.eq("ORnumber", args.receiptId)) // Uses ORnumber for index
      .order("desc")
      .first();
  },
});

export const listReceipts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("CompanyReceipts").collect(); // Matches schema's CompanyReceipts
  },
});
