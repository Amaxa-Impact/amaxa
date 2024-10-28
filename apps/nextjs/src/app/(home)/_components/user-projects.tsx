import { getUserProjects } from "~/components/navbar/switcher";
import ProjectGrid from "./project-grid";

export default async function UserProjects({
  userId,
  userStatus,
}: {
  userId: string;
  userStatus: string;
}) {
  const usersProjects = await getUserProjects(userId);

  if (userStatus === "Pending" || userStatus === "Unverified") {
    return (
      <div className="col-span-1 row-span-1 flex h-[300px] w-[300px] flex-col items-center justify-center border-dashed bg-secondary/10">
        <p>
          {userStatus === "Pending"
            ? "Your account is pending approval, please wait for the admin to approve your account"
            : "Your account is unverified, please wait till we verify your account to access the platform"}
        </p>
      </div>
    );
  }

  return <ProjectGrid projects={usersProjects} />;
}
