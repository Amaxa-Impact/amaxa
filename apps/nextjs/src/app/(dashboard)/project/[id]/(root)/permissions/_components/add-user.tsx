import { api } from "~/trpc/server";
import AddUserForm from "./add-user-form";


export async function AddUser() {
  const userMap = api.projects

  return (
    <div>
      <AddUserForm userMap="tbd" />
    </div>
  )
}
