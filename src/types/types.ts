export interface DocumentMetadata {
  uid?: string,
  slug?: string,
  createdAt?: number,
  title?: string,
  apiKey?: string
}

export interface DocumentDetail {
  uid?: string,
  slug?: string,
  title?: string,
  date?: string,
  content?: string,
  prev?: DocumentMetadata,
  next?: DocumentMetadata,
  updatedAt?: number,
  createdAt?: number,
  published?: boolean,
  apiKey?: string
}