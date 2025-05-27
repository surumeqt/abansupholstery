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
    serviceType: v.string(), // Added serviceType
    serviceName: v.string(),
    serviceDetails: v.optional(v.string()),
    price: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('CompanyReceipts', {
      receiptUrl: args.receiptUrl,
      company: args.company,
      TIN: args.TIN,
      ORnumber: args.ORnumber,
      companyAddress: args.companyAddress,
      date: args.date,
      clientName: args.clientName,
      clientAddress: args.clientAddress,
      serviceName: args.serviceName,
      serviceDetails: args.serviceDetails,
      serviceType: args.serviceType,
      price: args.price,
    });
  },
});

export const listReceipts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("CompanyReceipts").collect();
  },
});
