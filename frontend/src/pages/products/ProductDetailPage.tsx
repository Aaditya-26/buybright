/**
 * BuyBright Modern Product Detail & Dental Procurement View.
 * Enterprise-grade, type-safe e-commerce product page featuring:
 * - Dynamic Multi-Angle Image Gallery with Zoom & Lightbox
 * - Brand Certification & Genuine Warranty Badges
 * - Interactive B2B Bulk Pricing Matrix & GST ITC Breakdown
 * - Size, Shade & Volume Variant Selection
 * - Live Pincode Delivery Transit Calculator
 * - Deep-Dive Tabs: Overview, Technical Specifications, Protocol (IFU), and Verified Doctor Reviews
 * - Reusable Related Products Carousel
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import { dentalService } from '../../services/dentalService';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { Rating } from '../../components/common/Rating';
import { Badge } from '../../components/common/Badge';
import { ProductCard } from '../../components/common/ProductCard';
import { SEO } from '../../components/common/SEO';

// Horizontal Dental Product Variant Model
export interface ProductVariantItem {
  id: string;
  sku: string;
  name: string;
  variantLabel: string;
  image: string;
  price: number;
  old_price: number;
  discount: string;
  brightPoints: number;
  deliveryTime: string;
  inStock: boolean;
  stockCount: number;
  tag?: string;
}

// Gallery Media Item Model (Multi-angle Images & Product Video)
export interface GalleryMediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  videoUrl?: string;
  title: string;
}

/**
 * Generate authentic consumer marketplace horizontal variants with stock, delivery, and Bright Points
 */
const getProductHorizontalVariants = (prod: Product): ProductVariantItem[] => {
  const cat = (prod.category || '').toLowerCase();
  const base = prod.price;
  const baseImg = prod.image;

  if (cat.includes('elect') || cat.includes('gadget') || cat.includes('tech') || cat.includes('phone') || cat.includes('audio')) {
    return [
      {
        id: `${prod.id}-128gb-blk`,
        sku: `BB-ELC-128-BLK-${prod.id.slice(0, 4).toUpperCase()}`,
        name: `${prod.name} (128 GB - Midnight Black)`,
        variantLabel: '128 GB • Midnight Black',
        image: baseImg,
        price: base,
        old_price: Math.round(base * 1.25),
        discount: '20% OFF',
        brightPoints: 50,
        deliveryTime: 'Delivered by Tomorrow, 2 PM',
        inStock: true,
        stockCount: 18,
        tag: 'Bestseller',
      },
      {
        id: `${prod.id}-256gb-slv`,
        sku: `BB-ELC-256-SLV-${prod.id.slice(0, 4).toUpperCase()}`,
        name: `${prod.name} (256 GB - Silver Aluminum)`,
        variantLabel: '256 GB • Silver Aluminum',
        image: baseImg,
        price: Math.round(base * 1.15),
        old_price: Math.round(base * 1.38),
        discount: '17% OFF',
        brightPoints: 75,
        deliveryTime: 'Delivered in 24-48 hrs',
        inStock: true,
        stockCount: 9,
        tag: 'Popular',
      },
      {
        id: `${prod.id}-512gb-gray`,
        sku: `BB-ELC-512-GRY-${prod.id.slice(0, 4).toUpperCase()}`,
        name: `${prod.name} (512 GB - Space Gray)`,
        variantLabel: '512 GB • Space Gray Pro',
        image: baseImg,
        price: Math.round(base * 1.35),
        old_price: Math.round(base * 1.65),
        discount: '18% OFF',
        brightPoints: 100,
        deliveryTime: 'Delivered in 24-48 hrs',
        inStock: true,
        stockCount: 4,
        tag: 'Pro Tier',
      },
      {
        id: `${prod.id}-1tb-gold`,
        sku: `BB-ELC-1TB-GLD-${prod.id.slice(0, 4).toUpperCase()}`,
        name: `${prod.name} (1 TB - Champagne Gold)`,
        variantLabel: '1 TB • Limited Edition Gold',
        image: baseImg,
        price: Math.round(base * 1.6),
        old_price: Math.round(base * 2.0),
        discount: '20% OFF',
        brightPoints: 150,
        deliveryTime: 'Special Order Dispatch',
        inStock: false,
        stockCount: 0,
        tag: 'Out of Stock',
      },
    ];
  }

  if (cat.includes('fash') || cat.includes('apparel') || cat.includes('cloth') || cat.includes('wear')) {
    return [
      {
        id: `${prod.id}-m-navy`,
        sku: `BB-FAS-M-NVY-${prod.id.slice(0, 4).toUpperCase()}`,
        name: `${prod.name} (Size M - Classic Navy)`,
        variantLabel: 'Size M • Classic Navy Blue',
        image: baseImg,
        price: base,
        old_price: Math.round(base * 1.3),
        discount: '23% OFF',
        brightPoints: 20,
        deliveryTime: 'Delivered in 24-48 hrs',
        inStock: true,
        stockCount: 25,
        tag: 'Most Popular',
      },
      {
        id: `${prod.id}-l-black`,
        sku: `BB-FAS-L-BLK-${prod.id.slice(0, 4).toUpperCase()}`,
        name: `${prod.name} (Size L - Onyx Black)`,
        variantLabel: 'Size L • Onyx Black',
        image: baseImg,
        price: base,
        old_price: Math.round(base * 1.3),
        discount: '23% OFF',
        brightPoints: 20,
        deliveryTime: 'Delivered by Tomorrow, 2 PM',
        inStock: true,
        stockCount: 14,
      },
      {
        id: `${prod.id}-xl-gray`,
        sku: `BB-FAS-XL-GRY-${prod.id.slice(0, 4).toUpperCase()}`,
        name: `${prod.name} (Size XL - Heather Gray)`,
        variantLabel: 'Size XL • Heather Gray',
        image: baseImg,
        price: Math.round(base * 1.05),
        old_price: Math.round(base * 1.35),
        discount: '22% OFF',
        brightPoints: 25,
        deliveryTime: 'Delivered in 24-48 hrs',
        inStock: true,
        stockCount: 6,
      },
      {
        id: `${prod.id}-combo-3pk`,
        sku: `BB-FAS-COMBO-3PK-${prod.id.slice(0, 4).toUpperCase()}`,
        name: `${prod.name} (Value Pack of 3 Assorted)`,
        variantLabel: 'Multi-Pack Bundle (Pack of 3)',
        image: baseImg,
        price: Math.round(base * 2.6),
        old_price: Math.round(base * 3.6),
        discount: '28% OFF',
        brightPoints: 60,
        deliveryTime: 'Delivered in 24-48 hrs',
        inStock: true,
        stockCount: 8,
        tag: 'Value Bundle',
      },
    ];
  }

  if (cat.includes('home') || cat.includes('kitchen') || cat.includes('cook') || cat.includes('appliance')) {
    return [
      {
        id: `${prod.id}-std-single`,
        sku: `BB-HMK-STD-1PC-${prod.id.slice(0, 4).toUpperCase()}`,
        name: `${prod.name} (Standard Unit)`,
        variantLabel: 'Standard Unit (1 Pc)',
        image: baseImg,
        price: base,
        old_price: Math.round(base * 1.2),
        discount: '17% OFF',
        brightPoints: 30,
        deliveryTime: 'Delivered by Tomorrow, 2 PM',
        inStock: true,
        stockCount: 16,
        tag: 'Standard',
      },
      {
        id: `${prod.id}-deluxe-set`,
        sku: `BB-HMK-DLX-SET-${prod.id.slice(0, 4).toUpperCase()}`,
        name: `${prod.name} (Deluxe Plus Set with Accessories)`,
        variantLabel: 'Deluxe Set (+ Complete Accessory Kit)',
        image: baseImg,
        price: Math.round(base * 1.35),
        old_price: Math.round(base * 1.7),
        discount: '21% OFF',
        brightPoints: 45,
        deliveryTime: 'Delivered in 24-48 hrs',
        inStock: true,
        stockCount: 7,
        tag: 'Deluxe Edition',
      },
      {
        id: `${prod.id}-family-2pk`,
        sku: `BB-HMK-FAM-2PK-${prod.id.slice(0, 4).toUpperCase()}`,
        name: `${prod.name} (Family Pack of 2)`,
        variantLabel: 'Family Duo Pack (Set of 2 Units)',
        image: baseImg,
        price: Math.round(base * 1.85),
        old_price: Math.round(base * 2.4),
        discount: '23% OFF',
        brightPoints: 60,
        deliveryTime: 'Delivered in 24-48 hrs',
        inStock: true,
        stockCount: 11,
        tag: 'Twin Pack',
      },
    ];
  }

  if (cat.includes('beauty') || cat.includes('care') || cat.includes('wellness') || cat.includes('cosmetic')) {
    return [
      {
        id: `${prod.id}-50ml-daily`,
        sku: `BB-BTY-50ML-${prod.id.slice(0, 4).toUpperCase()}`,
        name: `${prod.name} (50 ml Essential)`,
        variantLabel: '50 ml • Daily Essential Care',
        image: baseImg,
        price: base,
        old_price: Math.round(base * 1.25),
        discount: '20% OFF',
        brightPoints: 15,
        deliveryTime: 'Delivered by Tomorrow, 2 PM',
        inStock: true,
        stockCount: 30,
        tag: 'Best Seller',
      },
      {
        id: `${prod.id}-100ml-pump`,
        sku: `BB-BTY-100ML-${prod.id.slice(0, 4).toUpperCase()}`,
        name: `${prod.name} (100 ml Economy Pump)`,
        variantLabel: '100 ml • Value Dispenser Pump',
        image: baseImg,
        price: Math.round(base * 1.65),
        old_price: Math.round(base * 2.1),
        discount: '21% OFF',
        brightPoints: 30,
        deliveryTime: 'Delivered in 24-48 hrs',
        inStock: true,
        stockCount: 12,
        tag: 'Value Size',
      },
      {
        id: `${prod.id}-gift-trio`,
        sku: `BB-BTY-TRIO-${prod.id.slice(0, 4).toUpperCase()}`,
        name: `${prod.name} (Luxury Gift Set of 3)`,
        variantLabel: 'Gift Box Collection (3 Items)',
        image: baseImg,
        price: Math.round(base * 2.5),
        old_price: Math.round(base * 3.3),
        discount: '24% OFF',
        brightPoints: 50,
        deliveryTime: 'Delivered in 24-48 hrs',
        inStock: true,
        stockCount: 5,
        tag: 'Gift Pack',
      },
    ];
  }

  if (cat.includes('sport') || cat.includes('fit') || cat.includes('gym') || cat.includes('outdoor')) {
    return [
      {
        id: `${prod.id}-std-edition`,
        sku: `BB-SPT-STD-${prod.id.slice(0, 4).toUpperCase()}`,
        name: `${prod.name} (Standard Athletic Edition)`,
        variantLabel: 'Standard Athletic Edition',
        image: baseImg,
        price: base,
        old_price: Math.round(base * 1.25),
        discount: '20% OFF',
        brightPoints: 25,
        deliveryTime: 'Delivered in 24-48 hrs',
        inStock: true,
        stockCount: 20,
        tag: 'Top Rated',
      },
      {
        id: `${prod.id}-pro-heavy`,
        sku: `BB-SPT-PRO-${prod.id.slice(0, 4).toUpperCase()}`,
        name: `${prod.name} (Pro Heavy Duty Training)`,
        variantLabel: 'Pro Performance Heavy Duty',
        image: baseImg,
        price: Math.round(base * 1.3),
        old_price: Math.round(base * 1.65),
        discount: '21% OFF',
        brightPoints: 40,
        deliveryTime: 'Delivered by Tomorrow, 2 PM',
        inStock: true,
        stockCount: 9,
        tag: 'Pro Grade',
      },
    ];
  }

  // Default / Books & Stationery & General Marketplace
  return [
    {
      id: `${prod.id}-std-ed`,
      sku: `BB-BKS-STD-${prod.id.slice(0, 4).toUpperCase()}`,
      name: `${prod.name} (Standard Edition)`,
      variantLabel: 'Standard Paperback / Single Unit',
      image: baseImg,
      price: base,
      old_price: Math.round(base * 1.2),
      discount: '17% OFF',
      brightPoints: 15,
      deliveryTime: 'Delivered by Tomorrow, 2 PM',
      inStock: true,
      stockCount: 22,
      tag: 'Bestseller',
    },
    {
      id: `${prod.id}-hardcover`,
      sku: `BB-BKS-HC-${prod.id.slice(0, 4).toUpperCase()}`,
      name: `${prod.name} (Deluxe Hardcover / Premium Edition)`,
      variantLabel: 'Deluxe Hardcover / Collector Edition',
      image: baseImg,
      price: Math.round(base * 1.35),
      old_price: Math.round(base * 1.7),
      discount: '21% OFF',
      brightPoints: 30,
      deliveryTime: 'Delivered in 24-48 hrs',
      inStock: true,
      stockCount: 7,
      tag: 'Collector',
    },
    {
      id: `${prod.id}-bundle-box`,
      sku: `BB-BKS-BOX-${prod.id.slice(0, 4).toUpperCase()}`,
      name: `${prod.name} (Collector Box Set)`,
      variantLabel: 'Complete Collection Box Set',
      image: baseImg,
      price: Math.round(base * 2.2),
      old_price: Math.round(base * 2.9),
      discount: '24% OFF',
      brightPoints: 50,
      deliveryTime: 'Delivered in 24-48 hrs',
      inStock: true,
      stockCount: 4,
      tag: 'Complete Box Set',
    },
  ];
};

/**
 * Generate compliant PDF-1.4 binary blob for official SKU technical specification sheet
 */
const createSkuPdfBlob = (prod: Product, skuCode: string): Blob => {
  const sanitize = (text: string) =>
    (text || '')
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const streamContent = `q
0 0.502 0.502 rg
50 790 495 4 re f
Q
q
0.96 0.97 0.98 rg
50 710 495 65 re f
0.88 0.90 0.93 RG
1 w
50 710 495 65 re s
Q
BT
/F1 18 Tf
0 0.35 0.35 rg
50 805 Td
(BUYBRIGHT MULTI-SELLER MARKETPLACE) Tj
/F2 9 Tf
0.4 0.45 0.5 rg
330 805 Td
(OFFICIAL SKU SPECIFICATION) Tj
ET
BT
/F1 13 Tf
0.06 0.09 0.16 rg
65 755 Td
(SKU: ${sanitize(skuCode)}) Tj
/F2 9.5 Tf
0.3 0.35 0.4 rg
65 738 Td
(Catalog Ref: BB-CAT-${sanitize(prod.id.toUpperCase())}   |   Issued: ${sanitize(dateStr)}   |   Quality: ISO 9001 Certified) Tj
65 722 Td
(Status: Verified Marketplace Product   |   GST Compliant: Registered Merchant Invoice) Tj
ET
q
0 0.502 0.502 rg
50 675 495 24 re f
Q
BT
/F1 11 Tf
1 1 1 rg
60 683 Td
(1. PRODUCT SPECIFICATION & ATTRIBUTES) Tj
ET
BT
/F1 10 Tf
0.1 0.15 0.2 rg
55 645 Td
(Product Name:) Tj
/F2 10 Tf
170 645 Td
(${sanitize(prod.name.slice(0, 60))}) Tj
ET
BT
/F1 10 Tf
0.1 0.15 0.2 rg
55 625 Td
(Brand / Manufacturer:) Tj
/F2 10 Tf
170 625 Td
(${sanitize(prod.brand)} - Verified Marketplace Merchant) Tj
ET
BT
/F1 10 Tf
0.1 0.15 0.2 rg
55 605 Td
(Category:) Tj
/F2 10 Tf
170 605 Td
(${sanitize((prod.category || 'General').toUpperCase())}) Tj
ET
BT
/F1 10 Tf
0.1 0.15 0.2 rg
55 585 Td
(Listed Marketplace Price:) Tj
/F2 10 Tf
170 585 Td
(INR ${prod.price.toLocaleString('en-IN')}) Tj
ET
BT
/F1 10 Tf
0.1 0.15 0.2 rg
55 565 Td
(Quality Assurance:) Tj
/F2 10 Tf
170 565 Td
(ISO 9001:2015 Certified / 100% Genuine Direct Merchant Warranty) Tj
ET
BT
/F1 10 Tf
0.1 0.15 0.2 rg
55 545 Td
(Fulfillment Protocol:) Tj
/F2 10 Tf
170 545 Td
(Barcoded Warehouse Intake & Fast Track Express Delivery) Tj
ET
q
0 0.502 0.502 rg
50 505 495 24 re f
Q
BT
/F1 11 Tf
1 1 1 rg
60 513 Td
(2. QUALITY GUARANTEE & LOGISTICS ASSURANCE) Tj
ET
BT
/F2 9.5 Tf
0.2 0.25 0.3 rg
55 480 Td
(100% Genuine Guarantee: Sourced directly through verified brand partners & authorized sellers.) Tj
55 460 Td
(Tamper-Proof Packaging: Quality-checked and barcode-sealed at fulfillment centers.) Tj
55 440 Td
(Compliant Tax Invoice: Complete GST B2C/B2B invoice with registered HSN classification.) Tj
55 420 Td
(Logistics Hub: Pan-India Express Delivery via Automated Fulfillment Network.) Tj
ET
q
0.93 0.94 0.96 rg
50 335 495 60 re f
0.85 0.88 0.92 RG
1 w
50 335 495 60 re s
Q
BT
/F1 10 Tf
0.1 0.15 0.25 rg
65 375 Td
(BuyBright Merchant & Customer Support) Tj
/F2 9 Tf
0.3 0.35 0.4 rg
65 358 Td
(Customer Helpdesk: +91 98765 43210   |   Email: support@buybright.com) Tj
65 344 Td
(Platform: https://buybright.com   |   Fulfillment Hub: Automated Logistics Center) Tj
ET
q
0.8 0.85 0.9 RG
0.5 w
50 65 495 0 re s
Q
BT
/F2 8 Tf
0.5 0.55 0.6 rg
50 50 Td
(BuyBright Marketplace Platform | Document ID: SPEC-${sanitize(skuCode)} | Verified: ${sanitize(dateStr)}) Tj
50 38 Td
(Official product specification sheet generated by BuyBright Multi-Seller Marketplace.) Tj
ET`;

  const streamBytes = new TextEncoder().encode(streamContent);
  const streamLength = streamBytes.length;

  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  const obj3 =
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n';
  const obj4 = `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamContent}\nendstream\nendobj\n`;
  const obj5 =
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n';
  const obj6 =
    '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';

  const header = '%PDF-1.4\n';
  const offset1 = header.length;
  const offset2 = offset1 + obj1.length;
  const offset3 = offset2 + obj2.length;
  const offset4 = offset3 + obj3.length;
  const offset5 = offset4 + obj4.length;
  const offset6 = offset5 + obj5.length;
  const xrefOffset = offset6 + obj6.length;

  const pad = (n: number) => n.toString().padStart(10, '0');

  const xref = `xref
0 7
0000000000 65535 f 
${pad(offset1)} 00000 n 
${pad(offset2)} 00000 n 
${pad(offset3)} 00000 n 
${pad(offset4)} 00000 n 
${pad(offset5)} 00000 n 
${pad(offset6)} 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
${xrefOffset}
%%EOF`;

  const fullPdf = header + obj1 + obj2 + obj3 + obj4 + obj5 + obj6 + xref;
  return new Blob([fullPdf], { type: 'application/pdf' });
};

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Gallery & Interaction States
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'packaging' | 'guidelines' | 'reviews'>('description');
  const isWishlisted = product ? isInWishlist(product.id) : false;
  const [isCompared, setIsCompared] = useState<boolean>(false);

  // Direct Out-of-Stock Requested Variant IDs tracking
  const [requestedVariantIds, setRequestedVariantIds] = useState<Set<string>>(new Set());

  // Ref for thumbnail strip horizontal scroll
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Modern In-Place Hover Zoom Lens Tracking
  const [isZoomActive, setIsZoomActive] = useState<boolean>(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, percentX: 50, percentY: 50 });

  // Mobile & Fullscreen Interactive Lightbox Zoom Modal
  const [isMobileZoomOpen, setIsMobileZoomOpen] = useState<boolean>(false);
  const [modalZoomScale, setModalZoomScale] = useState<number>(1);

  // Pincode Delivery Check
  const [pincode, setPincode] = useState<string>('');
  const [pincodeStatus, setPincodeStatus] = useState<{ checked: boolean; valid: boolean; msg: string } | null>(null);

  // Fetch Product & Related Items on mount/ID change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const loadProductDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const prod = await dentalService.getProductById(id);
        if (prod) {
          setProduct(prod);
          document.title = `${prod.name} | BuyBright Supplies`;
          const related = await dentalService.getRelatedProducts(prod.category, prod.id, 6);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error('Error loading product detail:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="product-detail-loading-state">
        <div className="detail-spinner" />
        <p>Loading product specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-not-found">
        <i className="fa-solid fa-triangle-exclamation" />
        <h2>Product Not Found</h2>
        <p>The product you are looking for is currently unavailable or has been moved.</p>
        <button type="button" className="btn-return-shop" onClick={() => navigate('/shop')}>
          <i className="fa-solid fa-arrow-left" /> Back to Shop
        </button>
      </div>
    );
  }

  // Multi-angle gallery media items (including uploaded gallery and video demo)
  const productGalleryImages: string[] = (product as any).galleryImages && Array.isArray((product as any).galleryImages) && (product as any).galleryImages.length > 0
    ? (product as any).galleryImages
    : [];

  const productVideoUrl: string = (product as any).videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-dentist-examining-a-patients-teeth-41443-large.mp4';

  const galleryMedia: GalleryMediaItem[] = [
    {
      id: 'img-main',
      type: 'image',
      url: product.image,
      title: `${product.name} - Front Angle`,
    },
    {
      id: 'video-demo',
      type: 'video',
      url: product.image,
      videoUrl: productVideoUrl,
      title: 'Application & Handling Video',
    },
    ...(productGalleryImages.length > 0
      ? productGalleryImages.map((gUrl: string, idx: number) => ({
          id: `img-custom-${idx}`,
          type: 'image' as const,
          url: gUrl,
          title: `${product.name} - Angle ${idx + 2}`,
        }))
      : [
          {
            id: 'img-angle-2',
            type: 'image' as const,
            url: product.image.includes('materials')
              ? '/images/cat_materials_1787401998270.jpg'
              : '/images/cat_endodontic_1787401934680.jpg',
            title: `${product.name} - Packaging Angle`,
          },
          {
            id: 'img-angle-3',
            type: 'image' as const,
            url: '/images/cat_instruments_1787401955005.jpg',
            title: `${product.name} - Macro Texture Angle`,
          },
          {
            id: 'img-angle-4',
            type: 'image' as const,
            url: '/images/cat_consumables_1787401910059.jpg',
            title: `${product.name} - Operatory Setup Angle`,
          },
          {
            id: 'img-angle-5',
            type: 'image' as const,
            url: '/images/cat_equipment_1787401977793.jpg',
            title: `${product.name} - Technical Angle`,
          },
        ]),
  ];

  const currentMedia = galleryMedia[selectedImageIndex] || galleryMedia[0];
  const galleryImages = galleryMedia.map((m) => m.url);

  // Horizontal Variants list
  const horizontalVariants = getProductHorizontalVariants(product);

  // Pricing calculations
  const basePrice = product.price;
  const oldPrice = product.old_price || Math.round(basePrice * 1.22);
  const discountText =
    product.discount || `${Math.round(((oldPrice - basePrice) / oldPrice) * 100)}% Off`;
  const gstAmount = Math.round(basePrice * 0.12);
  const priceExGst = basePrice - gstAmount;
  const brightPoints = horizontalVariants[0]?.brightPoints ?? Math.max(20, Math.round(basePrice * 0.01));

  // Helper to query quantity of a specific variant in active cart
  const getVariantQuantity = (variantId: string) => {
    const found = cart.find((item) => item.product.id === variantId);
    return found ? found.quantity : 0;
  };

  // Small Thumbnail Gallery Navigation Handlers
  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => {
      const newIdx = (prev - 1 + galleryMedia.length) % galleryMedia.length;
      if (thumbnailsRef.current) {
        const btn = thumbnailsRef.current.children[newIdx] as HTMLElement;
        btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
      return newIdx;
    });
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => {
      const newIdx = (prev + 1) % galleryMedia.length;
      if (thumbnailsRef.current) {
        const btn = thumbnailsRef.current.children[newIdx] as HTMLElement;
        btn?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
      return newIdx;
    });
  };

  // Gallery Mouse Hover Zoom Lens Tracking
  const handleGalleryMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.innerWidth <= 992) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const percentX = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    const percentY = Math.min(Math.max((y / rect.height) * 100, 0), 100);
    setZoomPos({ x, y, percentX, percentY });
    setIsZoomActive(true);
  };

  const handleGalleryMouseLeave = () => {
    setIsZoomActive(false);
  };

  // Handle Main Add to Cart
  const handleAddToCart = () => {
    addToCart(product, quantity);
    showToast(`✓ Added ${quantity}x "${product.name.slice(0, 24)}..." to Cart!`, 'success');
  };

  // Handle Main Buy Now
  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
    showToast(`Proceeding to checkout with "${product.name.slice(0, 24)}..."`, 'info');
  };

  // Handle Add / Increment Variant directly from Horizontal Card
  const handleAddVariant = (variant: ProductVariantItem) => {
    const configuredProduct: Product = {
      ...product,
      id: variant.id,
      name: variant.name,
      price: variant.price,
      old_price: variant.old_price,
      discount: variant.discount,
      image: variant.image,
      size: variant.variantLabel,
      in_stock: variant.inStock,
    };
    addToCart(configuredProduct, 1);
  };

  // Handle Request Out-of-Stock Variant directly without popup form
  const handleRequestStock = (variant: ProductVariantItem) => {
    setRequestedVariantIds((prev) => new Set(prev).add(variant.id));
    showToast(
      `✓ Stock request registered for "${variant.name}". We will alert yourvia WhatsApp/SMS once restocked!`,
      'success',
      'Stock Alert Registered'
    );
  };

  // Handle Wishlist Toggle
  const handleToggleWishlist = () => {
    if (product) {
      toggleWishlist(product);
    }
  };

  // Handle Compare Toggle
  const handleToggleCompare = () => {
    setIsCompared(!isCompared);
    showToast(
      isCompared
        ? `Removed from Product Comparison`
        : `Added to Product Comparison Matrix`,
      'success'
    );
  };

  // Handle Pincode Check
  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode.trim())) {
      setPincodeStatus({
        checked: true,
        valid: true,
        msg: '⚡ Delivery in 24-48 Hours with Temperature-Controlled Cold Chain.',
      });
    } else {
      setPincodeStatus({
        checked: true,
        valid: false,
        msg: 'Please enter a valid 6-digit Indian postal pincode.',
      });
    }
  };

  // Handle Download SKU Technical Specification PDF
  const handleDownloadSkuPdf = () => {
    if (!product) return;
    const skuCode = `PD-${product.id.toUpperCase()}-2026`;
    const blob = createSkuPdfBlob(product, skuCode);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BuyBright-SKU-${skuCode}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`✓ Downloaded SKU technical specification: BuyBright-SKU-${skuCode}.pdf`, 'success');
  };

  return (
    <div className="product-detail-page-wrapper">
      <SEO
        title={`${product.name} — Buy Authentic ${product.brand}`}
        description={`Buy authentic ${product.name} by ${product.brand} (${product.category}) at ₹${product.price}. 100% genuine products with manufacturer warranty and GST tax invoice.`}
        canonicalUrl={`https://buybright.com/shop/${product.id}`}
        ogImage={product.image}
        ogType="product"
        keywords={`${product.name}, ${product.brand}, ${product.category}, buy online india, authentic marketplace products`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": product.name,
          "image": product.image.startsWith('http') ? product.image : `https://buybright.com${product.image}`,
          "description": `Authentic ${product.name} manufactured by ${product.brand}. Verified genuine marketplace stock.`,
          "sku": `PD-${product.id.toUpperCase()}-2026`,
          "brand": {
            "@type": "Brand",
            "name": product.brand
          },
          "offers": {
            "@type": "Offer",
            "url": `https://buybright.com/shop/${product.id}`,
            "priceCurrency": "INR",
            "price": product.price,
            "itemCondition": "https://schema.org/NewCondition",
            "availability": product.in_stock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "seller": {
              "@type": "Organization",
              "name": "BuyBright"
            }
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": product.rating || 4.8,
            "reviewCount": product.reviews_count || 32
          }
        }}
      />

      {/* 1. Breadcrumb Strip */}
      <div className="detail-breadcrumb-bar">
        <div className="detail-container">
          <nav className="detail-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="breadcrumb-link">
              <i className="fa-solid fa-house" />
              <span>Home</span>
            </Link>
            <i className="fa-solid fa-chevron-right breadcrumb-separator" />
            <Link to="/shop" className="breadcrumb-link">
              <span>Shop All</span>
            </Link>
            <i className="fa-solid fa-chevron-right breadcrumb-separator" />
            <span className="breadcrumb-category-tag">{product.category.toUpperCase()}</span>
            <i className="fa-solid fa-chevron-right breadcrumb-separator" />
            <span className="breadcrumb-active-product">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* 2. Main Product Showcase & Purchasing Suite Grid */}
      <div className="detail-container">
        <div className="product-showcase-grid">
          {/* Left Column: Interactive Image & Video Gallery */}
          <div className="product-gallery-column">
            {/* Viewport for Video or Image */}
            {currentMedia.type === 'video' ? (
              <div className="main-video-viewport">
                <video
                  key={currentMedia.videoUrl}
                  src={currentMedia.videoUrl}
                  poster={currentMedia.url}
                  controls
                  autoPlay
                  playsInline
                  className="main-gallery-video"
                >
                  Your browser does not support HTML5 video demo.
                </video>

                {/* Overlaid Badges */}
                <div className="gallery-badges-overlay">
                  <span className="badge-video-live">
                    <i className="fa-solid fa-circle-play text-teal" /> Video Demo
                  </span>
                </div>

                {/* Floating Wishlist & Compare Buttons */}
                <div className="gallery-floating-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className={`btn-gallery-action ${isWishlisted ? 'active-wishlist' : ''}`}
                    onClick={handleToggleWishlist}
                    title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <i className={isWishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} />
                  </button>
                  <button
                    type="button"
                    className={`btn-gallery-action ${isCompared ? 'active-compare' : ''}`}
                    onClick={handleToggleCompare}
                    title={isCompared ? 'Remove from Comparison' : 'Add to Compare'}
                  >
                    <i className="fa-solid fa-code-compare" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`main-image-viewport ${isZoomActive ? 'zooming' : ''}`}
                onMouseMove={handleGalleryMouseMove}
                onMouseLeave={handleGalleryMouseLeave}
                onClick={() => {
                  setIsMobileZoomOpen(true);
                  setModalZoomScale(1);
                }}
                title="Click or tap to view fullscreen high-res zoom"
              >
                {/* Overlaid Badges */}
                <div className="gallery-badges-overlay">
                  {discountText && <Badge variant="sale">{discountText}</Badge>}
                  {product.is_bestseller && <Badge variant="bestseller">Bestseller</Badge>}
                  <span className="badge-authentic">
                    <i className="fa-solid fa-shield-check" /> 100% Genuine
                  </span>
                </div>

                {/* Floating Wishlist & Compare Buttons */}
                <div className="gallery-floating-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className={`btn-gallery-action ${isWishlisted ? 'active-wishlist' : ''}`}
                    onClick={handleToggleWishlist}
                    title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <i className={isWishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} />
                  </button>
                  <button
                    type="button"
                    className={`btn-gallery-action ${isCompared ? 'active-compare' : ''}`}
                    onClick={handleToggleCompare}
                    title={isCompared ? 'Remove from Comparison' : 'Add to Compare'}
                  >
                    <i className="fa-solid fa-code-compare" />
                  </button>
                </div>

                {/* Main Image Display */}
                <img
                  src={currentMedia.url || product.image}
                  alt={product.name}
                  className="main-gallery-img"
                />

                {/* Cursor Zoom Lens Indicator */}
                {isZoomActive && (
                  <div
                    className="gallery-zoom-lens"
                    style={{
                      left: `${zoomPos.x}px`,
                      top: `${zoomPos.y}px`,
                    }}
                  />
                )}

                <div className="image-zoom-indicator">
                  <i className="fa-solid fa-magnifying-glass-plus" />
                  <span className="zoom-text-desktop">Hover to inspect macro details</span>
                  <span className="zoom-text-mobile">Tap to zoom fullscreen</span>
                </div>
              </div>
            )}

            {/* Right-Side High-Resolution 100% Opaque Zoom Preview Window */}
            {isZoomActive && currentMedia.type === 'image' && (
              <div className="gallery-zoom-flyout">
                <div
                  className="zoom-flyout-content"
                  style={{
                    backgroundImage: `url(${currentMedia.url || product.image})`,
                    backgroundPosition: `${zoomPos.percentX}% ${zoomPos.percentY}%`,
                    backgroundSize: '280% 280%',
                    backgroundColor: '#ffffff',
                  }}
                />
                <div className="zoom-flyout-badge">
                  <i className="fa-solid fa-microscope text-teal" />
                  <span>3.0x Ultra-HD Macro Inspection</span>
                </div>
              </div>
            )}

            {/* Small Thumbnails Carousel Strip with Left & Right Buttons */}
            <div className="gallery-thumbnails-carousel-wrapper">
              <button
                type="button"
                className="btn-thumb-nav prev"
                onClick={handlePrevImage}
                aria-label="Previous thumbnail"
                title="Previous thumbnail"
              >
                <i className="fa-solid fa-chevron-left" />
              </button>

              <div className="gallery-thumbnails-strip" ref={thumbnailsRef}>
                {galleryMedia.map((media, idx) => (
                  <button
                    key={media.id || idx}
                    type="button"
                    className={`thumbnail-btn ${media.type === 'video' ? 'video-thumbnail-btn' : ''} ${selectedImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={`View ${media.title}`}
                    title={media.type === 'video' ? 'Play Video Demonstration' : `Angle ${idx + 1}`}
                  >
                    <img src={media.url} alt={media.title} />
                    {media.type === 'video' && (
                      <div className="thumb-video-badge">
                        <i className="fa-solid fa-play" />
                        <span>VIDEO</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="btn-thumb-nav next"
                onClick={handleNextImage}
                aria-label="Next thumbnail"
                title="Next thumbnail"
              >
                <i className="fa-solid fa-chevron-right" />
              </button>
            </div>

            {/* Marketplace Certification Banner */}
            <div className="dental-certification-strip">
              <div className="cert-pill">
                <i className="fa-solid fa-certificate text-teal" />
                <span>100% Genuine Guaranteed</span>
              </div>
              <div className="cert-pill">
                <i className="fa-solid fa-shield-halved text-cyan" />
                <span>Manufacturer Warranty</span>
              </div>
              <div className="cert-pill">
                <i className="fa-solid fa-file-invoice text-coral" />
                <span>GST Tax Invoice Ready</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info, Pricing, Variants & Purchase Suite */}
          <div className="product-procurement-column">
            {/* Brand & SKU Header */}
            <div className="procurement-header">
              <div className="brand-verified-row">
                <span className="brand-name-pill">{product.brand}</span>
                <span className="authorized-distributor-badge">
                  <i className="fa-solid fa-circle-check" /> Authorized Brand Partner
                </span>
                <span className="sku-tag">
                  <button
                    type="button"
                    className="btn-sku-manage"
                    onClick={handleDownloadSkuPdf}
                    title="Download SKU Product Data Sheet (PDF)"
                  >
                    <i className="fa-solid fa-file-pdf" />
                    <span>Download</span>
                  </button>
                </span>
              </div>

              <h1 className="product-detail-title">{product.name}</h1>

              {/* Rating & Social Proof */}
              <div className="detail-rating-row">
                <Rating rating={product.rating} reviewsCount={product.reviews_count} />
                <span className="rating-divider">•</span>
                <span className="clinics-ordered-tag">
                  <i className="fa-solid fa-users text-teal" /> 4,800+ Verified Buyers
                </span>
                <span className="rating-divider">•</span>
                <span className="main-bright-points-tag main-presto-points-tag">
                  <i className="fa-solid fa-gem" /> Bright Points {brightPoints}
                </span>
              </div>
            </div>

            {/* Price Card & Tax Summary */}
            <div className="procurement-price-card">
              <div className="price-primary-row">
                <div className="price-values">
                  <span className="detail-price-main">₹{basePrice.toLocaleString('en-IN')}</span>
                  {oldPrice && (
                    <span className="detail-price-mrp">MRP ₹{oldPrice.toLocaleString('en-IN')}</span>
                  )}
                  {discountText && <span className="detail-discount-tag">{discountText}</span>}
                </div>
                <div className="price-badges-group">
                   <span className="bright-points-chip presto-points-chip">
                    <i className="fa-solid fa-gem" /> Bright Points {brightPoints * quantity}
                  </span>
                </div>
              </div>

              <div className="tax-credit-summary">
                <i className="fa-solid fa-receipt text-teal" />
                <span>
                  Save <strong>₹{gstAmount.toLocaleString('en-IN')}</strong> via GST Input Tax Credit (Base: ₹{priceExGst.toLocaleString('en-IN')})
                </span>
              </div>

              {/* Product Trust & Policy Highlights: Warranty, Returnable, Expiry Date */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600 }}>
                  <i className="fa-solid fa-shield-halved" style={{ color: '#16a34a' }} />
                  {(product as any).warranty || '1 Year Official Warranty'}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: (product as any).returnEligible !== false ? '#eff6ff' : '#fef2f2', color: (product as any).returnEligible !== false ? '#1e40af' : '#991b1b', border: `1px solid ${(product as any).returnEligible !== false ? '#bfdbfe' : '#fecaca'}`, borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600 }}>
                  <i className={`fa-solid ${(product as any).returnEligible !== false ? 'fa-rotate-left' : 'fa-ban'}`} style={{ color: (product as any).returnEligible !== false ? '#2563eb' : '#dc2626' }} />
                  {(product as any).returnEligible !== false ? `${(product as any).returnDays || 7} Days Returnable` : 'Non-Returnable'}
                </span>
                {(product as any).expiryDate && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600 }}>
                    <i className="fa-solid fa-calendar-xmark" style={{ color: '#d97706' }} />
                    Expiry: {(product as any).expiryDate}
                  </span>
                )}
                {Boolean((product as any).is_featured || (product as any).isFeatured) && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fdf4ff', color: '#86198f', border: '1px solid #f5d0fe', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600 }}>
                    <i className="fa-solid fa-star" style={{ color: '#a21caf' }} />
                    Featured Choice
                  </span>
                )}
              </div>
            </div>

            {/* Main Product Quantity Selector & CTAs Suite (Directly Under Main Price) */}
            <div className="procurement-actions-suite">
              <div className="quantity-counter-box">
                <button
                  type="button"
                  className="btn-counter"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  <i className="fa-solid fa-minus" />
                </button>
                <span className="counter-value">{quantity}</span>
                <button
                  type="button"
                  className="btn-counter"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <i className="fa-solid fa-plus" />
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                type="button"
                className="btn-procurement-cart"
                onClick={handleAddToCart}
              >
                <i className="fa-solid fa-cart-plus" />
                <span>Add to Cart</span>
              </button>

              {/* Buy Now CTA */}
              <button
                type="button"
                className="btn-procurement-buy"
                onClick={handleBuyNow}
              >
                <i className="fa-solid fa-bolt" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Pincode Delivery Transit Calculator */}
            <div className="pincode-delivery-checker">
              <form onSubmit={handleCheckPincode} className="pincode-form">
                <i className="fa-solid fa-location-dot pincode-icon" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enterpincode (e.g. 400001)"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="pincode-input"
                />
                <button type="submit" className="btn-check-pincode">
                  Check Delivery
                </button>
              </form>

              {pincodeStatus && (
                <div className={`pincode-result-msg ${pincodeStatus.valid ? 'success' : 'error'}`}>
                  <i className={`fa-solid ${pincodeStatus.valid ? 'fa-truck-bolt' : 'fa-circle-exclamation'}`} />
                  <span>{pincodeStatus.msg}</span>
                </div>
              )}
            </div>

            {/* More Variants & Options — Horizontal Product Cards Suite */}
            <div className="product-more-variants-section">
              <div className="variants-section-header">
                <div className="variants-title-block">
                  <i className="fa-solid fa-layer-group text-teal" />
                  <div>
                    <h3 className="variants-heading">More Variants &amp; Packaging</h3>
                    <p className="variants-subheading">Choose from certified shades, sizes &amp; quantity packs</p>
                  </div>
                </div>
                <span className="badge-variants-count">
                  {horizontalVariants.length} Options Available
                </span>
              </div>

              <div className="horizontal-variants-list">
                {horizontalVariants.map((item) => {
                  const currentQty = getVariantQuantity(item.id);
                  const isRequested = requestedVariantIds.has(item.id);

                  return (
                    <div
                      key={item.id}
                      className={`horizontal-variant-card ${!item.inStock ? 'is-out-of-stock' : ''}`}
                    >
                      {/* Left: Product Thumbnail */}
                      <div className="h-variant-image-wrapper">
                        <img src={item.image} alt={item.name} className="h-variant-img" />
                        {item.tag && (
                          <span className={`h-variant-tag ${!item.inStock ? 'tag-oos' : ''}`}>
                            {item.tag}
                          </span>
                        )}
                      </div>

                      {/* Middle: Name, Delivery, Bright Points, Stock */}
                      <div className="h-variant-details">
                        <h4 className="h-variant-title">{item.name}</h4>
                        <div className="h-variant-meta-row">
                          {/* Bright Points Badge */}
                          <span className="h-variant-points">
                            <i className="fa-solid fa-gem" /> Bright Points {item.brightPoints}
                          </span>

                          {/* Delivery info */}
                          <span className="h-variant-delivery">
                            <i className="fa-solid fa-truck-fast" /> {item.deliveryTime}
                          </span>
                        </div>

                        {/* Stock Status Indicator */}
                        <div className="h-variant-stock-row">
                          {item.inStock ? (
                            <span className="h-stock-badge in-stock">
                              <span className="stock-dot pulse-green" />
                              <strong>In Stock</strong>
                              {item.stockCount > 0 && item.stockCount < 3 && (
                                <span className="h-low-stock-alert" style={{ color: '#d97706', fontWeight: 600, marginLeft: '6px' }}>
                                  ({item.stockCount} in stock)
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="h-stock-badge out-of-stock">
                              <span className="stock-dot red" />
                              <strong>Out of Stock</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Price, Offer & Action Area (Interactive Qty Counter or Direct Request) */}
                      <div className="h-variant-actions">
                        <div className="h-variant-pricing">
                          <span className="h-variant-price">₹{item.price.toLocaleString('en-IN')}</span>
                          <div className="h-variant-mrp-row">
                            <span className="h-variant-mrp">MRP ₹{item.old_price.toLocaleString('en-IN')}</span>
                            <span className="h-variant-discount">{item.discount}</span>
                          </div>
                        </div>

                        {item.inStock ? (
                          currentQty > 0 ? (
                            <div className="h-variant-qty-counter">
                              <button
                                type="button"
                                className="btn-v-qty minus"
                                onClick={() => updateQuantity(item.id, currentQty - 1)}
                                aria-label="Decrease quantity"
                                title="Decrease quantity"
                              >
                                <i className="fa-solid fa-minus" />
                              </button>
                              <span className="v-qty-val">{currentQty}</span>
                              <button
                                type="button"
                                className="btn-v-qty plus"
                                onClick={() => updateQuantity(item.id, currentQty + 1)}
                                aria-label="Increase quantity"
                                title="Increase quantity"
                              >
                                <i className="fa-solid fa-plus" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="btn-h-variant-add"
                              onClick={() => handleAddVariant(item)}
                              title={`Add ${item.variantLabel} to cart`}
                            >
                              <i className="fa-solid fa-plus" />
                              <span>ADD</span>
                            </button>
                          )
                        ) : isRequested ? (
                          <span className="btn-h-variant-requested" title="Stock request registered">
                            <i className="fa-solid fa-circle-check" />
                            <span>Requested</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="btn-h-variant-request"
                            onClick={() => handleRequestStock(item)}
                            title={`Request ${item.variantLabel}`}
                          >
                            <i className="fa-solid fa-bell" />
                            <span>Request</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct WhatsApp Row */}
            <div className="institutional-quote-row">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp-consult"
              >
                <i className="fa-brands fa-whatsapp" />
                <span>Need Bulk Assistance? Chat with Product Specialist</span>
              </a>
            </div>
          </div>
        </div>

        {/* 3. Tabbed Deep-Dive Information Section */}
        <div className="product-tabs-container">
          <div className="tabs-nav-header">
            <button
              type="button"
              className={`tab-nav-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              <i className="fa-solid fa-file-lines" />
              <span>Description</span>
            </button>
            <button
              type="button"
              className={`tab-nav-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              <i className="fa-solid fa-microchip" />
              <span>Technicals</span>
            </button>
            <button
              type="button"
              className={`tab-nav-btn ${activeTab === 'packaging' ? 'active' : ''}`}
              onClick={() => setActiveTab('packaging')}
            >
              <i className="fa-solid fa-box-open" />
              <span>Packaging</span>
            </button>
            <button
              type="button"
              className={`tab-nav-btn ${activeTab === 'guidelines' ? 'active' : ''}`}
              onClick={() => setActiveTab('guidelines')}
            >
              <i className="fa-solid fa-stethoscope" />
              <span>Usage Guidelines</span>
            </button>
            <button
              type="button"
              className={`tab-nav-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <i className="fa-solid fa-star" />
              <span>Reviews ({product.reviews_count})</span>
            </button>
          </div>

          <div className="tab-body-card">
            {/* Tab 1: Description */}
            {activeTab === 'description' && (
              <div className="tab-pane overview-pane">
                <div className="overview-text full-width">
                  {((product as any).fullDescription || (product as any).shortDescription || (product as any).description) ? (
                    <div
                      className="product-description-content"
                      style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.8 }}
                      dangerouslySetInnerHTML={{
                        __html: (product as any).fullDescription || (product as any).shortDescription || (product as any).description || ''
                      }}
                    />
                  ) : (
                    <>
                      <h3 className="section-title">About This Product</h3>
                      <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.8 }}>
                        The <strong>{product.name}</strong> is a genuine, verified product manufactured by {product.brand}.
                        This item complies with rigorous quality standards, ensuring optimal durability,
                        performance, and reliability with full manufacturer warranty.
                      </p>
                      <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.8 }}>
                        Suitable for everyday household or professional use requiring consistent,
                        batch-tested reliability with direct factory warranties.
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Technicals */}
            {activeTab === 'specs' && (
              <div className="tab-pane specs-pane">
                <h3 className="section-title">Technical Specifications &amp; Material Matrix</h3>
                <div className="specs-table-wrapper">
                  <table className="specs-table">
                    <tbody>
                      <tr>
                        <th>Brand / Manufacturer</th>
                        <td>{product.brand} (Authorized Official Distribution)</td>
                      </tr>
                      <tr>
                        <th>Product Category</th>
                        <td>{product.category.toUpperCase()}</td>
                      </tr>
                      <tr>
                        <th>Product Model / SKU</th>
                        <td>{(product as any).sku || `PD-${product.id.toUpperCase()}-2026`}</td>
                      </tr>
                      <tr>
                        <th>Size / Dimensions</th>
                        <td>{product.size || product.volume_ml || 'Standard Manufacturer Pack'}</td>
                      </tr>
                      <tr>
                        <th>Available Volume / Packaging</th>
                        <td>{(product as any).packagingDetails?.dispensingFormat || (product as any).packSize || product.volume_ml || 'Standard Dispensing Pack / Kit'}</td>
                      </tr>
                      <tr>
                        <th>Sterilization Compatibility</th>
                        <td>{(product as any).technicalSpecs?.sterilization || (product as any).sterilization || 'Autoclavable at 134°C (273°F) for 18 minutes / Gamma Sterilized'}</td>
                      </tr>
                      <tr>
                        <th>Recommended Storage</th>
                        <td>{(product as any).technicalSpecs?.storage || (product as any).storage || 'Store in cool dry environment (2°C - 28°C / 36°F - 82°F)'}</td>
                      </tr>
                      <tr>
                        <th>Regulatory Certification</th>
                        <td>{(product as any).technicalSpecs?.certification || (product as any).certification || 'CE Certified 0123, ISO 13485:2016, US FDA Registered'}</td>
                      </tr>
                      <tr>
                        <th>Shelf Life &amp; Batch Dating</th>
                        <td>{(product as any).technicalSpecs?.shelfLife || (product as any).shelfLife || '36 Months from Date of Manufacture (Fresh Batch Guaranteed)'}</td>
                      </tr>
                      <tr>
                        <th>Country of Origin</th>
                        <td>{(product as any).technicalSpecs?.origin || (product as any).origin || 'Global Certified Facility (Germany / Japan / USA / India)'}</td>
                      </tr>
                      {((product as any).material || (product as any).materialComposition) && (
                        <tr>
                          <th>Material Composition</th>
                          <td>{(product as any).material || (product as any).materialComposition}</td>
                        </tr>
                      )}
                      {/* Dynamic Key/Value Specification Rows */}
                      {Array.isArray((product as any).specs) && (product as any).specs.map((s: any, idx: number) => s.key && s.value && (
                        <tr key={`spec-row-${idx}`}>
                          <th>{s.key}</th>
                          <td>{s.value}</td>
                        </tr>
                      ))}
                      {Array.isArray((product as any).technicalSpecsList) && (product as any).technicalSpecsList.map((s: any, idx: number) => s.specName && s.specValue && (
                        <tr key={`spec-list-${idx}`}>
                          <th>{s.specName}</th>
                          <td>{s.specValue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Packaging */}
            {activeTab === 'packaging' && (
              <div className="tab-pane packaging-pane">
                <div className="overview-text full-width">
                  {((product as any).packagingDescriptionHtml || (product as any).packagingDescription) ? (
                    <div
                      className="product-description-content"
                      style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.8 }}
                      dangerouslySetInnerHTML={{
                        __html: (product as any).packagingDescriptionHtml || (product as any).packagingDescription || ''
                      }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      <i className="fa-solid fa-box-open" style={{ fontSize: '2rem', marginBottom: '10px', color: '#cbd5e1' }} />
                      <p>Detailed packaging information is not available for this product.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Usage Guidelines */}
            {activeTab === 'guidelines' && (
              <div className="tab-pane protocol-pane">
                <div className="overview-text full-width">
                  {((product as any).usageGuidelinesHtml || (product as any).usageInstructions || (product as any).howToUse) ? (
                    <div
                      className="product-description-content"
                      style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.8 }}
                      dangerouslySetInnerHTML={{
                        __html: (product as any).usageGuidelinesHtml || (product as any).usageInstructions || (product as any).howToUse || ''
                      }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                      <i className="fa-solid fa-stethoscope" style={{ fontSize: '2rem', marginBottom: '10px', color: '#cbd5e1' }} />
                      <p>Usage guidelines and protocol are not available for this product.</p>
                    </div>
                  )}
                </div>
              </div>
            )}



            {/* Tab 4: Verified Doctor Reviews */}
            {activeTab === 'reviews' && (
              <div className="tab-pane reviews-pane">
                <div className="reviews-summary-header">
                  <div className="score-box">
                    <span className="score-big">{product.rating.toFixed(1)}</span>
                    <Rating rating={product.rating} reviewsCount={product.reviews_count} />
                    <span className="score-desc">Based on {product.reviews_count} verified buyer ratings</span>
                  </div>

                  <div className="rating-bars-box">
                    {[
                      { star: 5, pct: 88 },
                      { star: 4, pct: 10 },
                      { star: 3, pct: 2 },
                      { star: 2, pct: 0 },
                      { star: 1, pct: 0 },
                    ].map((row) => (
                      <div key={row.star} className="rating-bar-row">
                        <span className="star-label">{row.star} ★</span>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${row.pct}%` }} />
                        </div>
                        <span className="pct-label">{row.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="doctor-reviews-list">
                  <div className="doctor-review-card">
                    <div className="review-meta-row">
                      <div className="doctor-info">
                        <strong>Sameer Deshmukh</strong>
                        <span>Verified Buyer • Pune, Maharashtra</span>
                      </div>
                      <span className="verified-badge">
                        <i className="fa-solid fa-circle-check" /> Verified Purchase
                      </span>
                    </div>
                    <Rating rating={5} />
                    <h5 className="review-heading">Outstanding product precision and consistent batch quality!</h5>
                    <p className="review-text">
                      We ordered multiple units for our office. The efficiency and build quality are on par with international standards. Prompt delivery within 36 hours with pristine packaging.
                    </p>
                    <span className="review-date">Reviewed 4 days ago</span>
                  </div>

                  <div className="doctor-review-card">
                    <div className="review-meta-row">
                      <div className="doctor-info">
                        <strong>Ananya Kulkarni</strong>
                        <span>Verified Buyer • Mumbai, Maharashtra</span>
                      </div>
                      <span className="verified-badge">
                        <i className="fa-solid fa-circle-check" /> Verified Purchase
                      </span>
                    </div>
                    <Rating rating={5} />
                    <h5 className="review-heading">Genuine stock with valid GST invoicing</h5>
                    <p className="review-text">
                      Excellent pricing compared to local retail, and we received a valid GST tax invoice. Highly recommended for regular orders.
                    </p>
                    <span className="review-date">Reviewed 1 week ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Related & Complementary Supplies Carousel */}
        {relatedProducts.length > 0 && (
          <div className="detail-related-section">
            <div className="related-section-header">
              <div>
                <span className="section-pill">COMPLEMENTARY PRODUCTS</span>
                <h3 className="section-heading">Frequently Bought Together</h3>
              </div>
              <Link to="/shop" className="btn-view-all-shop">
                <span>View Full Catalog</span>
                <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>

            <div className="related-products-grid">
              {relatedProducts.map((relProd) => (
                <ProductCard key={relProd.id} product={relProd} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Mobile & Fullscreen Interactive Lightbox Zoom Modal */}
      {isMobileZoomOpen && (
        <div
          className="mobile-zoom-modal-backdrop"
          onClick={() => setIsMobileZoomOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="mobile-zoom-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mobile-zoom-modal-header">
              <div className="zoom-header-info">
                <span className="zoom-product-title">{product.name}</span>
                <span className="zoom-counter">
                  Image Angle {selectedImageIndex + 1} of {galleryImages.length}
                </span>
              </div>
              <div className="zoom-header-controls">
                <button
                  type="button"
                  className="btn-zoom-scale-toggle"
                  onClick={() => setModalZoomScale((prev) => (prev === 1 ? 2 : 1))}
                  title={modalZoomScale === 1 ? 'Zoom In (2x)' : 'Reset Zoom (1x)'}
                >
                  <i className={modalZoomScale === 1 ? 'fa-solid fa-magnifying-glass-plus' : 'fa-solid fa-magnifying-glass-minus'} />
                  <span>{modalZoomScale === 1 ? '2.0x Magnify' : '1.0x Normal'}</span>
                </button>
                <button
                  type="button"
                  className="btn-close-zoom-modal"
                  onClick={() => setIsMobileZoomOpen(false)}
                  aria-label="Close zoom preview"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="mobile-zoom-modal-body">
              <button
                type="button"
                className="btn-modal-nav prev"
                onClick={handlePrevImage}
                aria-label="Previous angle"
              >
                <i className="fa-solid fa-chevron-left" />
              </button>

              <div
                className="modal-zoom-img-container"
                onClick={() => setModalZoomScale((prev) => (prev === 1 ? 2 : 1))}
              >
                <img
                  src={galleryImages[selectedImageIndex] || product.image}
                  alt={product.name}
                  className={`modal-zoom-img ${modalZoomScale > 1 ? 'scale-2x' : ''}`}
                />
              </div>

              <button
                type="button"
                className="btn-modal-nav next"
                onClick={handleNextImage}
                aria-label="Next angle"
              >
                <i className="fa-solid fa-chevron-right" />
              </button>
            </div>

            {/* Footer */}
            <div className="mobile-zoom-modal-footer">
              <div className="modal-thumbnails-strip">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`modal-thumb-btn ${selectedImageIndex === idx ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      setModalZoomScale(1);
                    }}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} />
                  </button>
                ))}
              </div>
              <p className="modal-zoom-tip">
                <i className="fa-solid fa-hand-pointer text-teal" /> Tap image or 2.0x Magnify button to inspect details
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
