import { api } from "~/trpc/server";
import AddUserForm from "./add-user-form";


export async function AddUser() {
  const data = await api.users.usersNotInProject();
  console.log(data)
  // take the result and map it to {
  //  value: id,
  //  label: name
  // }[]

  const userMap = data.map((user) => {
    return {
      value: user.id,
      label: user.name!
    }
  })

  return (
    <div>
      <AddUserForm userMap={userMap} />
    </div>
  )
}
