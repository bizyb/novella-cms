export interface Post {
  id?: number,
  slug?: string,
  date?: string,
  title?: string,
  prev?: Post,
  next?: Post
}

export interface DocumentMetadata {
  uid?: string,
  slug?: string,
  createdAt?: number,
  title?: string
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
  published?: boolean
}