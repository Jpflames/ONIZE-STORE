import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const storeType = defineType({
  name: "store",
  title: "Store",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "name",
      title: "Store Name",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Store Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "location",
      title: "Address",
      type: "string",
    }),
    defineField({
      name: "phoneNumber",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "lat",
      title: "Latitude",
      type: "number",
    }),
    defineField({
      name: "lng",
      title: "Longitude",
      type: "number",
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
      title: "name",
      subtitle: "location",
      media: "image",
    },
  },
});
