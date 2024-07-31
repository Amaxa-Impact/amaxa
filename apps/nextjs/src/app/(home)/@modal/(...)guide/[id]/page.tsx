import React from 'react'
import { Com } from './com'

export default async function Page(props: {
  params: {
    id: string
  }
}) {
  const { id } = props.params

  return (
    <div>
      <Com id={id} />
    </div>
  )
}

