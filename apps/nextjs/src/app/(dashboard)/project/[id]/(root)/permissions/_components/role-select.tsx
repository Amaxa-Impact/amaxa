import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@amaxa/ui/select'
import React from 'react'

export default function RoleSelect() {
  return (

    <Select defaultValue="viewer">
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Select role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="viewer">Viewer</SelectItem>
        <SelectItem value="editor">Editor</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  )
}

