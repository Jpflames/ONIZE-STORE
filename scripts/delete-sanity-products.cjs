const fs = require("fs");
const { createClient } = require("@sanity/client");

for (const file of [".env.local", ".env"]) {
  if (!fs.existsSync(file)) continue;

  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]]) continue;

    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

const mode = process.argv[2] || "count";
const token = mode === "public-count" ? undefined : process.env.SANITY_API_TOKEN;

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-11-09",
  token,
  useCdn: false,
  perspective: "raw",
});

function weakenRef(ref) {
  if (!ref || ref._type !== "reference" || !ref._ref) return ref;
  return { ...ref, _weak: true };
}

async function getState() {
  const [products, sales, orders] = await Promise.all([
    client.fetch(`*[_type == "product"]{_id, name}`),
    client.fetch(`*[_type == "sale" && count(products[]._ref) > 0]{_id, title, products}`),
    client.fetch(`*[_type == "order" && count(items[].product._ref) > 0]{_id, id, items}`),
  ]);

  return { products, sales, orders };
}

async function inspectProductLikeDocuments() {
  return client.fetch(
    `*[
      _type == "product" ||
      _id match "drafts.*" && _type == "product" ||
      _id match "versions.**" && _type == "product" ||
      _id match "*.product*" ||
      _type match "*product*"
    ]{
      _id,
      _type,
      name,
      _createdAt,
      _updatedAt
    } | order(_updatedAt desc)`,
  );
}

async function getReferencingDocuments(productIds) {
  if (!productIds.length) return [];

  return client.fetch(
    `*[references($productIds) && !(_id in $productIds)]{
      ...,
      _id,
      _type
    }`,
    { productIds },
  );
}

function weakenProductRefs(value, productIds) {
  if (Array.isArray(value)) {
    return value.map((item) => weakenProductRefs(item, productIds));
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  if (value._type === "reference" && productIds.includes(value._ref)) {
    return { ...value, _weak: true };
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      weakenProductRefs(nestedValue, productIds),
    ]),
  );
}

function documentFields(document, productIds) {
  const fields = {};

  for (const [key, value] of Object.entries(document)) {
    if (key.startsWith("_")) continue;
    fields[key] = weakenProductRefs(value, productIds);
  }

  return fields;
}

async function commitChunks(mutations, label) {
  const chunkSize = 50;

  for (let index = 0; index < mutations.length; index += chunkSize) {
    const chunk = mutations.slice(index, index + chunkSize);
    await client.mutate(chunk);
    console.log(`${label}: ${Math.min(index + chunk.length, mutations.length)}/${mutations.length}`);
  }
}

async function main() {
  const { products, sales, orders } = await getState();

  console.log(
    JSON.stringify(
      {
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        products: products.length,
        salesWithProductRefs: sales.length,
        ordersWithProductRefs: orders.length,
      },
      null,
      2,
    ),
  );

  if (mode === "inspect") {
    const documents = await inspectProductLikeDocuments();
    console.log(JSON.stringify(documents, null, 2));
    return;
  }

  if (mode !== "delete") return;

  const productIds = products.map((product) => product._id);
  const referencingDocuments = await getReferencingDocuments(productIds);

  const patches = [
    ...sales.map((sale) => ({
      patch: {
        id: sale._id,
        set: { products: (sale.products || []).map(weakenRef) },
      },
    })),
    ...orders.map((order) => ({
      patch: {
        id: order._id,
        set: {
          items: (order.items || []).map((item) => ({
            ...item,
            product: weakenRef(item.product),
          })),
        },
      },
    })),
    ...referencingDocuments.map((document) => ({
      patch: {
        id: document._id,
        set: documentFields(document, productIds),
      },
    })),
  ];

  if (patches.length) {
    await commitChunks(patches, "Weakened product references");
  }

  const deletes = products.map((product) => ({ delete: { id: product._id } }));

  if (deletes.length) {
    await commitChunks(deletes, "Deleted products");
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
