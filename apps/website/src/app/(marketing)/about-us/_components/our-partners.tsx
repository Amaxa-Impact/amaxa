/** eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";

import { Badge } from "@amaxa/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@amaxa/ui/card";

export function NonProfits() {
  const MotionCard = motion(Card);

  return (
    <div className="py-16">
      <h2 className="mb-6 text-center text-5xl font-bold">
        Our Impact and Initiatives
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MotionCard
          className="overflow-hidden md:col-span-2"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardHeader>
            <CardTitle>High-Impact Partnerships</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <p>
              Our projects are high-impact, innovative, and community-driven. We
              have partnered with nonprofits in Palestine, Liberia, and Uganda
              whose community-founded solutions are innovative in their fields,
              such as ISNAD Community Center's approach to community-based
              learning, the first in its area, and the Nyaka School's holistic
              approach to supporting AIDS-affected communities.
            </p>
          </CardContent>
        </MotionCard>

        <MotionCard
          className="overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CardContent className="p-0">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-oVYz5xVvcSGcpf0CkJJjXxQeujbigL.png"
              alt="Community program in action"
              className="h-full w-full object-cover"
            />
          </CardContent>
        </MotionCard>

        <MotionCard
          className="overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <CardContent className="p-0">
            <img
              src="
              https://s3-alpha-sig.figma.com/img/b09f/aa54/32d9abedbc41a2989d89a49e62501e47?Expires=1728259200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=odZRgAHajwsdBL1u1WjgwrUgjqOYf6Sd9dpenHhh7y7dfH91xr8OeRCZsiRRJCKennyKorwVk2HiXJV9rgWyQEXja2S790-wANx2qzRfmYvO-EA2Qaq2eB9~YG4okBeRzfB2ajwgrA4-Ym~gGUaMq4Ib9LHzPsZCnDanaIbXvK2hIGjnU6GoDJMdC~Lb3BxiDl57pUghl~5JrpkGdBpg2n3Bg8Z5f-nLljpLqpD0DGv8T6ZLGeb-s8LB4oQW5jBzeT3GE-6XVEDlhlx7KBxr7nOfFBJ~FBUPuqg9ew9EDgfAhPIUVKz51Z6zATLbNTm5pHXfO2Cc~Ncpd3BFmuZ2Dw__
              "
              alt="Placeholder for second image"
              className="h-full w-full object-cover"
            />
          </CardContent>
        </MotionCard>

        <MotionCard
          className="overflow-hidden md:col-span-2"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <CardHeader>
            <CardTitle>New Initiatives for 2024</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert">
            <p>
              Where we spotted gaps in high-impact projects that our members
              wanted to work on, we created our own. Led by Head of Programs
              Alexi Jones, we have launched three new initiatives in 2024,
              focusing on mental health, feminism, and LBGTQ+ representation.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>Mental Health</Badge>
              <Badge>Feminism</Badge>
              <Badge>LGBTQ+ Representation</Badge>
            </div>
          </CardContent>
        </MotionCard>
      </div>
    </div>
  );
}
