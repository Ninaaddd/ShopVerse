//src/components/admin-view/edit-feature-dialog.jsx
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
import { useState, useEffect, useRef } from "react";
import { WatchIcon, X, UploadCloudIcon, FileIcon, XIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import axiosInstance from "@/api/axiosInstance";
import NikeIcon from '../../assets/nike.png';
import AdiIcon from '../../assets/adidas.png';
import PumaIcon from '../../assets/puma.png';
import LevisIcon from '../../assets/levis.png';
import ZaraIcon from '../../assets/zara.png';
import HMIcon from '../../assets/h&m.png';
import ManIcon from '../../assets/man.png';
import WomanIcon from '../../assets/woman.png';
import KidsIcon from '../../assets/boy.png';
import FootIcon from '../../assets/sneakers.png';

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

function EditFeatureDialog({ open, setOpen, featureData, onSave }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [editUploadedImageUrl, setEditUploadedImageUrl] = useState("");
  const [editImageLoadingState, setEditImageLoadingState] = useState(false);
  const inputRef = useRef(null);

  // Initialize state when dialog opens
  useEffect(() => {
    if (open && featureData) {
      setSelectedCategories(featureData.categories || []);
      setSelectedBrand(featureData.brand || "");
      setEditUploadedImageUrl("");
      setEditImageFile(null);
      setEditImageLoadingState(false);
    }
  }, [open, featureData]);

  // Handle image upload independently
  async function uploadImageToCloudinary() {
    if (!editImageFile) return;

    setEditImageLoadingState(true);

    const data = new FormData();
    data.append("my_file", editImageFile);

    try {
      const response = await axiosInstance.post(
        "/api/admin/products/upload-image",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.success) {
        setEditUploadedImageUrl(
          response.data.result.url.replace(/^http:\/\//, "https://")
        );
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setEditImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (editImageFile) {
      uploadImageToCloudinary();
    }
  }, [editImageFile]);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setEditImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setEditImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setEditImageFile(null);
    setEditUploadedImageUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const handleAddCategory = (categoryId) => {
    if (categoryId && !selectedCategories.includes(categoryId)) {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleRemoveCategory = (categoryId) => {
    setSelectedCategories(selectedCategories.filter(cat => cat !== categoryId));
  };

  const handleSave = () => {
    // Use new uploaded image if available, otherwise keep the existing one
    const imageToSave = editUploadedImageUrl || featureData?.image;
    
    onSave({
      id: featureData._id,
      image: imageToSave,
      categories: selectedCategories,
      brand: selectedBrand || null,
    });
    
    handleClose();
  };

  const handleClose = () => {
    setSelectedCategories([]);
    setSelectedBrand("");
    setEditImageFile(null);
    setEditUploadedImageUrl("");
    setEditImageLoadingState(false);
    setOpen(false);
  };

  const isValid = () => {
    const hasImage = editUploadedImageUrl || featureData?.image;
    const hasSelection = selectedCategories.length > 0 || selectedBrand;
    return hasImage && hasSelection && !editImageLoadingState;
  };

  // Get categories that aren't already selected
  const availableCategories = categoryOptions.filter(
    cat => !selectedCategories.includes(cat.id)
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Feature Image</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Current Image Preview */}
          <div className="space-y-2">
            <Label>Current Feature Image</Label>
            {featureData?.image && (
              <div className="w-full">
                <img
                  src={editUploadedImageUrl || featureData.image}
                  alt="Feature preview"
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                />
                {editUploadedImageUrl && (
                  <p className="text-sm text-green-600 mt-2 font-medium">
                    ✓ New image will replace the current one
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Upload New Image */}
          <div className="space-y-2">
            <Label>Upload New Image (Optional)</Label>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed rounded-lg p-4"
            >
              <Input
                id="edit-image-upload"
                type="file"
                className="hidden"
                ref={inputRef}
                onChange={handleImageFileChange}
              />

              {!editImageFile ? (
                <Label
                  htmlFor="edit-image-upload"
                  className="flex flex-col items-center justify-center h-32 cursor-pointer"
                >
                  <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                  <span>Drag & drop or click to upload image</span>
                </Label>
              ) : editImageLoadingState ? (
                <Skeleton className="h-10 bg-gray-100" />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileIcon className="w-8 h-8 text-primary mr-2" />
                  </div>
                  <p className="text-sm font-medium">{editImageFile.name}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={handleRemoveImage}
                  >
                    <XIcon className="w-4 h-4" />
                    <span className="sr-only">Remove File</span>
                  </Button>
                </div>
              )}
            </div>
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
              {!featureData?.image && !editUploadedImageUrl 
                ? "Image is required" 
                : "At least one category or brand must be selected"}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!isValid()}
            >
              Update Feature Image
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditFeatureDialog;