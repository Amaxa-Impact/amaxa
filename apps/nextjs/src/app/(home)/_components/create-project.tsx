import React from 'react'
import { checkAuth } from '~/lib/auth';

export const CreateProject = async () => {
  const session = await checkAuth();
  return (
    <div>

      <h3 className="text-4xl font-semibold">Your Projects</h3>
      {session.user.role === "Admin" && <CreateProject />}
    </div>
  )
}
