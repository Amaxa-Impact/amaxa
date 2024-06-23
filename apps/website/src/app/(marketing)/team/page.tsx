import React from 'react'
import Image from 'next/image'

const members = [
  {
    name: 'Lauren McMillen',
    title: 'Founder & CEO',
    image: '/lauren-headshot.png',
    role: "Founder & CEO"
  },
  {
    name: 'Lauren McMillen',
    title: 'Founder & CEO',
    image: '/lauren-headshot.png',
    role: "Founder & CEO"
  },
  {
    name: 'Lauren McMillen',
    title: 'Founder & CEO',
    image: '/lauren-headshot.png',
    role: "Founder & CEO"
  },
]

export default function Page() {
  return (
    <div>
      <h1 className='text-5xl font-bold'>
        Meet The Team!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10">
        {
          members.map((member, index) => (
            <ProjectCard key={index} {...member} />
          ))
        }
      </div>
    </div>
  )
}

type MemberCardProps = {
  name: string
  image: string
  role: string
}

const ProjectCard = ({
  name,
  role,
  image
}: MemberCardProps) => {
  return (
    <div className="flex flex-col lg:border-r py-10 relative group lg:border-l min-h-[400px] lg:border-b dark:border-neutral-800">
      <div className="opacity-0 group-hover:opacity-100 transition duration-200 group absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none"></div>
      <div className="w-full">
        <Image src={image} fill={true} className='w-full' alt="Illustration 1" />
      </div>

      <span className="text-white font-bold absolute bottom-0 left-0 p-4" style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)' }}>
        {name} • {role}
      </span>
    </div>
  )

}

