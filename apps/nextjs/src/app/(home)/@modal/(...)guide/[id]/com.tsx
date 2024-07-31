import React from 'react'
import "react-notion/src/styles.css";
import { NotionRenderer } from 'react-notion'

export const Com = async (props: {
  id: string
}) => {
  const data = await fetch(
    `https://notion-api.splitbee.io/v1/page/${props.id}`
  ).then(res => res.json())

  return (
    <div>
      <NotionRenderer
        blockMap={data}
      />
    </div>
  )
}
