export const TRADE_TYPES = ['SELL', 'SWAP', 'BOTH'] as const;
export const BOOK_CONDITIONS = ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR'] as const;
export const LISTING_STATUSES = ['ACTIVE', 'RESERVED', 'CLOSED'] as const;

export type TradeType = (typeof TRADE_TYPES)[number];
export type BookCondition = (typeof BOOK_CONDITIONS)[number];
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export interface ListingInput {
  ebookId: number;
  sellerStudentId: number;
  tradeType: TradeType;
  bookCondition: BookCondition;
  price: number | null;
  status: ListingStatus;
  note: string | null;
}

function isEnumValue<T extends readonly string[]>(value: string, allowed: T): value is T[number] {
  return allowed.includes(value);
}

export function parseListingInput(payload: unknown): { data?: ListingInput; error?: string } {
  const body = payload as Record<string, unknown>;

  const ebookId = Number(body.ebookId);
  const sellerStudentId = Number(body.sellerStudentId);
  const tradeType = String(body.tradeType || '').toUpperCase();
  const bookCondition = String(body.bookCondition || '').toUpperCase();
  const status = String(body.status || 'ACTIVE').toUpperCase();

  let price: number | null = null;
  if (body.price !== '' && body.price !== null && body.price !== undefined) {
    const parsedPrice = Number(body.price);
    if (!Number.isFinite(parsedPrice)) {
      return { error: 'Price must be a number.' };
    }
    price = parsedPrice;
  }

  const noteRaw = typeof body.note === 'string' ? body.note.trim() : '';
  const note = noteRaw.length > 0 ? noteRaw : null;

  if (!Number.isInteger(ebookId) || ebookId <= 0) {
    return { error: 'ebookId must be a positive integer.' };
  }

  if (!Number.isInteger(sellerStudentId) || sellerStudentId <= 0) {
    return { error: 'sellerStudentId must be a positive integer.' };
  }

  if (!isEnumValue(tradeType, TRADE_TYPES)) {
    return { error: 'tradeType must be one of SELL, SWAP, BOTH.' };
  }

  if (!isEnumValue(bookCondition, BOOK_CONDITIONS)) {
    return { error: 'bookCondition must be one of NEW, LIKE_NEW, GOOD, FAIR.' };
  }

  if (!isEnumValue(status, LISTING_STATUSES)) {
    return { error: 'status must be one of ACTIVE, RESERVED, CLOSED.' };
  }

  if (tradeType === 'SWAP' && price !== null) {
    return { error: 'For SWAP listings, price must be empty.' };
  }

  if ((tradeType === 'SELL' || tradeType === 'BOTH') && (price === null || price <= 0)) {
    return { error: 'For SELL/BOTH listings, price must be greater than 0.' };
  }

  return {
    data: {
      ebookId,
      sellerStudentId,
      tradeType,
      bookCondition,
      price,
      status,
      note,
    },
  };
}
