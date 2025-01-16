import { getUserProjects } from "~/components/navbar/switcher";
import ProjectGrid from "./project-grid";
import { checkAuth } from "~/lib/auth";

export default async function UserProjects() {
  const session = await checkAuth();
  const usersProjects = await getUserProjects(session.user.id);
  if (session.user.status === "Pending" || session.user.id === "Unverified") {
    return (
      <div className="col-span-1 row-span-1 flex h-[300px] w-[300px] flex-col items-center justify-center border-dashed bg-secondary/10">
        <p>
          {session.user.id === "Pending"
            ? "Your account is pending approval, please wait for the admin to approve your account"
            : "Your account is unverified, please wait till we verify your account to access the platform"}
        </p>
      </div>
    );
  }

  return <ProjectGrid projects={usersProjects} />;
}
