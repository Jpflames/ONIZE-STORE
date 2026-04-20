import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const saleType = defineType({
  name: "sale",
  title: "Sale",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Sale Title",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Sale Description",
      type: "text",
    }),
    defineField({
      name: "badge",
      title: "Badge Text",
      type: "string",
      description: "e.g., '50% OFF', 'Hot Deal'",
    }),
    defineField({
      name: "image",
      title: "Product Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "type",
      title: "Sale Type",
      type: "string",
      options: {
        list: [
          { title: "Offer", value: "offer" },
          { title: "Best Deal", value: "best-deal" },
          { title: "Gift", value: "gift" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "products",
      title: "Product References",
      type: "array",
      of: [{ type: "reference", to: { type: "product" } }],
    }),
    defineField({
      name: "details",
      title: "Sale Details",
      type: "blockContent", // Assuming access to blockContent, otherwise 'text'
    }),
    defineField({
      name: "couponCode",
      title: "Coupon Code",
      type: "string",
    }),
    defineField({
      name: "discountAmount",
      title: "Discount Amount",
      type: "number",
      description: "Percentage of discount",
    }),
    defineField({
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "type",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle
          ? `${subtitle.charAt(0).toUpperCase() + subtitle.slice(1)}`
          : "No Type",
        media,
      };
    },
  },
});
