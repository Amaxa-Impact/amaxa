import React from 'react'
import { api } from '~/trpc/server'

export default async function Page() {
  const data = await api.projects.findAll({})

  return (
    <div>
      {
        data.length === 0 && (
          <div className='flex flex-col justify-center items-center h-screen text-5xl text-gray-500 font-bold'>
            None Avaliable
          </div>
        )
      }
      {data.map((project) => (
        <div>
          {project.name}
        </div>
      ))}
    </div>
  )
}

