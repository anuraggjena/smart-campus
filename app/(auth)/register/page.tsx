import { getAllDepartments } from "@/lib/services/departmentService";
import RegisterForm from "./registerForm";

export default async function Page() {
  const departments = await getAllDepartments();

  return <RegisterForm departments={departments} />;
}
