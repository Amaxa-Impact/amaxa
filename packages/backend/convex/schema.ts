import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    description: v.string(),
  }),

  tasks: defineTable({
    projectId: v.id('projects'),
    
    type: v.string(),
    
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    
    data: v.object({
      label: v.string(),
      description: v.optional(v.string()),
      status: v.optional(v.union(
        v.literal('todo'),
        v.literal('in_progress'),
        v.literal('completed'),
        v.literal('blocked')
      )),
      assignedTo: v.optional(v.string()),
      dueDate: v.optional(v.number()),
      priority: v.optional(v.union(
        v.literal('low'),
        v.literal('medium'),
        v.literal('high')
      )),
    }),
    
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    
    style: v.optional(v.object({
      backgroundColor: v.optional(v.string()),
      borderColor: v.optional(v.string()),
      color: v.optional(v.string()),
    })),
    
    selected: v.optional(v.boolean()),
    dragging: v.optional(v.boolean()),
  })
    .index('by_project', ['projectId'])
    .index('by_project_and_assignedTo', ['projectId', 'data.assignedTo']),

  edges: defineTable({
    projectId: v.id('projects'),
    
    source: v.id('tasks'),
    target: v.id('tasks'),
    
    type: v.string(),
    
    sourceHandle: v.optional(v.string()),
    targetHandle: v.optional(v.string()),
    
    label: v.optional(v.string()),
    
    style: v.optional(v.object({
      stroke: v.optional(v.string()),
      strokeWidth: v.optional(v.number()),
    })),
    
    animated: v.optional(v.boolean()),
    
    data: v.optional(v.object({})),
  })
    .index('by_project', ['projectId'])
    .index('by_source', ['source'])
    .index('by_target', ['target'])
    .index('by_project_and_source', ['projectId', 'source']),

  userToProject: defineTable({
    userId: v.string(),
    projectId: v.id('projects'),
    role: v.union(
      v.literal('coach'),
      v.literal('member')
    ),
  })
    .index('by_userId', ['userId'])
    .index('by_projectId', ['projectId'])
    .index('by_userId_and_projectId', ['userId', 'projectId'])
    .index('by_projectId_and_role', ['projectId', 'role']),
});
