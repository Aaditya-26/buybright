/**
 * BuyBright Master Shop Page View.
 * Fully responsive, modern, type-safe e-commerce catalog page.
 * Includes URL query sync, faceted filtering (categories, brands, size, milliliters, availability),
 * multi-sort, top live search bar, pagination, grid/list views, and interactive product actions.
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

interface ShopPageProps {
  initialSearchQuery?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialSearchQuery = '' }) => {
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
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(18);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [targetFilterSection, setTargetFilterSection] = useState<string | undefined>(undefined);

  // Scroll to top and set page title on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Dental Shop & Supplies | BuyBright';
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
    const urlFilter = searchParams.get('filter');
    const urlSort = searchParams.get('sort') as SortOption | null;
    const urlSize = searchParams.get('size');
    const urlVolume = searchParams.get('volume');
    const urlStock = searchParams.get('stock') as AvailabilityOption | null;

    if (urlCategory) {
      setSelectedCategories([urlCategory]);
    }
    if (urlBrand) {
      setSelectedBrands([urlBrand]);
    }
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
    if (urlSize) {
      setSelectedSize(urlSize);
    }
    if (urlVolume) {
      setSelectedVolume(urlVolume);
    }
    if (urlStock) {
      setAvailability(urlStock);
    }
    if (urlFilter === 'bestsellers') {
      setOnlyBestsellers(true);
    } else if (urlFilter === 'offers') {
      setMinDiscount(15);
    }
    if (urlSort) {
      setSortBy(urlSort);
    }
  }, [searchParams]);

  // Fetch Categories & Combined Product Catalog
  useEffect(() => {
    const loadCatalogData = async () => {
      setIsLoading(true);
      try {
        const [cats, featured, superendo] = await Promise.all([
          dentalService.getCategories(),
          dentalService.getFeaturedProducts(),
          dentalService.getSuperendoProducts(),
        ]);

        setCategories(cats);

        // Deduplicate & combine standard catalog and Superendo items
        const combinedMap = new Map<string, Product>();
        [...featured, ...superendo].forEach((p) => {
          combinedMap.set(p.id, p);
        });

        setAllProducts(Array.from(combinedMap.values()));
      } catch (err) {
        console.error('Failed to load shop catalog data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCatalogData();
  }, []);

  // Toggle Category in Sidebar
  const handleToggleCategory = (slug: string) => {
    setSelectedCategories((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      return next;
    });
    setCurrentPage(1);
  };

  // Toggle Brand in Sidebar
  const handleToggleBrand = (brand: string) => {
    setSelectedBrands((prev) => {
      const next = prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand];
      return next;
    });
    setCurrentPage(1);
  };

  // Handle Size Selection
  const handleChangeSize = (size: string) => {
    setSelectedSize(size);
    setCurrentPage(1);
  };

  // Handle Milliliters (Volume) Selection
  const handleChangeVolume = (volume: string) => {
    setSelectedVolume(volume);
    setCurrentPage(1);
  };

  // Handle Availability Selection
  const handleChangeAvailability = (avail: AvailabilityOption) => {
    setAvailability(avail);
    setCurrentPage(1);
  };

  // Reset all filters to default
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

  // Parse discount string to numeric value (e.g. "-15%" -> 15, "53.89% Off" -> 53.89)
  const parseDiscountValue = (discountStr?: string): number => {
    if (!discountStr) return 0;
    const match = discountStr.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Filter Products Multi-Criteria Pipeline
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
        const prodBrand = (product.brand || '').toLowerCase().trim();
        const prodName = (product.name || '').toLowerCase().trim();
        const matchesBrand = selectedBrands.some((b) => {
          const bClean = b.toLowerCase().trim();
          if (!bClean) return true;
          if (prodBrand === bClean || prodBrand.includes(bClean) || bClean.includes(prodBrand)) {
            return true;
          }
          if (prodName.includes(bClean)) {
            return true;
          }
          // Special brand aliases & ID prefixes
          if (bClean.includes('superendo') && (product.id.startsWith('se-') || prodBrand.includes('superendo') || prodName.includes('superendo'))) return true;
          if (bClean.includes('3m') && (prodBrand.includes('3m') || prodName.includes('3m'))) return true;
          if (bClean.includes('dentsply') && (prodBrand.includes('dentsply') || prodName.includes('dentsply'))) return true;
          if (bClean.includes('gc') && (prodBrand.includes('gc') || prodName.includes('gc') || prodName.includes('fuji'))) return true;
          if (bClean.includes('mani') && (prodBrand.includes('mani') || prodName.includes('mani'))) return true;
          if (bClean.includes('shofu') && (prodBrand.includes('shofu') || prodName.includes('shofu'))) return true;
          if (bClean.includes('vdw') && (prodBrand.includes('vdw') || prodName.includes('vdw') || prodName.includes('reciproc'))) return true;
          if (bClean.includes('hu-friedy') && (prodBrand.includes('hu-friedy') || prodBrand.includes('friedy') || prodName.includes('friedy'))) return true;
          if (bClean.includes('septodont') && (prodBrand.includes('septodont') || prodName.includes('septodont') || prodName.includes('biodentine'))) return true;
          if (bClean.includes('prestocare') && (prodBrand.includes('prestocare') || prodName.includes('prestocare'))) return true;
          if (bClean.includes('coltene') && (prodBrand.includes('coltene') || prodName.includes('coltene') || prodName.includes('hyflex'))) return true;
          if (bClean.includes('woodpecker') && (prodBrand.includes('woodpecker') || prodName.includes('woodpecker'))) return true;
          if (bClean.includes('waldent') && (prodBrand.includes('waldent') || prodName.includes('waldent'))) return true;
          if (bClean.includes('ivoclar') && (prodBrand.includes('ivoclar') || prodName.includes('ivoclar') || prodName.includes('tetric'))) return true;
          if (bClean.includes('kerr') && (prodBrand.includes('kerr') || prodName.includes('kerr') || prodName.includes('optibond'))) return true;
          if (bClean.includes('ultradent') && (prodBrand.includes('ultradent') || prodName.includes('ultradent') || prodName.includes('opalescence'))) return true;
          if (bClean.includes('medicept') && (prodBrand.includes('medicept') || prodName.includes('medicept'))) return true;

          return false;
        });
        if (!matchesBrand) return false;
      }

      // 3. Size Filter
      if (selectedSize && selectedSize !== 'All Sizes') {
        const targetSize = selectedSize.toLowerCase().replace(/[^a-z0-9]/g, '');
        const prodSize = (product.size || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const prodName = (product.name || '').toLowerCase();

        const matchesExplicitSize = prodSize && prodSize.includes(targetSize);
        const matchesNameSize = prodName.includes(selectedSize.toLowerCase().replace(/[^a-z0-9]/g, '')) ||
          (selectedSize.includes('21') && prodName.includes('21mm')) ||
          (selectedSize.includes('25') && prodName.includes('25mm')) ||
          (selectedSize.includes('31') && prodName.includes('31mm')) ||
          (selectedSize.includes('Assorted') && prodName.includes('assorted')) ||
          (selectedSize.includes('Taper') && prodName.includes('taper')) ||
          (selectedSize.includes('Universal') && (prodName.includes('universal') || !product.size));

        if (!matchesExplicitSize && !matchesNameSize) return false;
      }

      // 4. Milliliters (Volume) Filter
      if (selectedVolume && selectedVolume !== 'All Volumes') {
        const cleanTargetVol = selectedVolume.toLowerCase().replace(/[^0-9]/g, '');
        const prodVol = (product.volume_ml || '').toLowerCase().replace(/[^0-9]/g, '');
        const prodName = (product.name || '').toLowerCase();

        const matchesExplicitVol = prodVol && prodVol === cleanTargetVol;
        const matchesNameVol = prodName.includes(`${cleanTargetVol}ml`) ||
          prodName.includes(`${cleanTargetVol} ml`) ||
          (cleanTargetVol === '1000' && (prodName.includes('1l') || prodName.includes('1 liter')));

        if (!matchesExplicitVol && !matchesNameVol) return false;
      }

      // 5. Availability (In Stock / Out of Stock)
      if (availability === 'in_stock') {
        if (product.in_stock === false) return false;
      } else if (availability === 'out_of_stock') {
        if (product.in_stock !== false) return false;
      }

      // 6. Price Range Filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // 7. Rating Filter
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      // 8. Discount Filter
      if (minDiscount > 0) {
        const discVal = parseDiscountValue(product.discount);
        if (discVal < minDiscount) return false;
      }

      // 9. Bestsellers Filter
      if (onlyBestsellers && !product.is_bestseller) {
        return false;
      }

      // 10. Search Query Filter (Live Search on Top & URL)
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (product.name || '').toLowerCase().includes(q);
        const matchesBrand = (product.brand || '').toLowerCase().includes(q);
        const matchesCategory = (product.category || '').toLowerCase().includes(q);
        const matchesSize = (product.size || '').toLowerCase().includes(q);
        const matchesVol = (product.volume_ml || '').toLowerCase().includes(q);

        if (!matchesName && !matchesBrand && !matchesCategory && !matchesSize && !matchesVol) {
          return false;
        }
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
    onlyBestsellers,
    searchQuery,
  ]);

  // Sort Filtered Products
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
        return list.sort((a, b) => {
          if (a.is_bestseller && !b.is_bestseller) return -1;
          if (!a.is_bestseller && b.is_bestseller) return 1;
          return b.rating - a.rating;
        });
    }
  }, [filteredProducts, sortBy]);

  // Pagination Calculations
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = useMemo(() => {
    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, startIndex, endIndex]);

  // Active filter count for badges
  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    (selectedSize !== 'All Sizes' ? 1 : 0) +
    (selectedVolume !== 'All Volumes' ? 1 : 0) +
    (availability !== 'all' ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 100000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0) +
    (onlyBestsellers ? 1 : 0) +
    (searchQuery.trim().length > 0 ? 1 : 0);

  return (
    <div className="shop-page-wrapper">
      <SEO
        title="Dental Shop & Dental Supplies"
        description="Browse authentic dental supplies, endodontic rotary files, restorative composites, instruments, and equipment with tier pricing and GST invoicing."
        canonicalUrl="https://buybright.com/shop"
        keywords="dental supplies, buy dental materials online, rotary files, dental equipment, dental instruments india"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Dental Shop & Dental Supplies",
          "url": "https://buybright.com/shop",
          "description": "BuyBright Catalog of authentic dental supplies and equipment.",
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
                "name": "Shop",
                "item": "https://buybright.com/shop"
              }
            ]
          }
        }}
      />

      {/* 1. Header Banner */}
      <ShopHeaderBanner totalProductsCount={allProducts.length} />

      {/* 2. Main Shop Catalog Section (Full Width with Top Filter Controls) */}
      <div className="shop-main-layout-container full-width-catalog">
        <div className="shop-content-column">
          {/* Top Quick Filter Buttons Bar (Brands, Price Range, Availability, Discount, Rating, Categories + Live Search) */}
          <ShopTopFilterBar
            onOpenDrawer={handleOpenFilterDrawer}
            activeFilterCount={activeFilterCount}
            selectedBrandsCount={selectedBrands.length}
            isPriceFiltered={priceRange[0] > 0 || priceRange[1] < 100000}
            priceRange={priceRange}
            onChangePriceRange={(range) => { setPriceRange(range); setCurrentPage(1); }}
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

          {/* Active Filter Badges Strip */}
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

          {/* Top Controls Toolbar with Integrated Live Product Search */}
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

export default ShopPage;

