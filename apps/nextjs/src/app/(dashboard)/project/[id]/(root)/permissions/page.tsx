import { Avatar, AvatarImage, AvatarFallback } from '@amaxa/ui/avatar'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@amaxa/ui/table'
import { Button } from '@amaxa/ui/button'
import {
  MoreVertical,
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@amaxa/ui/card'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@amaxa/ui/dropdown-menu'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@amaxa/ui/select'
import React from 'react'
import PermissionsModal from './_components/permissions-dialog'

export default function Page({
  params
}: {
  params: {
    id: string
  }
}) {
  const { id } = params
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 bg-muted/40">
      <div className="max-w-6xl w-full mx-auto flex items-center gap-4">
        <h1 className="text-2xl font-bold">Permissions</h1>
        <Button>Invite User</Button>
      </div>
      <div className="max-w-6xl w-full mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Project Collaborators</CardTitle>
            <CardDescription>Manage user permissions for this project.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">Olivia Davis</div>
                        <div className="text-sm text-muted-foreground">olivia@example.com</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select defaultValue="editor">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <PermissionsModal projectId={id} userId={"TBD"} defaultPermissions={["TBD"]} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreVertical className="w-4 h-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>IN</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">Isabella Nguyen</div>
                        <div className="text-sm text-muted-foreground">isabella@example.com</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Permissions
                    </Button>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreVertical className="w-4 h-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>SD</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">Sofia Davis</div>
                        <div className="text-sm text-muted-foreground">sofia@example.com</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select defaultValue="admin">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Permissions
                    </Button>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreVertical className="w-4 h-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

