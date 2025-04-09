
import AdminLayout from "@/components/admin/AdminLayout";
import ChatbotDataManager from "@/components/admin/ChatbotDataManager";

const AdminChatbotData = () => {
  return (
    <AdminLayout title="Chatbot Knowledge Management">
      <ChatbotDataManager />
    </AdminLayout>
  );
};

export default AdminChatbotData;
