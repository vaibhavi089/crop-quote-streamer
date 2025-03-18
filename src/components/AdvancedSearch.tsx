
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Wheat } from "lucide-react";
import { fetchCropCategories, fetchMarkets } from "@/services/api";
import { SearchParams } from "@/types";

interface AdvancedSearchProps {
  onSearch: (params: SearchParams) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch }) => {
  const [cropQuery, setCropQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [suggestedCrops, setSuggestedCrops] = useState<string[]>([]);
  const [suggestedCities, setSuggestedCities] = useState<string[]>([]);
  const [isLoadingCrops, setIsLoadingCrops] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      setIsLoadingCrops(true);
      setIsLoadingCities(true);
      try {
        const crops = await fetchCropCategories();
        const markets = await fetchMarkets();
        setSuggestedCrops(crops);
        setSuggestedCities(markets);
      } catch (error) {
        console.error("Error loading options:", error);
      } finally {
        setIsLoadingCrops(false);
        setIsLoadingCities(false);
      }
    };

    loadOptions();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: SearchParams = {};
    
    if (cropQuery) params.crop = cropQuery;
    if (cityQuery) params.city = cityQuery;
    
    onSearch(params);
  };

  const handleCropSelect = (crop: string) => {
    setCropQuery(crop);
  };

  const handleCitySelect = (city: string) => {
    setCityQuery(city);
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-green-600" />
              <label htmlFor="city" className="text-sm font-medium">City/Market</label>
            </div>
            <div className="relative">
              <Input
                id="city"
                type="text"
                placeholder="Search by city or market..."
                value={cityQuery}
                onChange={(e) => setCityQuery(e.target.value)}
                className="pl-8"
              />
              <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Wheat className="w-4 h-4 mr-2 text-green-600" />
              <label htmlFor="crop" className="text-sm font-medium">Crop Type</label>
            </div>
            <div className="relative">
              <Input
                id="crop"
                type="text"
                placeholder="Search for crops..."
                value={cropQuery}
                onChange={(e) => setCropQuery(e.target.value)}
                className="pl-8"
              />
              <Wheat className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
        
        <Button type="submit" className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Suggested Cities:</p>
          <div className="flex flex-wrap gap-2">
            {isLoadingCities ? (
              <p className="text-sm text-muted-foreground">Loading cities...</p>
            ) : (
              suggestedCities.slice(0, 6).map((city) => (
                <Button
                  key={city}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCitySelect(city)}
                  className="text-xs"
                >
                  {city}
                </Button>
              ))
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Popular Crops:</p>
          <div className="flex flex-wrap gap-2">
            {isLoadingCrops ? (
              <p className="text-sm text-muted-foreground">Loading crops...</p>
            ) : (
              suggestedCrops.slice(0, 6).map((crop) => (
                <Button
                  key={crop}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCropSelect(crop)}
                  className="text-xs"
                >
                  {crop}
                </Button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
