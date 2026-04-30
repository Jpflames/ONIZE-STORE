import { defineQuery } from "next-sanity";
import { sanityFetch } from "../lib/live";
import { backendClient } from "../lib/backendClient";
import { client } from "../lib/client";

export const getAllProducts = async () => {
  const PRODUCTS_QUERY = defineQuery(`*[_type=="product"] | order(name asc)`);
  try {
    const products = await sanityFetch({
      query: PRODUCTS_QUERY,
    });
    return products.data || [];
  } catch (error) {
    console.log("Error fetching all products:", error);
    return [];
  }
};

export const getPaginatedProducts = async ({
  pageIndex = 0,
  limit = 12,
  categorySlug = "",
}: {
  pageIndex?: number;
  limit?: number;
  categorySlug?: string;
}) => {
  const start = pageIndex * limit;
  const end = start + limit;

  // Total count query for pagination calculations
  const countQuery = categorySlug
    ? defineQuery(
        `count(*[_type == 'product' && references(*[_type == "category" && slug.current == $categorySlug]._id)])`,
      )
    : defineQuery(`count(*[_type == 'product'])`);

  // Paginated query
  let PAGINATED_QUERY;
  if (categorySlug) {
    PAGINATED_QUERY = defineQuery(
      `*[_type == 'product' && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc) [$start...$end]`,
    );
  } else {
    PAGINATED_QUERY = defineQuery(
      `*[_type == 'product'] | order(name asc) [$start...$end]`,
    );
  }

  try {
    const [products, totalItems] = await Promise.all([
      sanityFetch({
        query: PAGINATED_QUERY,
        params: {
          start,
          end,
          categorySlug,
        },
      }),
      sanityFetch({
        query: countQuery,
        params: {
          categorySlug,
        },
      }),
    ]);
    return {
      products: products?.data || [],
      totalItems: totalItems?.data || 0,
    };
  } catch (error) {
    console.error("Error fetching paginated products:", error);
    return { products: [], totalItems: 0 };
  }
};

export const getAllCategories = async (quantity?: number) => {
  const CATEGORIES_QUERY = defineQuery(
    `*[_type=="category"] | order(name asc)`,
  );

  try {
    const categories = await sanityFetch({
      query: CATEGORIES_QUERY,
    });
    const data = categories?.data || [];
    if (quantity) {
      return data.slice(0, quantity);
    }
    return data;
  } catch (error) {
    console.error("Error fetching all categories:", error);
    return [];
  }
};

export const searchProductsByName = async (searchParam: string) => {
  const PRODUCT_SEARCH_QUERY = defineQuery(
    `*[_type == "product" && name match $searchParam] | order(name asc)`,
  );

  try {
    const products = await sanityFetch({
      query: PRODUCT_SEARCH_QUERY,
      params: {
        searchParam: `${searchParam}`,
      },
    });
    return products?.data || [];
  } catch (error) {
    console.error("Error fetching products by name:", error);
    return [];
  }
};

export const getProductBySlug = async (slug: string) => {
  // Use the public/published perspective for the storefront so the product page
  // always matches what the product grid (client-side `client.fetch`) shows.
  const PRODUCT_BY_ID_QUERY = defineQuery(
    `*[_type == "product" && slug.current == $slug] | order(_updatedAt desc)[0]{
      ...,
      categories[]->
    }`,
  );

  try {
    const product = await client.fetch(PRODUCT_BY_ID_QUERY, { slug });
    return product || null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

export const getProductById = async (id: string) => {
  const PRODUCT_BY_ID_QUERY = defineQuery(
    `*[_type == "product" && _id == $id][0]{
      ...,
      categories[]->
    }`,
  );

  try {
    const product = await client.fetch(PRODUCT_BY_ID_QUERY, { id });
    return product || null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

export const getProductsByCategory = async (categorySlug: string) => {
  const PRODUCT_BY_CATEGORY_QUERY = defineQuery(
    `*[_type == 'product' && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc)`,
  );
  try {
    const products = await sanityFetch({
      query: PRODUCT_BY_CATEGORY_QUERY,
      params: {
        categorySlug,
      },
    });
    return products?.data || [];
  } catch (error) {
    console.error("Erroor fetching products by category:", error);
    return [];
  }
};

export const getSale = async () => {
  const SALE_QUERY = defineQuery(`*[_type == 'sale'] | order(name asc)`);
  try {
    const products = await sanityFetch({
      query: SALE_QUERY,
    });
    return products?.data || [];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
};

export const getMyOrders = async (email: string) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const MY_ORDERS_QUERY =
    defineQuery(`*[_type == 'order' && email == $email] | order(orderDate desc){
    ...,products[]{
      ...,product->
    }
  }`);

  try {
    const orders = await backendClient.fetch(MY_ORDERS_QUERY, { email });
    return orders || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const getOrderById = async (id: string) => {
  if (!id) throw new Error("Order ID is required");

  const ORDER_BY_ID_QUERY = `*[_type == 'order' && _id == $id][0]{
    ...,products[]{
      ...,product->
    }
  }`;

  try {
    const order = await backendClient.fetch(ORDER_BY_ID_QUERY, { id });
    return order || null;
  } catch (error) {
    console.error("Error fetching order by id:", error);
    return null;
  }
};
export const getUserAddress = async (email: string) => {
  if (!email) return null;

  const ADDRESS_QUERY = `*[_type == "address" && email == $email][0]`;

  try {
    const address = await backendClient.fetch(ADDRESS_QUERY, { email });
    return address || null;
  } catch (error) {
    console.error("Error fetching user address:", error);
    return null;
  }
};

export const getProductsByBase = async (base: string) => {
  const PRODUCTS_BY_BASE_QUERY = defineQuery(
    `*[_type == 'product' && $base in productBase] | order(name asc)`,
  );
  try {
    const products = await sanityFetch({
      query: PRODUCTS_BY_BASE_QUERY,
      params: {
        base,
      },
    });
    return products?.data || [];
  } catch (error) {
    console.error("Error fetching products by base:", error);
    return [];
  }
};
