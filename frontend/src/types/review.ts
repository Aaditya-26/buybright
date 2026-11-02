/**
 * BuyBright Reviews & Ratings Management Types.
 */

export type ReviewStatus = 'Approved' | 'Pending' | 'Rejected';

export interface AdminReview {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productSku: string;
  productCategory: string;
  productPrice: number;
  
  // Customer details
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  customerPhone?: string;
  isVerifiedBuyer: boolean;
  clinicName?: string;
  
  // Rating & Review details
  rating: number; // 1 to 5
  title: string;
  comment: string;
  images?: string[];
  status: ReviewStatus;
  date: string;
  helpfulCount: number;
  
  // Admin Reply
  adminReply?: {
    replyText: string;
    replyDate: string;
    repliedBy: string;
  };
}

export interface ReviewStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  averageRating: number;
  ratingCounts: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
