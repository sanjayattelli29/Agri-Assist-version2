
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PesticideForm from "@/components/admin/pesticide/PesticideForm";
import PesticideList from "@/components/admin/pesticide/PesticideList";

const AdminPesticideGuide = () => {
  const [refreshList, setRefreshList] = useState(0);

  const handleFormSuccess = () => {
    // Increment refresh counter to trigger list refresh
    setRefreshList(prev => prev + 1);
  };

  return (
    <AdminLayout title="Pesticide Guide Management">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Add Pesticide Products</CardTitle>
          </CardHeader>
          <CardContent>
            <PesticideForm onSuccess={handleFormSuccess} />
          </CardContent>
        </Card>

        <PesticideList key={refreshList} />
      </div>
    </AdminLayout>
  );
};

export default AdminPesticideGuide;
