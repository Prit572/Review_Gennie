import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Fetch product data using Gemini API for dynamic feature extraction
 * @param {string} productName
 * @returns {Promise<ProductData|null>} Product data or null if not found
 * @throws Error if fetch fails
 */
export async function fetchProductData(productName) {
  // Call the local Gemini proxy endpoint
  const response = await fetch('http://localhost:4000/api/gemini-analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productName })
  });
  if (!response.ok) throw new Error('Gemini proxy API error');
  const data = await response.json();
  // Expecting data.product to be an object like { id, name, features: { ... } }
  return data.product || null;
}

/**
 * Search for products by partial name (case-insensitive)
 * @param {string} query
 * @returns {Promise<Array>} List of matching products
 */
export async function searchProductsByName(query) {
  const { supabase } = await import('@/integrations/supabase/client');
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('name', { ascending: true })
    .limit(8);
  if (error) throw new Error(error.message);
  return data || [];
}

/**
 * Search for products using the Best Buy API (all electronics, filter out non-devices)
 * @param {string} query
 * @returns {Promise<Array>} List of matching products from Best Buy
 */
export async function searchBestBuyProducts(query) {
  const apiKey = 'piPLR191XZskLljHtLz8VQaT';
  const url = `https://api.bestbuy.com/v1/products((search=${encodeURIComponent(query)}))?apiKey=${apiKey}&format=json&show=sku,name,image,salePrice,shortDescription`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Best Buy API error');
  const data = await res.json();
  if (!data.products) return [];
  // Filter out warranties, protection plans, services, and similar non-device items
  const exclude = /warranty|protection|plan|service|replacement|insurance|support|membership/i;
  return data.products.filter(product => !exclude.test(product.name)).map(product => ({
    id: product.sku,
    name: product.name,
    image_url: product.image,
    price: product.salePrice,
    description: product.shortDescription,
    source: 'bestbuy',
  }));
}

// Static product list for demo (expand as needed)
const STATIC_PRODUCTS = [
  // Phones
  { id: 'static-iphone13', name: 'iPhone 13', image_url: '', category: 'Phone', source: 'static' },
  { id: 'static-iphone14', name: 'iPhone 14', image_url: '', category: 'Phone', source: 'static' },
  { id: 'static-galaxyS23', name: 'Samsung Galaxy S23', image_url: '', category: 'Phone', source: 'static' },
  // Laptops
  { id: 'static-macbookairm2', name: 'MacBook Air M2', image_url: '', category: 'Laptop', source: 'static' },
  { id: 'static-dellxps13', name: 'Dell XPS 13', image_url: '', category: 'Laptop', source: 'static' },
  // ACs
  { id: 'static-lgac', name: 'LG 1.5 Ton Split AC', image_url: '', category: 'AC', source: 'static' },
  { id: 'static-samsungac', name: 'Samsung 2 Ton Inverter AC', image_url: '', category: 'AC', source: 'static' },
  // Refrigerators
  { id: 'static-whirlpoolfridge', name: 'Whirlpool 340L Refrigerator', image_url: '', category: 'Refrigerator', source: 'static' },
  { id: 'static-lgfridge', name: 'LG 260L Double Door Refrigerator', image_url: '', category: 'Refrigerator', source: 'static' },
  // TVs
  { id: 'static-samsungtv', name: 'Samsung 55" QLED TV', image_url: '', category: 'TV', source: 'static' },
  { id: 'static-sonybravia', name: 'Sony Bravia 50" 4K TV', image_url: '', category: 'TV', source: 'static' },
];

/**
 * Search static product list for matches
 * @param {string} query
 * @returns {Array} Matching static products
 */
export function searchStaticProducts(query) {
  const q = query.trim().toLowerCase();
  return STATIC_PRODUCTS.filter(p => p.name.toLowerCase().includes(q));
}
