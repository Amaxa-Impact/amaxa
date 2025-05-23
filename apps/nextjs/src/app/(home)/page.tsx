import { Suspense } from "react";
import dynamic from "next/dynamic";

import { checkAuth } from "~/lib/auth";
import AllProjects from "./_components/all-projects";
import UserProjects from "./_components/user-projects";

const CreateProject = dynamic(
  () =>
    import("./_components/create-project-dialog").then(
      (mod) => mod.CreateProject,
    ),
  {
    loading: () => <p>Loading...</p>,
  },
);

export default async function Page() {
  const session = await checkAuth();

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="flex w-full flex-col gap-5">
        <div className="flex flex-col gap-6">
          <div className="flex flex-row justify-between gap-6">
            <h3 className="text-4xl font-semibold">Your Projects</h3>
            {session.user.role === "Admin" && <CreateProject />}
          </div>
          <Suspense fallback={<div>Loading your projects...</div>}>
            <UserProjects
              userId={session.user.id}
              userStatus={session.user.status}
            />
          </Suspense>
        </div>
        <div className="flex flex-col gap-6">
          <h3 className="text-4xl font-semibold">Explore Projects</h3>
          <Suspense fallback={<div>Loading all projects...</div>}>
            <AllProjects />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
