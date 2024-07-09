import React from 'react'
import { api } from '~/trpc/server'

export default async function Page() {
  const data = await api.projects.findAll({})

  return (
    <div>
      {data.map((project) => (
        <div>
          {project.name}
        </div>
      ))}
    </div>
  )
}

