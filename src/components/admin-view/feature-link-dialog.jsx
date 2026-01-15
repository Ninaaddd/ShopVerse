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
import { WatchIcon } from "lucide-react";
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

const categories = [
  { id: "men", label: "Men", icon: ManIcon },
  { id: "women", label: "Women", icon: WomanIcon },
  { id: "kids", label: "Kids", icon: KidsIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: FootIcon },
];

const brands = [
  { id: "nike", label: "Nike", icon: NikeIcon },
  { id: "adidas", label: "Adidas", icon: AdiIcon },
  { id: "puma", label: "Puma", icon: PumaIcon },
  { id: "levi", label: "Levi's", icon: LevisIcon },
  { id: "zara", label: "Zara", icon: ZaraIcon },
  { id: "h&m", label: "H&M", icon: HMIcon },
];

function FeatureLinkDialog({ open, setOpen, imageUrl, onSave }) {
  const [linkType, setLinkType] = useState("none");
  const [linkValue, setLinkValue] = useState("");

  const handleSave = () => {
    onSave({
      image: imageUrl,
      linkType,
      linkValue: linkType === "none" ? null : linkValue,
    });
    // Reset state
    setLinkType("none");
    setLinkValue("");
    setOpen(false);
  };

  const handleCancel = () => {
    setLinkType("none");
    setLinkValue("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configure Feature Image Link</DialogTitle>
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

          {/* Link Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="linkType">Link Type</Label>
            <Select value={linkType} onValueChange={setLinkType}>
              <SelectTrigger>
                <SelectValue placeholder="Select link type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Link</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="brand">Brand</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Selection */}
          {linkType === "category" && (
            <div className="space-y-2">
              <Label htmlFor="category">Select Category</Label>
              <Select value={linkValue} onValueChange={setLinkValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Brand Selection */}
          {linkType === "brand" && (
            <div className="space-y-2">
              <Label htmlFor="brand">Select Brand</Label>
              <Select value={linkValue} onValueChange={setLinkValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={linkType !== "none" && !linkValue}
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