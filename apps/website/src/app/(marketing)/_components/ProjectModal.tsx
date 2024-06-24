import { CalendarIcon, UsersIcon } from "lucide-react";
import React from "react";

export default function Component({ id }: { id: string }) {

  const data = {
    id
  };

  if (!data) {
    return <h1>no such data exists</h1>;
  }

  return (
    <div className="no-scrollbar h-[900px] w-[1000px] overflow-y-auto rounded-lg bg-white">
      <div className="relative bg-gray-50 py-6 lg:py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Clean Water Initiative
                </h1>
                <p className="max-w-[500px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed "></p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <UsersIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    1000 Beneficiaries
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Started in 2023</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="grid gap-4 text-center">
                <div className="text-3xl font-bold">75%</div>
                <div className="text-sm font-medium text-gray-500 ">
                  Progress to Goal
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-gray-50 via-gray-50 to-gray-50 " />
      </div>
      <div className="py-12 lg:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  The Challenge
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ">
                  Many communities around the world lack access to clean water,
                  leading to health issues and limiting opportunities for growth
                  and development. Our initiative aims to address this challenge
                  by implementing sustainable solutions for providing clean and
                  safe drinking water to those in need.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Our Approach
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ">
                  We work with local partners and communities to identify the
                  most effective and sustainable solutions. This includes
                  implementing water purification systems, building
                  infrastructure for water access, and providing training on
                  maintenance and management. We focus on long-term impact,
                  ensuring that the solutions we put in place continue to
                  benefit the community for years to come.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-12 lg:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Impact
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ">
                  Access to clean water has a transformative impact on
                  communities. It improves health by reducing the risk of water-
                  borne diseases, allows children to attend school instead of
                  spending hours collecting water, and creates opportunities for
                  economic and social development. With the support of our
                  donors and partners, we are making a tangible difference in
                  the lives of the communities we serve.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Get Involved
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ">
                  You can be part of the solution. Your support helps us
                  continue our work and expand our impact. Whether it's through
                  donations, volunteering, or spreading the word about our
                  cause, every contribution makes a difference. Together, we can
                  bring clean water to more communities and create a brighter
                  future for all.
                </p>
              </div>
              <div className="flex justify-center"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

