export type ProductCategory = "T-Shirts" | "3D Prints";
export type AgreementType = "Royalty" | "One-Time";
export type ModerationStatus = "pending" | "approved" | "rejected";
export type ContentType = "official" | "user-submitted";

export type Design = {
  id: number;
  name: string;
  category: ProductCategory;
  basePrice: number;
  fromPrice: number;
  creator: string;
  imagePath: string;
  contentType: ContentType;
  moderationStatus: ModerationStatus;
  agreementType?: AgreementType;
  royaltyPercent?: number;
};

export const productCatalog: Design[] = [
  {
    id: 1,
    name: "Fair Prices Scale",
    category: "T-Shirts",
    basePrice: 12,
    fromPrice: 18,
    creator: "FrankSavage",
    imagePath: "/designs/fair-prices-scale.png",
    contentType: "official",
    moderationStatus: "approved",
  },
  {
    id: 2,
    name: "Transparent Costs",
    category: "T-Shirts",
    basePrice: 11.5,
    fromPrice: 18,
    creator: "FrankSavage",
    imagePath: "/designs/transparent-costs.png",
    contentType: "official",
    moderationStatus: "approved",
  },
  {
    id: 3,
    name: "Witness: See Everything",
    category: "T-Shirts",
    basePrice: 12,
    fromPrice: 18,
    creator: "FrankSavage",
    imagePath: "/designs/witness-eye.png",
    contentType: "official",
    moderationStatus: "approved",
  },
  {
    id: 4,
    name: "Future Layers",
    category: "T-Shirts",
    basePrice: 11,
    fromPrice: 18,
    creator: "Community Creator",
    imagePath: "/designs/transparent-costs.png",
    contentType: "user-submitted",
    moderationStatus: "pending",
    agreementType: "Royalty",
    royaltyPercent: 8,
  },
  {
    id: 5,
    name: "Stacked City Model",
    category: "3D Prints",
    basePrice: 14,
    fromPrice: 24,
    creator: "Maker Drafts",
    imagePath: "/designs/fair-prices-scale.png",
    contentType: "user-submitted",
    moderationStatus: "rejected",
    agreementType: "One-Time",
  },
];
