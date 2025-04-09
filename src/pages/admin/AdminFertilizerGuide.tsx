
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FertilizerForm from "@/components/admin/fertilizer/FertilizerForm";
import FertilizerList from "@/components/admin/fertilizer/FertilizerList";

const AdminFertilizerGuide = () => {
  const [refreshList, setRefreshList] = useState(0);

  const handleFormSuccess = () => {
    // Increment refresh counter to trigger list refresh
    setRefreshList(prev => prev + 1);
  };

  return (
    <AdminLayout title="Fertilizer Guide Management">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Add Fertilizer Products</CardTitle>
          </CardHeader>
          <CardContent>
            <FertilizerForm onSuccess={handleFormSuccess} />
          </CardContent>
        </Card>

        <FertilizerList key={refreshList} />
      </div>
    </AdminLayout>
  );
};

export default AdminFertilizerGuide;
