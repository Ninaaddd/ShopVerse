//src/components/admin-view/feature-link-dialog.jsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { WatchIcon, X } from "lucide-react";
import { Badge } from "../ui/badge";
import NikeIcon from '../../assets/nike.png'
import AdiIcon from '../../assets/adidas.png'
import PumaIcon from '../../assets/puma.png'
import LevisIcon from '../../assets/levis.png'
import ZaraIcon from '../../assets/zara.png'
import HMIcon from '../../assets/h&m.png'
import ManIcon from '../../assets/man.png'
import WomanIcon from '../../assets/woman.png'
import KidsIcon from '../../assets/boy.png'
import FootIcon from '../../assets/sneakers.png'

const categoryOptions = [
  { id: "men", label: "Men", icon: ManIcon },
  { id: "women", label: "Women", icon: WomanIcon },
  { id: "kids", label: "Kids", icon: KidsIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: FootIcon },
];

const brandOptions = [
  { id: "nike", label: "Nike", icon: NikeIcon },
  { id: "adidas", label: "Adidas", icon: AdiIcon },
  { id: "puma", label: "Puma", icon: PumaIcon },
  { id: "levi", label: "Levi's", icon: LevisIcon },
  { id: "zara", label: "Zara", icon: ZaraIcon },
  { id: "h&m", label: "H&M", icon: HMIcon },
];

function FeatureLinkDialog({ open, setOpen, imageUrl, onSave }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");

  const handleAddCategory = (categoryId) => {
    if (categoryId && !selectedCategories.includes(categoryId)) {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleRemoveCategory = (categoryId) => {
    setSelectedCategories(selectedCategories.filter(cat => cat !== categoryId));
  };

  const handleSave = () => {
    onSave({
      image: imageUrl,
      categories: selectedCategories,
      brand: selectedBrand || null,
    });
    // Reset state
    setSelectedCategories([]);
    setSelectedBrand("");
    setOpen(false);
  };

  const handleCancel = () => {
    setSelectedCategories([]);
    setSelectedBrand("");
    setOpen(false);
  };

  const isValid = () => {
    return selectedCategories.length > 0 || selectedBrand;
  };

  // Get categories that aren't already selected
  const availableCategories = categoryOptions.filter(
    cat => !selectedCategories.includes(cat.id)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure Feature Image</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Image Preview */}
          <div className="w-full">
            <img
              src={imageUrl}
              alt="Feature preview"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          {/* Categories Selection (Multiple) */}
          <div className="space-y-2">
            <Label>Categories (Multiple Selection)</Label>
            
            {/* Selected Categories */}
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedCategories.map((catId) => {
                  const category = categoryOptions.find(c => c.id === catId);
                  return (
                    <Badge 
                      key={catId} 
                      variant="secondary"
                      className="flex items-center gap-1 px-3 py-1"
                    >
                      {category?.label}
                      <X 
                        className="h-3 w-3 cursor-pointer hover:text-red-500" 
                        onClick={() => handleRemoveCategory(catId)}
                      />
                    </Badge>
                  );
                })}
              </div>
            )}

            {/* Category Dropdown */}
            {availableCategories.length > 0 && (
              <Select onValueChange={handleAddCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Add a category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Brand Selection (Single) */}
          <div className="space-y-2">
            <Label>Brand (Single Selection - Optional)</Label>
            <div className="flex gap-2">
              <Select value={selectedBrand || "none"} onValueChange={(value) => setSelectedBrand(value === "none" ? "" : value)}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose a brand (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {brandOptions.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedBrand && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBrand("")}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Validation Message */}
          {!isValid() && (
            <p className="text-sm text-red-500">
              At least one category or brand must be selected
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!isValid()}
            >
              Save Feature Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FeatureLinkDialog;