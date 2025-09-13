import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Module, ModuleContent } from '../models/types'

const contentDir = path.join(process.cwd(), 'content', 'modules')

export function getAllModules(): Module[] {
  if (!fs.existsSync(contentDir)) return []
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'))
  return files.map(f => {
    const body = fs.readFileSync(path.join(contentDir, f), 'utf-8')
    const fm = matter(body)
    const data = fm.data as any
    return {
      id: data.id || f.replace(/\.md$/, ''),
      title: data.title || data.id || f.replace(/\.md$/, ''),
      summary: data.summary || '',
      estimated_minutes: data.estimated_minutes || 0,
      prerequisites: data.prerequisites || [],
      resources: data.resources || [],
      tags: data.tags || [],
      difficulty: data.difficulty || 'beginner'
    } as Module
  })
}

export function getModuleContent(moduleId: string): ModuleContent | null {
  const file = path.join(contentDir, `${moduleId}.md`)
  if (!fs.existsSync(file)) return null
  const body = fs.readFileSync(file, 'utf-8')
  const fm = matter(body)
  const data = fm.data as any
  return {
    id: data.id || moduleId,
    content: fm.content || '',
    quiz: null,
    resources: []
  }
}
