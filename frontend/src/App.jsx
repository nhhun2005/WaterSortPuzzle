import { useState } from 'react'
import { LEVELS } from './data/levels'
import { useGame } from './hooks/useGame'
import { useSolver } from './hooks/useSolver'
import GameplayScreen from './screens/GameplayScreen'
import HomeScreen from './screens/HomeScreen'
import LevelSelectScreen from './screens/LevelSelectScreen'
import ProjectInfoScreen from './screens/ProjectInfoScreen'
import SolverScreen from './screens/SolverScreen'
import VisualizationScreen from './screens/VisualizationScreen'

function App() {
  const [screen, setScreen] = useState('home')
  const game = useGame(LEVELS)
  const solver = useSolver(LEVELS[0].bottles)

  function openScreen(nextScreen) {
    setScreen(nextScreen)
  }

  function startLevel(level) {
    if (game.startLevel(level) !== false) {
      openScreen('game')
    }
  }

  return (
    <main className="app">
      {screen === 'home' && (
        <HomeScreen
          onInfo={() => openScreen('info')}
          onLevels={() => openScreen('levels')}
          onPlay={() => startLevel(LEVELS[0])}
          onSolver={() => openScreen('solver')}
          previewBottles={LEVELS[0].bottles.slice(0, 6)}
        />
      )}

      {screen === 'game' && (
        <GameplayScreen
          bottles={game.bottles}
          completed={game.isSolved}
          currentLevel={game.currentLevel}
          lastAction={game.lastAction}
          moveCount={game.moveCount}
          onBack={() => openScreen('home')}
          onBottleClick={game.handleBottleClick}
          onReset={game.resetLevel}
          onSolver={() => openScreen('solver')}
          onUndo={game.undoMove}
          selectedBottle={game.selectedBottle}
          statusMessage={game.statusMessage}
          undoDisabled={game.undoDisabled}
        />
      )}

      {screen === 'solver' && (
        <SolverScreen
          algorithm={solver.algorithm}
          heuristic={solver.heuristic}
          onAlgorithmChange={solver.setAlgorithm}
          onBack={() => openScreen('home')}
          onFindSolution={solver.findSolution}
          onHeuristicChange={solver.setHeuristic}
          onVisualize={() => openScreen('visualizer')}
          previewBottles={LEVELS[0].bottles}
          result={solver.solverResult}
          usesHeuristic={solver.usesHeuristic}
        />
      )}

      {screen === 'visualizer' && (
        <VisualizationScreen
          current={solver.currentTimelineState}
          maxStep={solver.maxStep}
          onBack={() => openScreen('solver')}
          onNext={solver.nextStep}
          onPrevious={solver.previousStep}
          onStepSelect={solver.selectStep}
          step={solver.visualStep}
          steps={solver.steps}
        />
      )}

      {screen === 'levels' && (
        <LevelSelectScreen
          completedLevels={game.completedLevels}
          levels={LEVELS}
          onBack={() => openScreen('home')}
          onSelect={startLevel}
        />
      )}

      {screen === 'info' && <ProjectInfoScreen onBack={() => openScreen('home')} />}
    </main>
  )
}

export default App
