export type VideoProvider =
  | "youtube"
  | "facebook"
  | "vimeo"
  | "tiktok"
  | "custom";

export interface IListingImage {
  url: String;
  alt?: String;
  order?: number;
}

export interface IListingVideo {
  provider: VideoProvider;
  url: String;
  embedId?: String;
}

export interface IListingMedia {
  cover: IListingImage;
  gallery: IListingImage[];
  video?: IListingVideo;
  virtualTourUrl?: String;
}

export interface IListingFloorPlan {
  title: String;
  sizeSqft: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  currency?: String;
  image: IListingImage;
  description?: String;
  order?: number;
}

export interface IListing {
  title: String;
  description: String;
  media: IListingMedia;
  zip: String;
  city: String;
  locationText: String;
  thana: String;
  neighborhood: String;
  beds: number;
  baths: number;
  sqft: number;
  propertyStatus:
    | "Pending"
    | "Active"
    | "Sold"
    | "Rented"
    | "Draft"
    | "Archived";
  price: number;
  currency: String;
  lotSize: String;
  rooms: Number;
  forRent: boolean;
  featured: boolean;
  customId: String;
  garages: Number;
  garageSize: String;
  availableFrom: Date;
  basement: String;
  extraDetails: String;
  roofing: String;
  exteriorMaterial: String;
  ownerNotes: String;
  businessType: "housing society" | "housing construction" | "home solution";

  propertyType: "Houses" | "Apartments" | "Villa" | "Office";

  yearBuilding: number;

  tags: String[];
  features: String[];

  floorPlans: IListingFloorPlan[];

  geo: {
    type: "Point";
    coordinates: [number, number];
  };
}


export type CreateListingInput = {
  title: String;

  description?: String;

  media: {
    cover: { url: String; alt?: String; order?: number };
    gallery?: { url: String; alt?: String; order?: number }[];
    video?: { provider: VideoProvider; url: String; embedId?: String } | null;
    virtualTourUrl?: String;
  };

  city: String;
  locationText: String;

  zip?: String;
  thana?: String;
  neighborhood?: String;

  beds: number;
  baths: number;
  sqft: number;

  price: number;
  currency?: String;

  forRent: boolean;
  featured?: boolean;

  businessType: "housing society" | "housing construction" | "home solution";

  propertyType: "Houses" | "Apartments" | "Villa" | "Office";

  yearBuilding: number;

  propertyStatus?: "Pending" | "Active" | "Sold" | "Rented" | "Draft" | "Archived";

  tags?: String[];
  features?: String[];

  floorPlans?: IListingFloorPlan[];

  lotSize?: String;
  rooms?: number;
  customId?: String;
  garages?: number;
  garageSize?: String;
  availableFrom?: String | Date;
  basement?: String;
  extraDetails?: String;
  roofing?: String;
  exteriorMaterial?: String;
  ownerNotes?: String;

  lat: number;
  lng: number;
};
export type ListingsQuery = {
  city?: String;

  forRent?: String;
  featured?: String;

  propertyType?: "Houses" | "Apartments" | "Villa" | "Office";
  businessType?: "housing society" | "housing construction" | "home solution";

  search?: String;
  q?: String;

  propertyId?: String;

  minPrice?: String;
  maxPrice?: String;

  minBeds?: String;
  minBaths?: String;

  minSqft?: String;
  maxSqft?: String;

  tags?: String;
  features?: String;

  hasVideo?: String;
  hasVirtualTour?: String;

  page?: String;
  limit?: String;

  sort?: "price" | "sqft" | "yearBuilding" | "createdAt";
  order?: "asc" | "desc";
};
