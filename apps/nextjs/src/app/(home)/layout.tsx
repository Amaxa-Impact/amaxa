import React from 'react'

export default function Layout({
  children
}: {
  children?: React.ReactNode
}) {
  return (
    <div>

      <main className='flex flex-col container'>
        {children}
      </main>
    </div>
  )
}

