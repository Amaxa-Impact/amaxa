import { notFound } from 'next/navigation'
import React from 'react'
import { Com } from '../com'
import { db } from '@amaxa/db/client'

export default async function Page(props: {
  params: {
    id: string
  }
}) {

  const { id } = props.params
  const data = await db.query.guides.findFirst({
    where: (actionGuides, { eq }) => eq(actionGuides.id, parseInt(id))
  })

  if (!data) return notFound()

  return (
    <div>
      <Com id={data.embedId!} />

    </div>
  )
}
