import React from "react";
import { motion } from "framer-motion";

import { cn } from "@amaxa/ui";

import { PersonCard } from "./_components/person-card";

export const ProjectContentShell = (props: {
  header?: {
    titile: string;
  };
  content: string[];
  people?: {
    name: string;
    role: string;
    image: string;
  }[];
  images?: string[];
}) => {
  return (
    <div>
      <div className="items-start">
        <div className="container px-4 md:px-6">
          {props.header && (
            <h1 className="text-5xl font-bold">{props.header.titile}</h1>
          )}
          {props.images && (
            <div className="relative mx-auto grid h-[300px] w-full max-w-7xl grid-cols-1 gap-4 p-10 md:grid-cols-3">
              {props.images.map((image) => (
                <ImageComponent image={image} />
              ))}
            </div>
          )}
          <div className="grid w-full gap-8">
            {props.content.map((content) => (
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    {content}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {props.people && (
            <div className="py-6">
              <h2 className="py-3 text-3xl font-bold">Meet the Team</h2>
              <div className="grid grid-cols-3 grid-rows-3">
                {props.people.map((person) => (
                  <PersonCard
                    name={person.name}
                    role={person.role}
                    image={person.image}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ImageComponent = ({ image }: { image: string }) => {
  return (
    <motion.img
      layoutId={`image-${image}-image`}
      src={image}
      height="500"
      width="500"
      className={cn(
        "absolute inset-0 h-full w-full object-cover object-top transition duration-200",
      )}
      alt="thumbnail"
    />
  );
};
