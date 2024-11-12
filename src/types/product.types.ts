// product.types.ts

export interface NewProduct {
    categoryId: number; // Foreign key to the category (you mentioned PK, which is assumed to be categoryId)
    name: string; // Name of the product
    quantity: number; // Stock quantity
    minPurchase: number; // Minimum purchase amount
    description?: string; // Description of the product (optional)
    brand: string; // Brand of the product
    mktPrice: number; // Market price
    sellingPrice: number; // Selling price
    size?: string; // Size of the product (optional)
    colors?: string[]; // List of available colors (optional)
    img: string; // URL or path to the product image (optional)
}

export interface Product extends NewProduct {
    id: string; // Unique identifier for the product
    createdAt: Date; // Date when the product was created
    updatedAt: Date; // Date when the product was last updated
}


// ProductUpdateDTO extends Product - for updating product
export interface ProductUpdateDTO extends Partial<Product> {
    id: string; // The 'id' is required for updates
}
