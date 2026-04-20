import { HomeIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const addressType = defineType({
  name: "address",
  title: "Address",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "clerkUserId",
      title: "Store User ID",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "addressType",
      title: "Address Type",
      type: "string",
      options: {
        list: [
          { title: "Home", value: "home" },
          { title: "Work", value: "work" },
          { title: "Others", value: "others" },
        ],
      },
      initialValue: "home",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "line1",
      title: "Address Line 1",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "line2",
      title: "Address Line 2",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "state",
      title: "State / Province",
      type: "string",
    }),
    defineField({
      name: "postalCode",
      title: "Postal / Zip Code",
      type: "string",
    }),
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isDefault",
      title: "Is Default",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "email",
      subtitle: "fullName",
    },
    prepare(select) {
      return {
        title: select.title,
        subtitle: select.subtitle,
      };
    },
  },
});
