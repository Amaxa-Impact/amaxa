import React from 'react'
import { Com } from './com'
import Modal from "@amaxa/ui/modal"

export default async function Page(props: {
  params: {
    id: string
  }
}) {
  const { id } = props.params
  console.log(id)

  return (
    <Modal>
      <Com id={id} />
    </Modal>
  )
}

