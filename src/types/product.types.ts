// product.types.ts

export interface NewProduct {
  categoryId: number;
  name: string;
  quantity: number;
  minPurchase: number;
  description?: string;
  brand: string;
  mktPrice: number;
  sellingPrice: number;
  size?: string;
  colors?: string[];
  img: string;
}

export interface Product extends NewProduct {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductUpdateDTO extends Partial<Product> {
  id: string;
}
