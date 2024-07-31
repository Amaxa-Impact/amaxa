//@ts-nocheck
"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@amaxa/ui/card"
import { Input } from "@amaxa/ui/input"
import { Badge } from "lucide-react"
import { useState, useMemo } from "react"


export const TagToggle = ({
  tag,
  handleTagClick,
}: {
  tag: string
  handleTagClick: (tag: string) => void
}) => {
  return (
    <Badge
      key={tag}
      onClick={() => handleTagClick(tag)}
      className="cursor-pointer"
    >
      {tag}
    </Badge>
  )

}

export default function Component() {

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Action Guides</h1>
      <div className="mb-6">
        <Input
          placeholder="Search action guides..."
          className="w-full max-w-md"
        />
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Filter by Skill</h2>
        <div className="flex flex-wrap gap-2">
          {/* Tags */}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
        ))}
      </div>
    </div>
  )
}

export const GuideCard = () => {
  return (
    <Card key={guide.id}>
      <CardHeader>
        <CardTitle>{guide.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{guide.description}</p>
      </CardContent>
      <CardFooter>
        <div className="flex flex-wrap gap-2">
          {guide.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}
