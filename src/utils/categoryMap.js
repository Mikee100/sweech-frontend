export const slugify = (value = '') =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Central alias map for URL slugs that should match multiple underlying categories/subcategories.
// Each entry is a function that receives categorySlug and subCategorySlug and returns true/false.
const CATEGORY_ALIAS_MATCHERS = {
  'smart-watches': (categorySlug, subCategorySlug) => {
    // Group all wearable watches under "Smart watches"
    return categorySlug === 'wearables' || subCategorySlug.includes('watch');
  },
  cables: (categorySlug, subCategorySlug) => {
    // Map "Cables" to "Cables & Adapters"
    return (
      categorySlug === 'accessories' &&
      subCategorySlug.includes('cables-adapters')
    );
  },
  cases: (categorySlug, subCategorySlug) => {
    // Map "Cases" to "Cases & Covers"
    return (
      categorySlug === 'accessories' &&
      subCategorySlug.includes('cases-covers')
    );
  },
  chargers: (categorySlug, subCategorySlug) => {
    // Treat "Chargers" as power-related accessories
    return (
      categorySlug === 'accessories' &&
      (subCategorySlug.includes('power') ||
        subCategorySlug.includes('power-banks'))
    );
  },
  'screen-protectors': (categorySlug, subCategorySlug) => {
    // Map "Screen protectors" to protective accessories like cases & covers / phone accessories
    return (
      (categorySlug === 'accessories' &&
        subCategorySlug.includes('cases-covers')) ||
      (categorySlug === 'phones-tablets' &&
        subCategorySlug.includes('phone-accessories'))
    );
  },
  earphones: (categorySlug, subCategorySlug) => {
    // Map generic "Earphones" URL to our audio subcategories
    return (
      categorySlug === 'audio-headphones' &&
      (subCategorySlug.includes('earbuds-in-ear') ||
        subCategorySlug.includes('over-ear-headphones') ||
        subCategorySlug.includes('headphones') ||
        subCategorySlug.includes('earbuds'))
    );
  },
};

// Global helper: does a product belong to a given category slug?
export const matchesCategorySlug = (product, targetSlugRaw) => {
  const targetSlug = slugify(targetSlugRaw || '');
  const categorySlug = slugify(product.category);
  const subCategorySlug = slugify(product.subCategory);

  // Direct matches on category or subcategory
  if (categorySlug === targetSlug || subCategorySlug === targetSlug) {
    return true;
  }

  const matcher = CATEGORY_ALIAS_MATCHERS[targetSlug];
  if (matcher) {
    return matcher(categorySlug, subCategorySlug);
  }

  return false;
};

