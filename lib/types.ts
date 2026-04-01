export interface Student {
  student_id: number;
  name: string;
  email: string;
  major: string;
}

export interface Course {
  course_id: number;
  course_code: string;
  course_name: string;
}

export interface Ebook {
  ebook_id: number;
  title: string;
  author: string;
  isbn: string;
  edition: string;
  course_id: number;
  course_code: string;
  course_name: string;
}

export interface Listing {
  listing_id: number;
  ebook_id: number;
  ebook_title: string;
  ebook_author: string;
  ebook_isbn: string;
  ebook_edition: string;
  course_id: number;
  course_code: string;
  course_name: string;
  seller_student_id: number;
  seller_name: string;
  seller_email: string;
  seller_major: string;
  trade_type: 'SELL' | 'SWAP' | 'BOTH';
  book_condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR';
  price: number | null;
  status: 'ACTIVE' | 'RESERVED' | 'CLOSED';
  posted_at: string;
  updated_at: string;
  note: string | null;
}

export interface AvailableListingReportRow {
  listing_id: number;
  trade_type: 'SELL' | 'SWAP' | 'BOTH';
  book_condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR';
  price: number | null;
  status: 'ACTIVE' | 'RESERVED' | 'CLOSED';
  posted_at: string;
  note: string | null;
  ebook_title: string;
  ebook_author: string;
  course_code: string;
  course_name: string;
  seller_name: string;
  seller_email: string;
}

export interface AvailableListingReportStats {
  total_active: number;
  avg_price_sell: number;
  sell_count: number;
  swap_or_both_count: number;
}
