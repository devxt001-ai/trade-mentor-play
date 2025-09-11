import { Dashboard } from "@/pages/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";

const Index = () => {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
};

export default Index;
