import { Card, CardContent, CardFooter } from '@amaxa/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react'
import { api } from '~/trpc/server'
import CreateProjectDialog from './_components/create-project-dialog';
import NoneAvaliable from '~/components/NoneAvaliable';

export default async function Page() {
  const data = await api.projects.findAll({})

  return (
    <div className='flex flex-col w-full'>
      {
        data.length === 0 && (
          <NoneAvaliable text="None Avaliable" actionString='Create a Partner' actionButton={<CreateProjectDialog />} />
        )
      }
      {
        data.map((project) => {
          return (
            <Link key={project.id} href={`/project/${project.id}`}>
              <Card className=" col-span-1 row-span-1 bg-primary-foreground transition-transform duration-200 hover:scale-105 hover:bg-muted">
                <CardContent className="py-5">
                  <Image
                    src={""}
                    width={1000}
                    height={500}
                    alt={String(project.id)}
                  />
                </CardContent>
                <CardFooter className="justify-center text-center font-bold md:text-2xl">
                  {project.name}
                </CardFooter>
              </Card>
            </Link>
          );
        })
      }
    </div >
  )
}

