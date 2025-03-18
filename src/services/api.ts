
import { CropPriceData, CropDetails, SearchParams } from "@/types";

const API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";
const BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

export async function fetchCropPrices(searchParams?: SearchParams): Promise<CropPriceData[]> {
  try {
    // Default parameters
    const params = new URLSearchParams({
      "api-key": API_KEY,
      "format": "json",
      "limit": "100",
    });

    // Add search filters if provided
    if (searchParams?.crop) {
      params.append("filters[commodity]", searchParams.crop);
    }

    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    let records = data.records.map((record: any) => ({
      id: record.timestamp || `${record.commodity}-${record.market}-${record.arrival_date}`,
      commodity: record.commodity,
      variety: record.variety,
      market: record.market,
      state: record.state,
      district: record.district,
      minPrice: parseFloat(record.min_price),
      maxPrice: parseFloat(record.max_price),
      modalPrice: parseFloat(record.modal_price),
      date: new Date(record.arrival_date),
    }));

    // Filter by city (market) if provided
    if (searchParams?.city) {
      records = records.filter(record => 
        record.market.toLowerCase().includes(searchParams.city!.toLowerCase())
      );
    }

    return records;
  } catch (error) {
    console.error("Error fetching crop prices:", error);
    return [];
  }
}

export async function fetchCropCategories(): Promise<string[]> {
  try {
    const prices = await fetchCropPrices();
    // Extract unique commodities
    const commodities = new Set(prices.map(item => item.commodity));
    return Array.from(commodities).sort();
  } catch (error) {
    console.error("Error fetching crop categories:", error);
    return [];
  }
}

export async function fetchMarkets(): Promise<string[]> {
  try {
    const prices = await fetchCropPrices();
    // Extract unique markets (cities)
    const markets = new Set(prices.map(item => item.market));
    return Array.from(markets).sort();
  } catch (error) {
    console.error("Error fetching markets:", error);
    return [];
  }
}

export async function fetchCropDetails(cropName: string, city?: string): Promise<CropDetails> {
  try {
    const prices = await fetchCropPrices({ crop: cropName, city });
    
    if (prices.length === 0) {
      return {
        name: cropName,
        avgMinPrice: 0,
        avgMaxPrice: 0,
        avgModalPrice: 0,
        markets: [],
        priceData: [],
      };
    }
    
    // Calculate averages
    const avgMinPrice = prices.reduce((sum, item) => sum + item.minPrice, 0) / prices.length;
    const avgMaxPrice = prices.reduce((sum, item) => sum + item.maxPrice, 0) / prices.length;
    const avgModalPrice = prices.reduce((sum, item) => sum + item.modalPrice, 0) / prices.length;
    
    // Find markets
    const markets = Array.from(new Set(prices.map(item => item.market)));
    
    return {
      name: cropName,
      avgMinPrice,
      avgMaxPrice,
      avgModalPrice,
      markets,
      priceData: prices,
    };
  } catch (error) {
    console.error(`Error fetching details for ${cropName}:`, error);
    return {
      name: cropName,
      avgMinPrice: 0,
      avgMaxPrice: 0,
      avgModalPrice: 0,
      markets: [],
      priceData: [],
    };
  }
}
