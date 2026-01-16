function handleCancelLinkDialog() {
    setShowLinkDialog(false);
    setImageFile(null);
    setUploadedImageUrl("");
  }//src/pages/admin-view/dashboard.jsx
import ProductImageUpload from "@/components/admin-view/image-upload";
import FeatureLinkDialog from "@/components/admin-view/feature-link-dialog";
import EditFeatureDialog from "@/components/admin-view/edit-feature-dialog";
import { Button } from "@/components/ui/button";
import { 
  addFeatureImage, 
  updateFeatureImage,
  getFeatureImages, 
  deleteFeatureImage 
} from "@/store/common-slice";
import { Trash2, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  // When image is uploaded, show the link configuration dialog
  // BUT only if we're not in edit mode
  useEffect(() => {
    if (uploadedImageUrl && !showLinkDialog && !showEditDialog) {
      setShowLinkDialog(true);
    }
  }, [uploadedImageUrl, showEditDialog, showLinkDialog]);

  function handleSaveFeatureImage({ image, categories, brand }) {
    dispatch(addFeatureImage({ image, categories, brand })).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        // Clear the upload state to prevent dialog from reopening
        setImageFile(null);
        setUploadedImageUrl("");
        setShowLinkDialog(false);
      }
    });
  }

  function handleEditFeature(featureItem) {
    setEditingFeature(featureItem);
    setShowEditDialog(true);
  }

  function handleUpdateFeatureImage({ id, image, categories, brand }) {
    dispatch(updateFeatureImage({ id, image, categories, brand })).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setEditingFeature(null);
        setShowEditDialog(false);
      }
    });
  }

  function handleCloseEditDialog() {
    setShowEditDialog(false);
    setEditingFeature(null);
  }

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />
      
      <FeatureLinkDialog
        open={showLinkDialog}
        setOpen={handleCancelLinkDialog}
        imageUrl={uploadedImageUrl}
        onSave={handleSaveFeatureImage}
      />

      <EditFeatureDialog
        open={showEditDialog}
        setOpen={handleCloseEditDialog}
        featureData={editingFeature}
        onSave={handleUpdateFeatureImage}
      />

      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem) => (
              <div key={featureImgItem._id} className="relative group">
                <img
                  src={featureImgItem.image}
                  className="w-full h-[300px] object-cover rounded-lg"
                  alt="Feature"
                />
                
                {/* Info Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  {/* Categories Badge */}
                  {featureImgItem.categories && featureImgItem.categories.length > 0 && (
                    <Badge className="bg-blue-500">
                      Categories: {featureImgItem.categories.join(', ')}
                    </Badge>
                  )}
                  
                  {/* Brand Badge */}
                  {featureImgItem.brand && (
                    <Badge className="bg-purple-500">
                      Brand: {featureImgItem.brand}
                    </Badge>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => handleEditFeature(featureImgItem)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default AdminDashboard;