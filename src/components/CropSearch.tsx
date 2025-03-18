
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { fetchCropCategories } from "@/services/api";

interface CropSearchProps {
  onSearch: (query: string) => void;
}

const CropSearch: React.FC<CropSearchProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const cropCategories = await fetchCropCategories();
        setCategories(cropCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for crops..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit">Search</Button>
      </form>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading categories...</p>
        ) : (
          categories.slice(0, 10).map((category) => (
            <Button
              key={category}
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery(category);
                onSearch(category);
              }}
              className="text-xs"
            >
              {category}
            </Button>
          ))
        )}
      </div>
    </div>
  );
};

export default CropSearch;
