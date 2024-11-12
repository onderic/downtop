export interface NewShop {
    desc: string; // Description of the shop (optional)
    street: string; // Street address
    businessType: string; // Type of business (e.g., retail, wholesale, etc.)
    buildingName: string; // Building name (optional)
    shopNumber: string; // Shop number or unit number
    userId: string; // Foreign key to the user who owns or manages the shop (user PK)
}


export interface Shop extends NewShop {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}


export interface ShopUpdateDTO extends Partial<Shop> {
    id: string; // The 'id' is required for updates - rest is
}
