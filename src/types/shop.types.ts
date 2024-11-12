export interface NewShop {
  desc: string;
  street: string;
  businessType: string;
  buildingName: string;
  shopNumber: string;
  userId: string;
}

export interface Shop extends NewShop {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShopUpdateDTO extends Partial<Shop> {
  id: string;
}
