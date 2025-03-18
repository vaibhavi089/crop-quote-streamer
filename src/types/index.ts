
export interface CropPriceData {
  id: string;
  commodity: string;
  variety: string;
  market: string;
  state: string;
  district: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  date: Date;
}

export interface CropDetails {
  name: string;
  avgMinPrice: number;
  avgMaxPrice: number;
  avgModalPrice: number;
  markets: string[];
  priceData: CropPriceData[];
}
