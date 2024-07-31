//@ts-nocheck
"use client"

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@amaxa/ui/card"
import Link from "next/link"
import { Input } from "@amaxa/ui/input"
import { Badge } from "@amaxa/ui/badge"
import { useState, useMemo } from "react"

export default function Guides() {
  const [search, setSearch] = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const actionGuides = [
    {
      id: 1,
      title: "Test Action Guide 1",
      description:
        "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
      tags: ["Fundraising"],
      embedId: "Opening-Guide-Copy-7acb2eb37957405694b19afa43ae7b9c"
    },
    {
      id: 2,
      title: "Test Action Guide 2",
      description:
        "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.",
      tags: ["Impact Outreach"],
      embedId: "Opening-Guide-Copy-7acb2eb37957405694b19afa43ae7b9c"
    },
  ]

  const filteredGuides = useMemo(() => {
    return actionGuides.filter((guide) => {
      const titleMatch = guide.title.toLowerCase().includes(search.toLowerCase())
      const tagMatch = selectedTags.every((tag) => guide.tags.includes(tag))
      return titleMatch && tagMatch
    })
  }, [search, selectedTags])
  const handleSearch = (e: any) => {
    setSearch(e.target.value)
  }
  const handleTagClick = (tag: never) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }
  const allTags = useMemo(() => {
    return [...new Set(actionGuides.flatMap((guide) => guide.tags))]
  }, [actionGuides])

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Action Guides</h1>
      <div className="mb-6">
        <Input
          placeholder="Search action guides..."
          value={search}
          onChange={handleSearch}
          className="w-full max-w-md"
        />
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Filter by Skill</h2>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag: string) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "secondary"}
              onClick={() => handleTagClick(tag)}
              className="cursor-pointer"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide) => (
          <Link href={`/guide/${guide.id}`} key={guide.id}>
            <Card >
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
          </Link>
        ))}
      </div>
    </div>
  )
}
