import ProductImageUpload from "@/components/admin-view/image-upload";
import FeatureLinkDialog from "@/components/admin-view/feature-link-dialog";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages, deleteFeatureImage } from "@/store/common-slice";
import { Trash2, Link as LinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  // When image is uploaded, show the link configuration dialog
  useEffect(() => {
    if (uploadedImageUrl && !showLinkDialog) {
      setShowLinkDialog(true);
    }
  }, [uploadedImageUrl]);

  function handleSaveFeatureImage({ image, linkType, linkValue }) {
    dispatch(addFeatureImage({ image, linkType, linkValue })).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
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
        setOpen={setShowLinkDialog}
        imageUrl={uploadedImageUrl}
        onSave={handleSaveFeatureImage}
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
                
                {/* Link Badge */}
                {featureImgItem.linkType !== "none" && (
                  <Badge className="absolute top-2 left-2 bg-blue-500">
                    <LinkIcon className="h-3 w-3 mr-1" />
                    {featureImgItem.linkType}: {featureImgItem.linkValue}
                  </Badge>
                )}
                
                {/* Delete Button */}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default AdminDashboard;