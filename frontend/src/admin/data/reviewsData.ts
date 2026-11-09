/**
 * BuyBright Reviews & Ratings Admin Data & Storage Service.
 */

import { AdminReview, ReviewStats, ReviewStatus } from '../../types/review';

const STORAGE_KEY = 'buybright_admin_reviews_v2';

export const INITIAL_REVIEWS: AdminReview[] = [
  {
    id: 'REV-1001',
    productId: '1',
    productName: 'Woodpecker LED Curing Light iLed Plus',
    productImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200&auto=format&fit=crop&q=60',
    productSku: 'WPK-LED-01',
    productCategory: 'Dental Equipment & Autoclaves',
    productPrice: 12500,
    customerName: '  Rajesh Sharma',
    customerEmail: ' rajesh.dent@gmail.com',
    customerAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80',
    customerPhone: '+91 98234 56789',
    isVerifiedBuyer: true,
    clinicName: 'Sharma Advanced Dental Clinic, Mumbai',
    rating: 5,
    title: 'Outstanding curing intensity and ergonomic grip!',
    comment: 'Been using this Woodpecker iLed Plus for over 3 months in my clinic. It polymerizes 2mm composite resin in literally 1 second under turbo mode. Battery life lasts through entire day of back-to-back procedures.',
    images: [
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&auto=format&fit=crop&q=80',
    ],
    status: 'Approved',
    date: '03 Oct 2026, 11:20 AM',
    helpfulCount: 24,
    adminReply: {
      replyText: 'Thank you   Sharma! We are thrilled that the iLed Plus is accelerating your chairside workflow. Reach out anytime for spare light guides!',
      replyDate: '03 Oct 2026, 01:15 PM',
      repliedBy: 'BuyBright Team',
    },
  },
  {
    id: 'REV-1002',
    productId: '2',
    productName: 'Mani Rotary Niti Files Gold Assorted',
    productImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&auto=format&fit=crop&q=60',
    productSku: 'MANI-NITI-02',
    productCategory: 'Endodontics & Rotary Files',
    productPrice: 1850,
    customerName: '  Priya Kulkarni',
    customerEmail: 'priya.kulkarni.mfs@gmail.com',
    customerAvatar: 'https://images.unsplash.com/photo-1594824813575-b6d396a8e805?w=120&auto=format&fit=crop&q=80',
    customerPhone: '+91 94220 12345',
    isVerifiedBuyer: true,
    clinicName: 'Pearl Dental Care, Pune',
    rating: 5,
    title: 'Super flexible, zero ledge formation in curved canals',
    comment: 'The cyclic fatigue resistance on these gold heat-treated files is exceptional. Negotiated severely curved mesiobuccal canals of maxillary molars with complete confidence. Highly recommended for endodontists.',
    status: 'Approved',
    date: '02 Oct 2026, 04:45 PM',
    helpfulCount: 18,
  },
  {
    id: 'REV-1003',
    productId: '3',
    productName: 'BuyBright Class B Dental Autoclave 23L',
    productImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200&auto=format&fit=crop&q=60',
    productSku: 'AUT-CLS-B23',
    productCategory: 'Dental Equipment & Autoclaves',
    productPrice: 78000,
    customerName: '  Ananya Sen',
    customerEmail: 'ananya.sen.smile@gmail.com',
    customerAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80',
    customerPhone: '+91 98301 98765',
    isVerifiedBuyer: true,
    clinicName: 'Sen Multispeciality Dental Hospital, Kolkata',
    rating: 4,
    title: 'Robust sterilizer with clean automated cycles',
    comment: 'Fractionated vacuum cycle ensures thorough penetration for hollow handpieces and surgical cassettes. Printer output provides audit-ready records. Slightly noisy during vacuum stage but overall 9/10.',
    status: 'Approved',
    date: '01 Oct 2026, 06:10 PM',
    helpfulCount: 12,
  },
  {
    id: 'REV-1004',
    productId: '4',
    productName: '3M Filtek Z350 XT Universal Restorative Composite',
    productImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=200&auto=format&fit=crop&q=60',
    productSku: '3M-FLT-Z350',
    productCategory: 'Restorative & Instruments',
    productPrice: 2450,
    customerName: '  Vikramaditya Rathore',
    customerEmail: 'vikram.rathore.dent@yahoo.com',
    customerAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80',
    customerPhone: '+91 97110 44556',
    isVerifiedBuyer: false,
    clinicName: 'Apex Dental Artistry, New Delhi',
    rating: 3,
    title: 'Great polish retention, but delivery took 4 days',
    comment: 'Composite quality and chameleon blending effect is world class as expected from 3M. However courier delivery to Delhi took 4 days due to holiday rush. Hope shipping speeds improve.',
    status: 'Pending',
    date: '30 Sep 2026, 09:15 AM',
    helpfulCount: 5,
    adminReply: {
      replyText: 'Dear   Vikramaditya, apologies for the festive transit delay! We have now partnered with BlueDart Express to ensure next-day delivery across Delhi NCR.',
      replyDate: '30 Sep 2026, 11:30 AM',
      repliedBy: 'Customer Support',
    },
  },
  {
    id: 'REV-1005',
    productId: '5',
    productName: 'NSK Style High Speed Dental Air Turbine Handpiece',
    productImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200&auto=format&fit=crop&q=60',
    productSku: 'NSK-HP-AIR',
    productCategory: 'Oral Surgery & Handpieces',
    productPrice: 6200,
    customerName: '  Sneha Pillai',
    customerEmail: 'sneha.pillai.dent@gmail.com',
    customerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    customerPhone: '+91 98470 23456',
    isVerifiedBuyer: true,
    clinicName: 'Pillai Dental Lounge, Bengaluru',
    rating: 5,
    title: 'Zero vibration, ultra-smooth cutting and ceramic bearings!',
    comment: 'The triple water spray cools the prep area flawlessly without any clogging. Clean push-button chuck makes bur changes lightning fast. Excellent value for daily operative work.',
    status: 'Approved',
    date: '28 Sep 2026, 02:40 PM',
    helpfulCount: 31,
  },
  {
    id: 'REV-1006',
    productId: '6',
    productName: 'Alginate Impression Material Fast Set 500g',
    productImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&auto=format&fit=crop&q=60',
    productSku: 'ALG-IMP-500',
    productCategory: 'Prosthodontics & Impression Trays',
    productPrice: 420,
    customerName: '  Harish Patel',
    customerEmail: 'harish.patel.smile@rediffmail.com',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    customerPhone: '+91 98250 88990',
    isVerifiedBuyer: true,
    clinicName: 'Patel Implant & Cosmetic Center, Ahmedabad',
    rating: 2,
    title: 'Setting time was faster than stated in warm weather',
    comment: 'During peak afternoon in Ahmedabad, the material set in under 45 seconds which left very short working time. Suggest keeping water temperature guidelines highlighted.',
    status: 'Pending',
    date: '27 Sep 2026, 05:22 PM',
    helpfulCount: 7,
  },
  {
    id: 'REV-1007',
    productId: '7',
    productName: 'Kerr OptiBond Universal Single-Component Adhesive',
    productImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=200&auto=format&fit=crop&q=60',
    productSku: 'KERR-OPT-UNI',
    productCategory: 'Restorative & Instruments',
    productPrice: 3100,
    customerName: '  Meera Nambiar',
    customerEmail: 'meera.nambiar.endo@gmail.com',
    customerAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80',
    customerPhone: '+91 94471 33445',
    isVerifiedBuyer: true,
    clinicName: 'Nambiar Endodontic Specialty, Kochi',
    rating: 5,
    title: 'Zero postoperative sensitivity and unmatched bond strength',
    comment: 'OptiBond Universal has completely eliminated post-op sensitivity in all my deep Class II posterior restorations. The monomer penetration into etched dentin is unparalleled.',
    status: 'Approved',
    date: '25 Sep 2026, 10:05 AM',
    helpfulCount: 19,
  },
  {
    id: 'REV-1008',
    productId: '8',
    productName: 'BuyBright Nitrile Examination Gloves Box of 100',
    productImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=200&auto=format&fit=crop&q=60',
    productSku: 'GLV-NIT-100',
    productCategory: 'Dental Disposables & Gloves',
    productPrice: 380,
    customerName: 'Anonymous Reviewer',
    customerEmail: 'spam.promotions.bot@fake.net',
    customerPhone: '+91 00000 00000',
    isVerifiedBuyer: false,
    rating: 1,
    title: 'Visit our site for cheapest dental bulk supplies!',
    comment: 'Check out cheap supplies at external site url www.fake-dental-offers.biz with coupon code SCAM100',
    status: 'Rejected',
    date: '24 Sep 2026, 03:12 AM',
    helpfulCount: 0,
  },
];

export const getReviews = (): AdminReview[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading reviews from localStorage:', err);
    return INITIAL_REVIEWS;
  }
};

export const saveReviews = (reviews: AdminReview[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (err) {
    console.error('Error saving reviews to localStorage:', err);
  }
};

export const updateReviewStatus = (reviewId: string, status: ReviewStatus): AdminReview[] => {
  const current = getReviews();
  const updated = current.map((r) => (r.id === reviewId ? { ...r, status } : r));
  saveReviews(updated);
  return updated;
};

export const addAdminReply = (
  reviewId: string,
  replyText: string,
  repliedBy: string = 'BuyBright Admin'
): AdminReview[] => {
  const current = getReviews();
  const updated = current.map((r) => {
    if (r.id === reviewId) {
      return {
        ...r,
        adminReply: {
          replyText,
          replyDate: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          repliedBy,
        },
      };
    }
    return r;
  });
  saveReviews(updated);
  return updated;
};

export const deleteReview = (reviewId: string): AdminReview[] => {
  const current = getReviews();
  const updated = current.filter((r) => r.id !== reviewId);
  saveReviews(updated);
  return updated;
};

export const getReviewStats = (reviews: AdminReview[]): ReviewStats => {
  const total = reviews.length;
  const approved = reviews.filter((r) => r.status === 'Approved').length;
  const pending = reviews.filter((r) => r.status === 'Pending').length;
  const rejected = reviews.filter((r) => r.status === 'Rejected').length;

  const sumRating = reviews.reduce((acc, r) => acc + r.rating, 0);
  const averageRating = total > 0 ? Number((sumRating / total).toFixed(1)) : 5.0;

  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  return {
    total,
    approved,
    pending,
    rejected,
    averageRating,
    ratingCounts,
  };
};
