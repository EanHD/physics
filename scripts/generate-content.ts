import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface Resource {
  id: string
  name: string
  description: string
  link: string
  category: string
}

// Parse the study_resources.md file and create individual module files
export function generateModulesFromResources() {
  const resourcesPath = path.join(process.cwd(), 'physics_study', 'study_resources.md')
  const contentDir = path.join(process.cwd(), 'content', 'modules')
  
  console.log('Current working directory:', process.cwd())
  console.log('Looking for resources at:', resourcesPath)
  console.log('Resources file exists:', fs.existsSync(resourcesPath))
  
  if (!fs.existsSync(resourcesPath)) {
    console.log('study_resources.md not found, skipping module generation')
    return
  }

  const resourcesContent = fs.readFileSync(resourcesPath, 'utf-8')
  const sections = resourcesContent.split(/^##\s+/m).slice(1) // Remove intro section
  
  const modules: any[] = []
  const resources: Resource[] = []

  sections.forEach((section, index) => {
    const lines = section.trim().split('\n')
    const category = lines[0].trim()
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')
    
    // Extract resources from this section
    const resourcePattern = /\*\*([^*]+)\*\*\s*–\s*([^*]+?)\s*\*\*Link:\*\*\s*<([^>]+)>/g
    let match
    
    while ((match = resourcePattern.exec(section)) !== null) {
      const resourceId = `${categorySlug}-${resources.length + 1}`
      resources.push({
        id: resourceId,
        name: match[1].trim(),
        description: match[2].trim(),
        link: match[3].trim(),
        category: categorySlug
      })
    }

    // Create a module for each category
    const moduleId = `${String(index + 1).padStart(2, '0')}-${categorySlug}`
    const module = {
      id: moduleId,
      title: category,
      summary: `Introduction to ${category.toLowerCase()} using curated free resources`,
      estimated_minutes: 120,
      prerequisites: index > 0 ? [`${String(index).padStart(2, '0')}-${sections[index-1].trim().split('\n')[0].toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`] : [],
      resources: resources.filter(r => r.category === categorySlug).map(r => r.id),
      tags: [categorySlug],
      difficulty: index < 2 ? 'beginner' : index < 4 ? 'intermediate' : 'advanced'
    }
    
    modules.push(module)

    // Create markdown content
    const content = `
# ${category}

This module covers ${category.toLowerCase()} using carefully selected free resources. Work through these materials at your own pace.

## Learning Objectives

After completing this module, you will:
- Understand fundamental concepts in ${category.toLowerCase()}
- Be able to apply these concepts to solve problems
- Have a solid foundation for more advanced topics

## Resources

${resources.filter(r => r.category === categorySlug).map(r => 
  `### ${r.name}\n\n${r.description}\n\n[Access Resource](${r.link})`
).join('\n\n')}

## Study Tips

1. Read through the provided resources carefully
2. Take notes on key concepts
3. Work through example problems
4. Complete the quiz when you feel ready
5. Review regularly using spaced repetition

## Next Steps

${module.prerequisites.length > 0 ? 
  `Make sure you've completed the prerequisite modules before proceeding.` :
  `This is a foundational module - take your time to understand the concepts thoroughly.`
}
`

    const frontmatter = matter.stringify(content, module)
    
    // Write module file
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true })
    }
    
    fs.writeFileSync(path.join(contentDir, `${moduleId}.md`), frontmatter)
  })

  // Write resources.json for the app to use
  fs.writeFileSync(
    path.join(process.cwd(), 'content', 'resources.json'),
    JSON.stringify(resources, null, 2)
  )

  console.log(`Generated ${modules.length} modules and ${resources.length} resources`)
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateModulesFromResources()
}