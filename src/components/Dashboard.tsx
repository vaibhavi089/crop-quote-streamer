
import React, { useState, useEffect } from "react";
import { fetchCropPrices, fetchCropDetails } from "@/services/api";
import AdvancedSearch from "./AdvancedSearch";
import CropPriceCard from "./CropPriceCard";
import { CropDetails, SearchParams } from "@/types";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [cropDetails, setCropDetails] = useState<CropDetails[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const prices = await fetchCropPrices();
      // Get unique commodities
      const commodities = Array.from(new Set(prices.map(item => item.commodity)));
      
      // Fetch details for top 6 commodities
      const detailsPromises = commodities.slice(0, 6).map(crop => fetchCropDetails(crop));
      const details = await Promise.all(detailsPromises);
      
      setCropDetails(details);
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast({
        title: "Error",
        description: "Failed to load crop price data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setSearchParams(params);
    
    try {
      if (params.crop) {
        const details = await fetchCropDetails(params.crop, params.city);
        if (details.priceData.length > 0) {
          setCropDetails([details]);
        } else {
          setCropDetails([]);
          toast({
            title: "No Results",
            description: `No results found for your search criteria`,
          });
        }
      } else if (params.city) {
        // If only city is provided, get all crops for that city
        const prices = await fetchCropPrices({ city: params.city });
        const commodities = Array.from(new Set(prices.map(item => item.commodity)));
        
        if (commodities.length > 0) {
          const detailsPromises = commodities.slice(0, 6).map(crop => 
            fetchCropDetails(crop, params.city)
          );
          const details = await Promise.all(detailsPromises);
          setCropDetails(details);
        } else {
          setCropDetails([]);
          toast({
            title: "No Results",
            description: `No results found for city "${params.city}"`,
          });
        }
      } else {
        // If no parameters, show initial data
        loadInitialData();
      }
    } catch (error) {
      console.error("Error searching:", error);
      toast({
        title: "Error",
        description: "Failed to search for crop prices",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <AdvancedSearch onSearch={handleSearch} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading crop prices...</span>
        </div>
      ) : cropDetails.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cropDetails.map((crop) => (
            <CropPriceCard key={crop.name} cropDetails={crop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No results found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search parameters
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
