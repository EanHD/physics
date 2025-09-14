import { useModules } from '../hooks/useModules'
import { useProgress } from '../hooks/useProgress'
import { useSpacedRepetition } from '../hooks/useSpacedRepetition'

export const HomePage = () => {
  const { modules, loading: modulesLoading } = useModules()
  const { progress } = useProgress()
  const { dueReviews } = useSpacedRepetition()

  // Handle loading state
  if (!progress) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h1>Loading progress data...</h1>
        <p>Please wait while we load your study progress.</p>
      </div>
    )
  }

    // Calculate overall stats
  const totalModules = modules.length
  const completedModules = progress ? modules.filter(m => 
    progress.completed_modules.includes(m.id)
  ).length : 0

  // Get recommended modules (not started + some incomplete)
  const recommendedModules = progress ? modules
    .filter(m => !progress.completed_modules.includes(m.id))
    .slice(0, 4) : modules.slice(0, 4)

  return (
    <div style={{ minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>
            Welcome to Quantum Physics Study App
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>
            Master quantum mechanics with interactive lessons and spaced repetition
          </p>
          <p style={{ fontSize: '0.9rem', color: '#999', marginTop: '10px' }}>
            Debug: React is working! Modules: {modules.length}, Progress loaded: {progress ? 'Yes' : 'No'}
          </p>
        </div>

        {/* Stats Overview - Simplified */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Your Progress</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ marginBottom: '10px' }}>Overall Progress</h3>
              <p>{completedModules} of {totalModules} modules completed</p>
            </div>
            
            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ marginBottom: '10px' }}>Due Reviews</h3>
              <p>{dueReviews.length} reviews due</p>
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Available Modules</h2>
          {modulesLoading ? (
            <p>Loading modules...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {recommendedModules.map(module => (
                <div 
                  key={module.id}
                  style={{ 
                    padding: '20px', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    backgroundColor: '#fff',
                    cursor: 'pointer'
                  }}
                  onClick={() => window.location.href = `/physics/modules/${module.id}`}
                >
                  <h3 style={{ marginBottom: '10px', fontSize: '1.2rem' }}>{module.title}</h3>
                  <p style={{ color: '#666', marginBottom: '10px' }}>{module.summary}</p>
                  <p style={{ fontSize: '0.9rem', color: '#999' }}>
                    Difficulty: {module.difficulty} | {module.estimated_minutes} min
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}