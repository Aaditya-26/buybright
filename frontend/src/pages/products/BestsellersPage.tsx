/**
 * BuyBright Top Dental Bestsellers Page.
 * Responsive, type-safe e-commerce catalog matching the master Shop Page design.
 * Includes:
 * - Dynamic Shop Header Banner with Hall of Fame credentials
 * - Top 3 Podium "National Dental Favorites" spotlight showcase
 * - Sticky Desktop Filter Sidebar & Mobile Drawer
 * - Active filter badges strip & live search toolbar
 * - Multi-criteria sorting & Grid/List view toggle
 * - Paginated Product Grid with reusable ProductCard
 * - Full SEO and structured JSON-LD schema
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Category, Product, SortOption, ViewMode, AvailabilityOption } from '../../types';
import { dentalService } from '../../services/dentalService';
import { ShopHeaderBanner } from '../../components/shop/ShopHeaderBanner';
import { ShopTopFilterBar } from '../../components/shop/ShopTopFilterBar';
import { ShopMobileFilterDrawer } from '../../components/shop/ShopMobileFilterDrawer';
import { ShopActiveFilters } from '../../components/shop/ShopActiveFilters';
import { ShopToolbar } from '../../components/shop/ShopToolbar';
import { ShopProductGrid } from '../../components/shop/ShopProductGrid';
import { ShopPagination } from '../../components/shop/ShopPagination';
import { SEO } from '../../components/common/SEO';

export const BestsellersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Master Data State
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter & Layout States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('All Sizes');
  const [selectedVolume, setSelectedVolume] = useState<string>('All Volumes');
  const [availability, setAvailability] = useState<AvailabilityOption>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [onlyBestsellers, setOnlyBestsellers] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(18);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [targetFilterSection, setTargetFilterSection] = useState<string | undefined>(undefined);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Top Marketplace Bestsellers & Customer Favorites | BuyBright';
  }, []);

  // Open Drawer with optional jump to specific section
  const handleOpenFilterDrawer = (sectionId?: string) => {
    setTargetFilterSection(sectionId);
    setIsFilterDrawerOpen(true);
  };

  // Sync initial URL search params
  useEffect(() => {
    const urlCategory = searchParams.get('category');
    const urlBrand = searchParams.get('brand');
    const urlSearch = searchParams.get('search') || searchParams.get('q');
    const urlSort = searchParams.get('sort') as SortOption | null;

    if (urlCategory) {
      setSelectedCategories([urlCategory]);
    }
    if (urlBrand) {
      setSelectedBrands([urlBrand]);
    }
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
    if (urlSort) {
      setSortBy(urlSort);
    }
  }, [searchParams]);

  // Load products & categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [cats, featured, superendo] = await Promise.all([
          dentalService.getCategories(),
          dentalService.getFeaturedProducts(),
          dentalService.getSuperendoProducts(),
        ]);

        setCategories(cats);

        // Deduplicate & combine products
        const combined = [...superendo, ...featured];
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());

        // Prioritize products marked as bestseller or high rated
        const bestsellers = unique.filter(
          (p) => p.is_bestseller || (p.rating >= 4.7 && p.reviews_count >= 50)
        );

        if (bestsellers.length < 8) {
          const sortedAll = [...unique].sort(
            (a, b) => b.rating * b.reviews_count - a.rating * a.reviews_count
          );
          setAllProducts(sortedAll);
        } else {
          setAllProducts(bestsellers);
        }
      } catch (err) {
        console.error('Error fetching bestsellers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Handlers
  const handleToggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
    setCurrentPage(1);
  };

  const handleToggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const handleChangeSize = (size: string) => {
    setSelectedSize(size);
    setCurrentPage(1);
  };

  const handleChangeVolume = (volume: string) => {
    setSelectedVolume(volume);
    setCurrentPage(1);
  };

  const handleChangeAvailability = (avail: AvailabilityOption) => {
    setAvailability(avail);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedSize('All Sizes');
    setSelectedVolume('All Volumes');
    setAvailability('all');
    setPriceRange([0, 100000]);
    setMinRating(0);
    setMinDiscount(0);
    setOnlyBestsellers(false);
    setSearchQuery('');
    setSortBy('featured');
    setCurrentPage(1);
    setSearchParams({});
  };

  const parseDiscountValue = (discountStr?: string): number => {
    if (!discountStr) return 0;
    const match = discountStr.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Filter Pipeline
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // 1. Category Filter
      if (selectedCategories.length > 0) {
        const prodCat = (product.category || '').toLowerCase();
        const matchesCat = selectedCategories.some(
          (cat) => cat.toLowerCase() === prodCat || prodCat.includes(cat.toLowerCase())
        );
        if (!matchesCat) return false;
      }

      // 2. Brand Filter
      if (selectedBrands.length > 0) {
        const prodBrand = (product.brand || '').toLowerCase();
        const matchesBrand = selectedBrands.some(
          (b) => b.toLowerCase() === prodBrand || prodBrand.includes(b.toLowerCase())
        );
        if (!matchesBrand) return false;
      }

      // 3. Size Filter
      if (selectedSize && selectedSize !== 'All Sizes') {
        const targetSize = selectedSize.toLowerCase().replace(/[^a-z0-9]/g, '');
        const prodSize = (product.size || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const prodName = (product.name || '').toLowerCase();
        const matchesExplicit = prodSize && prodSize.includes(targetSize);
        const matchesName = prodName.includes(targetSize);
        if (!matchesExplicit && !matchesName) return false;
      }

      // 4. Volume Filter
      if (selectedVolume && selectedVolume !== 'All Volumes') {
        const cleanTargetVol = selectedVolume.toLowerCase().replace(/[^0-9]/g, '');
        const prodVol = (product.volume_ml || '').toLowerCase().replace(/[^0-9]/g, '');
        const prodName = (product.name || '').toLowerCase();
        const matchesExplicitVol = prodVol && prodVol === cleanTargetVol;
        const matchesNameVol = prodName.includes(`${cleanTargetVol}ml`);
        if (!matchesExplicitVol && !matchesNameVol) return false;
      }

      // 5. Availability
      if (availability === 'in_stock' && product.in_stock === false) return false;
      if (availability === 'out_of_stock' && product.in_stock !== false) return false;

      // 6. Price Range
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;

      // 7. Rating
      if (minRating > 0 && product.rating < minRating) return false;

      // 8. Discount
      if (minDiscount > 0) {
        const discVal = parseDiscountValue(product.discount);
        if (discVal < minDiscount) return false;
      }

      // 9. Search Query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (product.name || '').toLowerCase().includes(q);
        const matchesBrand = (product.brand || '').toLowerCase().includes(q);
        const matchesCategory = (product.category || '').toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCategory) return false;
      }

      return true;
    });
  }, [
    allProducts,
    selectedCategories,
    selectedBrands,
    selectedSize,
    selectedVolume,
    availability,
    priceRange,
    minRating,
    minDiscount,
    searchQuery,
  ]);

  // Sort Pipeline
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];

    switch (sortBy) {
      case 'price_asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating_desc':
        return list.sort((a, b) => b.rating - a.rating || b.reviews_count - a.reviews_count);
      case 'discount_desc':
        return list.sort(
          (a, b) => parseDiscountValue(b.discount) - parseDiscountValue(a.discount)
        );
      case 'newest':
        return list.reverse();
      case 'featured':
      default:
        return list.sort((a, b) => b.reviews_count * b.rating - a.reviews_count * a.rating);
    }
  }, [filteredProducts, sortBy]);

  // Pagination Calculations
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = useMemo(() => {
    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, startIndex, endIndex]);

  // Active filter count
  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    (selectedSize !== 'All Sizes' ? 1 : 0) +
    (selectedVolume !== 'All Volumes' ? 1 : 0) +
    (availability !== 'all' ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 100000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0) +
    (searchQuery.trim().length > 0 ? 1 : 0);

  return (
    <div className="shop-page-wrapper">
      <SEO
        title="Top Marketplace Bestsellers & Customer Favorites"
        description="Discover India's top-ordered electronics, apparel, home appliances, beauty products, and books rated 4.5+ by thousands of shoppers."
        canonicalUrl="https://buybright.com/bestsellers"
        keywords="bestselling products, marketplace bestsellers, top electronics, top fashion, bestselling books"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Top Marketplace Bestsellers & Customer Favorites",
          "url": "https://buybright.com/bestsellers",
          "description": "BuyBright Bestsellers featuring top customer-rated electronics, fashion, and home essentials.",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://buybright.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Bestsellers",
                "item": "https://buybright.com/bestsellers"
              }
            ]
          }
        }}
      />

      {/* 1. Header Banner matching Shop Page */}
      <ShopHeaderBanner
        totalProductsCount={allProducts.length}
        breadcrumbLabel="Bestsellers"
        badgeText="BUYBRIGHT HALL OF FAME"
        badgeIcon="fa-solid fa-crown"
        title="Top Marketplace "
        highlightText="Bestsellers & Customer Favorites"
        description="Explore India's most popular consumer electronics, smart fashion, home essentials, and bestselling books chosen by thousands of verified marketplace shoppers."
        metrics={[
          {
            icon: 'fa-solid fa-trophy',
            iconColorClass: 'text-coral',
            title: 'Top 1% Ranked',
            subtitle: ' Verified',
          },
          {
            icon: 'fa-solid fa-truck-fast',
            iconColorClass: 'text-teal',
            title: '24-48h Dispatch',
            subtitle: 'Pan-India Priority',
          },
        ]}
      />

      {/* 2. Main Shop Catalog Layout (Full Width with Top Filter Controls) */}
      <div className="shop-main-layout-container full-width-catalog">
        <div className="shop-content-column">
          {/* Top Quick Filter Buttons Bar (Brands, Price Range, Availability, Discount, Rating, Categories + Live Search) */}
          <ShopTopFilterBar
            onOpenDrawer={handleOpenFilterDrawer}
            activeFilterCount={activeFilterCount}
            selectedBrandsCount={selectedBrands.length}
            isPriceFiltered={priceRange[0] > 0 || priceRange[1] < 100000}
            priceRange={priceRange}
            onChangePriceRange={(range) => {
              setPriceRange(range);
              setCurrentPage(1);
            }}
            isAvailabilityFiltered={availability !== 'all'}
            isDiscountFiltered={minDiscount > 0}
            isRatingFiltered={minRating > 0}
            selectedCategoriesCount={selectedCategories.length}
            onlyBestsellers={onlyBestsellers}
            searchQuery={searchQuery}
            onChangeSearchQuery={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
            onResetFilters={handleResetFilters}
          />

          {/* Active Filter Badges */}
          <ShopActiveFilters
            categories={categories}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            selectedSize={selectedSize}
            selectedVolume={selectedVolume}
            availability={availability}
            priceRange={priceRange}
            minRating={minRating}
            minDiscount={minDiscount}
            onlyBestsellers={onlyBestsellers}
            searchQuery={searchQuery}
            onRemoveCategory={handleToggleCategory}
            onRemoveBrand={handleToggleBrand}
            onResetSize={() => setSelectedSize('All Sizes')}
            onResetVolume={() => setSelectedVolume('All Volumes')}
            onResetAvailability={() => setAvailability('all')}
            onResetPrice={() => setPriceRange([0, 100000])}
            onResetRating={() => setMinRating(0)}
            onResetDiscount={() => setMinDiscount(0)}
            onToggleBestsellers={() => setOnlyBestsellers(false)}
            onClearSearch={() => setSearchQuery('')}
            onClearAll={handleResetFilters}
          />

          {/* Top Controls Toolbar */}
          <ShopToolbar
            totalCount={sortedProducts.length}
            startIndex={startIndex}
            endIndex={endIndex}
            sortBy={sortBy}
            onChangeSortBy={setSortBy}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            itemsPerPage={itemsPerPage}
            onChangeItemsPerPage={(num) => {
              setItemsPerPage(num);
              setCurrentPage(1);
            }}
            onOpenMobileFilters={() => handleOpenFilterDrawer()}
            activeFilterCount={activeFilterCount}
            searchQuery={searchQuery}
            onChangeSearchQuery={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
          />

          {/* Product Grid (6 cards per row on desktop) / List */}
          <ShopProductGrid
            products={paginatedProducts}
            isLoading={isLoading}
            viewMode={viewMode}
            onResetFilters={handleResetFilters}
          />

          {/* Pagination Navigation */}
          <ShopPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* 3. Universal Left Slide-in Filter Drawer */}
      <ShopMobileFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        categories={categories}
        selectedCategories={selectedCategories}
        selectedBrands={selectedBrands}
        selectedSize={selectedSize}
        selectedVolume={selectedVolume}
        availability={availability}
        priceRange={priceRange}
        minRating={minRating}
        minDiscount={minDiscount}
        onlyBestsellers={onlyBestsellers}
        onToggleCategory={handleToggleCategory}
        onToggleBrand={handleToggleBrand}
        onChangeSize={handleChangeSize}
        onChangeVolume={handleChangeVolume}
        onChangeAvailability={handleChangeAvailability}
        onChangePriceRange={setPriceRange}
        onChangeMinRating={setMinRating}
        onChangeMinDiscount={setMinDiscount}
        onToggleBestsellers={() => setOnlyBestsellers(!onlyBestsellers)}
        onResetFilters={handleResetFilters}
        totalFilteredCount={sortedProducts.length}
        targetSectionId={targetFilterSection}
      />
    </div>
  );
};

export default BestsellersPage;
