import { Module, ModuleContent } from '../models/types'

// Static module data - replace with actual content in production
const staticModules: Module[] = [
  {
    id: '01-calculus',
    title: 'Calculus',
    summary: 'Introduction to calculus using curated free resources',
    estimated_minutes: 120,
    prerequisites: [],
    resources: ['calculus-1'],
    tags: ['calculus'],
    difficulty: 'beginner'
  },
  {
    id: '02-linear-algebra',
    title: 'Linear Algebra',
    summary: 'Introduction to linear algebra using curated free resources',
    estimated_minutes: 120,
    prerequisites: ['01-calculus'],
    resources: ['linear-algebra-2'],
    tags: ['linear-algebra'],
    difficulty: 'beginner'
  },
  {
    id: '03-differential-equations',
    title: 'Differential Equations',
    summary: 'Introduction to differential equations using curated free resources',
    estimated_minutes: 120,
    prerequisites: ['02-linear-algebra'],
    resources: ['differential-equations-3'],
    tags: ['differential-equations'],
    difficulty: 'intermediate'
  },
  {
    id: '04-classical-mechanics-and-electromagnetism',
    title: 'Classical Mechanics and Electromagnetism',
    summary: 'Introduction to classical mechanics and electromagnetism using curated free resources',
    estimated_minutes: 120,
    prerequisites: ['03-differential-equations'],
    resources: ['classical-mechanics-and-electromagnetism-4'],
    tags: ['classical-mechanics-and-electromagnetism'],
    difficulty: 'intermediate'
  },
  {
    id: '05-thermodynamics-and-statistical-mechanics',
    title: 'Thermodynamics and Statistical Mechanics',
    summary: 'Introduction to thermodynamics and statistical mechanics using curated free resources',
    estimated_minutes: 120,
    prerequisites: ['04-classical-mechanics-and-electromagnetism'],
    resources: [],
    tags: ['thermodynamics-and-statistical-mechanics'],
    difficulty: 'advanced'
  },
  {
    id: '06-modern-physics-and-quantum-mechanics',
    title: 'Modern Physics and Quantum Mechanics',
    summary: 'Introduction to modern physics and quantum mechanics using curated free resources',
    estimated_minutes: 120,
    prerequisites: ['05-thermodynamics-and-statistical-mechanics'],
    resources: ['modern-physics-and-quantum-mechanics-5'],
    tags: ['modern-physics-and-quantum-mechanics'],
    difficulty: 'advanced'
  }
]

const staticContent: Record<string, string> = {
  '01-calculus': `
# Calculus

This module covers calculus using carefully selected free resources. Work through these materials at your own pace.

## Learning Objectives

After completing this module, you will:
- Understand fundamental concepts in calculus
- Be able to apply these concepts to solve problems
- Have a solid foundation for more advanced topics

## Resources

### MIT OpenCourseWare: Single Variable Calculus (18.01SC)

A complete course covering differentiation and integration of functions of one variable. It includes lecture videos, notes, problem sets, exams and interactive applets. Ideal for self‑study and review.

[Access Resource](https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/)

## Study Tips

1. Read through the provided resources carefully
2. Take notes on key concepts
3. Work through example problems
4. Complete the quiz when you feel ready
5. Review regularly using spaced repetition

## Next Steps

This is a foundational module - take your time to understand the concepts thoroughly.
`,
  '02-linear-algebra': `
# Linear Algebra

This module covers linear algebra using carefully selected free resources. Work through these materials at your own pace.

## Learning Objectives

After completing this module, you will:
- Understand fundamental concepts in linear algebra
- Be able to apply these concepts to solve problems
- Have a solid foundation for more advanced topics

## Resources

### MIT OpenCourseWare: Linear Algebra (18.06)

An introductory course on matrix theory and linear algebra. Topics include systems of equations, vector spaces, determinants, eigenvalues, similarity and positive‑definite matrices.

[Access Resource](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/)

## Study Tips

1. Read through the provided resources carefully
2. Take notes on key concepts
3. Work through example problems
4. Complete the quiz when you feel ready
5. Review regularly using spaced repetition

## Next Steps

Make sure you've completed the prerequisite modules before proceeding.
`,
  '03-differential-equations': `
# Differential Equations

This module covers differential equations using carefully selected free resources. Work through these materials at your own pace.

## Learning Objectives

After completing this module, you will:
- Understand fundamental concepts in differential equations
- Be able to apply these concepts to solve problems
- Have a solid foundation for more advanced topics

## Resources

### Paul's Online Math Notes (Lamar University)

A comprehensive site offering free notes for Calculus I–III and Differential Equations. Each chapter includes worked examples, explanations and practice problems.

[Access Resource](https://tutorial.math.lamar.edu/)

## Study Tips

1. Read through the provided resources carefully
2. Take notes on key concepts
3. Work through example problems
4. Complete the quiz when you feel ready
5. Review regularly using spaced repetition

## Next Steps

Make sure you've completed the prerequisite modules before proceeding.
`,
  '04-classical-mechanics-and-electromagnetism': `
# Classical Mechanics and Electromagnetism

This module covers classical mechanics and electromagnetism using carefully selected free resources. Work through these materials at your own pace.

## Learning Objectives

After completing this module, you will:
- Understand fundamental concepts in classical mechanics and electromagnetism
- Be able to apply these concepts to solve problems
- Have a solid foundation for more advanced topics

## Resources

### Feynman Lectures on Physics – Volume I (Mechanics), Volume II (Electromagnetism), Volume III (Quantum Mechanics)

Caltech hosts a high‑quality online edition of Feynman, Leighton & Sands's classic lectures. The volumes are free to read online and cover mechanics, radiation, heat, electromagnetism, matter and quantum mechanics.

[Access Resource](https://www.feynmanlectures.caltech.edu/)

## Study Tips

1. Read through the provided resources carefully
2. Take notes on key concepts
3. Work through example problems
4. Complete the quiz when you feel ready
5. Review regularly using spaced repetition

## Next Steps

Make sure you've completed the prerequisite modules before proceeding.
`,
  '05-thermodynamics-and-statistical-mechanics': `
# Thermodynamics and Statistical Mechanics

This module covers thermodynamics and statistical mechanics using carefully selected free resources. Work through these materials at your own pace.

## Learning Objectives

After completing this module, you will:
- Understand fundamental concepts in thermodynamics and statistical mechanics
- Be able to apply these concepts to solve problems
- Have a solid foundation for more advanced topics

## Study Tips

1. Read through the provided resources carefully
2. Take notes on key concepts
3. Work through example problems
4. Complete the quiz when you feel ready
5. Review regularly using spaced repetition

## Next Steps

Make sure you've completed the prerequisite modules before proceeding.
`,
  '06-modern-physics-and-quantum-mechanics': `
# Modern Physics and Quantum Mechanics

This module covers modern physics and quantum mechanics using carefully selected free resources. Work through these materials at your own pace.

## Learning Objectives

After completing this module, you will:
- Understand fundamental concepts in modern physics and quantum mechanics
- Be able to apply these concepts to solve problems
- Have a solid foundation for more advanced topics

## Resources

### MIT OpenCourseWare: Quantum Physics I (8.04)

This undergraduate course introduces the experimental basis of quantum mechanics, wave mechanics and Schrödinger's equation in one and three dimensions. The course provides lecture notes, video lectures, assignments and exams.

[Access Resource](https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/)

## Study Tips

1. Read through the provided resources carefully
2. Take notes on key concepts
3. Work through example problems
4. Complete the quiz when you feel ready
5. Review regularly using spaced repetition

## Next Steps

Make sure you've completed the prerequisite modules before proceeding.
`
}

export function getAllModules(): Module[] {
  return staticModules
}

export function getModuleContent(moduleId: string): ModuleContent | null {
  const content = staticContent[moduleId]
  if (!content) return null
  
  return {
    id: moduleId,
    content,
    quiz: null,
    resources: []
  }
}
