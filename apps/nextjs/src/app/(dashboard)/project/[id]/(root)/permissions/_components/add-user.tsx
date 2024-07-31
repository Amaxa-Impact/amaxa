import { api } from "~/trpc/server";
import AddUserForm from "./add-user-form";

export async function AddUser() {
  const data = await api.users.usersNotInProject();

  const userMap = data.map((user) => {
    return {
      value: user.id,
      label: user.name ?? "No Name User",
    };
  });

  return (
    <div>
      <AddUserForm userMap={userMap} />
    </div>
  );
}
