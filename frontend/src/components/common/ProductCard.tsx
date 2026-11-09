/**
 * BuyBright Reusable Product Card Component.
 * Features:
 * - Top-left tags: Sale (Discount) and Bestseller
 * - Top-right action tools: Wishlist, Compare, Search Preview
 * - Bottom-Right of Image: Floating distinct "ADD" badge button displaying stock quantity (e.g. "2 Left", "5 Left")
 *   -> Clicking it opens the ProductVariantDrawer (Rubber Dam Sheet variants, bulk tiers, Request This Product)
 * - Full-width bottom "Add to Cart" procurement button intact as requested
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product, ViewMode } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useToast } from '../../context/ToastContext';
import { Rating } from './Rating';
import { Badge } from './Badge';
import { QuickViewModal } from './QuickViewModal';
import { ProductVariantDrawer } from './ProductVariantDrawer';
import { SimilarProductsModal } from './SimilarProductsModal';
import { getProductExpiryDate } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  brandColor?: string;
  viewMode?: ViewMode;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, brandColor, viewMode = 'grid' }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();
  const { showToast } = useToast();
  const isWishlisted = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isVariantDrawerOpen, setIsVariantDrawerOpen] = useState(false);
  const [isSimilarModalOpen, setIsSimilarModalOpen] = useState(false);

  // Stock & Options count for marketplace product variants (e.g. 2 options, 3 options, 4 options)
  const numId = parseInt(String(product.id).replace(/\D/g, ''), 10) || 3;
  const optionsCount = (numId % 3 === 0) ? 2 : (numId % 2 === 0) ? 3 : 4;
  const stockCount = (numId % 4 === 0) ? 2 : (numId % 3 === 0) ? 5 : 8;

  // Bright Points Loyalty Rewards (e.g. 10, 20, 30, 50 points based on product value)
  const brightPoints = product.price >= 2500 ? 50 : product.price >= 1500 ? 30 : product.price >= 700 ? 20 : 10;

  // Distinct realistic delivery speeds based on product characteristics
  const getDeliveryEstimate = () => {
    const rawId = String(product.id || '');
    let charSum = 0;
    for (let i = 0; i < rawId.length; i++) {
      charSum += rawId.charCodeAt(i);
    }
    const variant = (charSum + (product.name ? product.name.length : 0)) % 5;

    switch (variant) {
      case 0:
        return {
          icon: 'fa-solid fa-bolt-lightning',
          colorClass: 'badge-delivery-express',
          label: 'Delivery:',
          time: 'Tomorrow, 11 AM',
          tag: 'Express Priority',
        };
      case 1:
        return {
          icon: 'fa-solid fa-truck-fast',
          colorClass: 'badge-delivery-overnight',
          label: 'Delivery:',
          time: 'Tomorrow, 4 PM',
          tag: 'Guaranteed Overnight',
        };
      case 2:
        return {
          icon: 'fa-solid fa-clock-rotate-left',
          colorClass: 'badge-delivery-sameday',
          label: 'Dispatch:',
          time: 'Today in 4 hrs',
          tag: 'Fast Track Dispatch',
        };
      case 3:
        return {
          icon: 'fa-solid fa-truck-fast',
          colorClass: 'badge-delivery-air',
          label: 'Delivery:',
          time: 'In 2 Days, 2 PM',
          tag: 'Tier-1 Air Corridor',
        };
      case 4:
      default:
        return {
          icon: 'fa-solid fa-box-open',
          colorClass: 'badge-delivery-standard',
          label: 'Delivery:',
          time: 'In 2-3 Days',
          tag: 'Standard Care',
        };
    }
  };

  const deliveryEst = getDeliveryEstimate();
  const expiryDate = getProductExpiryDate(product);

  // Discount text calculation
  const discountText =
    product.discount ||
    (product.old_price
      ? `${Math.round(((product.old_price - product.price) / product.old_price) * 100)}% Off`
      : '20% Off');

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCompare(product);
  };

  const handleOpenPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPreviewOpen(true);
  };

  const handleOpenVariantDrawer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVariantDrawerOpen(true);
  };

  const handleOpenSimilarModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSimilarModalOpen(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    showToast(`✓ Added "${product.name.slice(0, 22)}..." to Cart!`, 'success');
  };

  return (
    <>
      <div className={`product-card ${viewMode === 'list' ? 'is-list-card' : ''}`}>
        {/* Product Media & Image Badges */}
        <div className="product-media">
          {/* Top-Left Sale & Bestseller Badges */}
          {discountText && <Badge variant="sale">{discountText}</Badge>}
          {product.is_bestseller && <Badge variant="bestseller">Bestseller</Badge>}

          {/* Floating Hover Action Tool Stack (Top-Right) */}
          <div className="product-card-actions-stack">
            {/* 1. Wishlist Button */}
            <button
              type="button"
              className={`card-action-circle-btn ${isWishlisted ? 'active-wishlist' : ''}`}
              onClick={handleWishlist}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              aria-label="Wishlist toggle"
            >
              <i className={isWishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} />
            </button>

            {/* 2. Add to Compare Button */}
            <button
              type="button"
              className={`card-action-circle-btn ${isCompared ? 'active-compare' : ''}`}
              onClick={handleCompare}
              title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
              aria-label="Add to compare"
            >
              <i className="fa-solid fa-code-compare" />
            </button>

            {/* 3. Search / Preview Button */}
            <button
              type="button"
              className="card-action-circle-btn preview-search-btn"
              onClick={handleOpenPreview}
              title="Quick Preview Details"
              aria-label={`Preview ${product.name}`}
            >
              <i className="fa-solid fa-magnifying-glass-plus" />
            </button>
          </div>

          <Link to={`/shop/${product.id}`} className="product-card-img-link" title={`View details for ${product.name}`}>
            <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
          </Link>

          {/* Distinct Floating ADD Badge with Options & Stock Count on Bottom-Right of Image */}
          <div
            className="floating-image-add-badge"
            onClick={handleOpenVariantDrawer}
            title={`View ${optionsCount} options / variants (${stockCount} in stock)`}
          >
            <span className="floating-stock-tag">
              <i className="fa-solid fa-layer-group" />
              {optionsCount} Options
            </span>
            <button
              type="button"
              className="btn-floating-add"
              onClick={handleOpenVariantDrawer}
              aria-label={`View ${optionsCount} options for ${product.name}`}
            >
              <span>ADD</span>
              <i className="fa-solid fa-plus" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="product-info-primary">
            <div className="product-brand" style={brandColor ? { color: brandColor } : undefined}>
              {product.brand}
            </div>

            {/* Star Rating */}
            <Rating rating={product.rating} reviewsCount={product.reviews_count} />

            {/* Product Title Linked to Detail */}
            <h3 className="product-name" title={product.name}>
              <Link to={`/shop/${product.id}`} className="product-title-link">
                {product.name}
              </Link>
            </h3>

            {/* Delivery Speed Badge */}
            <div
              className={`product-delivery-badge ${deliveryEst.colorClass}`}
              title={`Guaranteed Express Dispatch & Delivery (${deliveryEst.tag})`}
            >
              <i className={deliveryEst.icon} />
              <span>
                {deliveryEst.label} <strong>{deliveryEst.time}</strong>
              </span>
            </div>

            {/* Batch & Warranty Expiry Date Badge */}
            <div
              className="product-expiry-badge"
              title={`Verified Genuine Batch • Expiry/Warranty: ${expiryDate}`}
            >
              <span className="expiry-icon-wrap">
                <i className="fa-regular fa-calendar-check" />
              </span>
              <span className="expiry-label">Exp:</span>
              <strong className="expiry-val">{expiryDate}</strong>
            </div>

            {/* Bright Points Loyalty Rewards Badge */}
            <div
              className="product-bright-points-badge product-presto-points-badge"
              title={`Earn ${brightPoints} Bright Points on this purchase`}
            >
              <span className="bright-points-coin-wrap presto-points-coin-wrap">
                <i className="fa-solid fa-coins" />
              </span>
              <span className="bright-points-text presto-points-text">Bright Points:</span>
              <span className="bright-points-val presto-points-val">{brightPoints}</span>
            </div>
          </div>

          <div className="product-info-actions">
            {/* Price Row */}
            <div className="product-price-row">
              <span className="product-price">INR {product.price.toLocaleString('en-IN')}</span>
              {product.old_price && (
                <span className="product-price-old">
                  INR {product.old_price.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Standard Add To Cart CTA Button */}
            <button
              type="button"
              className="btn-add-cart"
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
            >
              <i className="fa-solid fa-cart-shopping" />
              <span>Add to Cart</span>
            </button>

            {/* Dynamic Blinking "View Similar" Button */}
            <button
              type="button"
              className="btn-view-similar-blinking"
              onClick={handleOpenSimilarModal}
              title={`View similar & alternative marketplace products for ${product.name}`}
              aria-label={`View similar products for ${product.name}`}
            >
              <span className="live-blink-orb" />
              <i className="fa-solid fa-wand-magic-sparkles blink-icon-sparkle" />
              <span>View Similar</span>
            </button>
          </div>
        </div>
      </div>


      {/* Quick Search Preview Modal */}
      <QuickViewModal
        product={product}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

      {/* Product Variant & Bulk Pricing Slide-Over Drawer */}
      <ProductVariantDrawer
        product={product}
        isOpen={isVariantDrawerOpen}
        onClose={() => setIsVariantDrawerOpen(false)}
      />

      {/* Similar & Alternative Products Modal */}
      <SimilarProductsModal
        product={product}
        isOpen={isSimilarModalOpen}
        onClose={() => setIsSimilarModalOpen(false)}
      />
    </>
  );
};
