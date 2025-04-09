
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import CropImageUploader from "@/components/admin/CropImageUploader";

const AdminCropImageManager = () => {
  return (
    <AdminLayout title="Crop Image Manager">
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Manage Crop Images</h2>
          <p className="text-muted-foreground mb-6">
            Upload and manage images for crop prediction. These images will be used in the crop prediction interface.
          </p>
          <CropImageUploader />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCropImageManager;
