import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { Doc } from './_generated/dataModel';

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
    serviceType: v.string(),
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

export const listReceiptsByDateRange = query({
  args: {
    startDate: v.optional(v.string()), // Optional start date string (e.g., "YYYY-MM-DD")
    endDate: v.optional(v.string()),   // Optional end date string (e.g., "YYYY-MM-DD")
  },
  handler: async (ctx, args) => {
    // Fetch all receipts first.
    // If you have a very large number of receipts, consider changing the 'date' field
    // in your schema to a number (timestamp) and adding an index for more efficient
    // range queries directly in Convex. For string dates, filtering in memory is needed.
    const allReceipts = await ctx.db.query("CompanyReceipts").collect();

    let filteredReceipts: Doc<"CompanyReceipts">[] = allReceipts;

    // Convert string dates from arguments to Date objects for comparison
    const filterStartDate = args.startDate ? new Date(args.startDate) : null;
    // For the end date, we want to include the entire day, so set it to the end of the day
    const filterEndDate = args.endDate ? new Date(args.endDate) : null;
    if (filterEndDate) {
      filterEndDate.setHours(23, 59, 59, 999); // Set to end of the day
    }

    if (filterStartDate || filterEndDate) {
      filteredReceipts = allReceipts.filter(receipt => {
        // Convert the receipt's date string to a Date object
        const receiptDate = new Date(receipt.date);

        // Check if the receipt date is within the specified range
        const isAfterStartDate = filterStartDate ? receiptDate >= filterStartDate : true;
        const isBeforeEndDate = filterEndDate ? receiptDate <= filterEndDate : true;

        return isAfterStartDate && isBeforeEndDate;
      });
    }

    return filteredReceipts;
  },
});