import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { productType } from "./productType";
import { orderType } from "./orderType";
import { addressType } from "./addressType";

import { saleType } from "./saleType";
import { storeType } from "./storeType";
import { subscriberType } from "./subscriberType";
import { contactType } from "./contactType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    addressType,
    blockContentType,
    categoryType,
    orderType,
    productType,
    saleType,
    storeType,
    subscriberType,
    contactType,
  ],
};
