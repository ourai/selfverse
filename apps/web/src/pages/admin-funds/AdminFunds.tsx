import { updateAdmin } from '../../services/funds';
import AdminOnly from "../../components/admin-only";

function AdminFunds() {
  return (
    <AdminOnly updateAdmin={updateAdmin} busy={false}></AdminOnly>
  );
}

export default AdminFunds;
