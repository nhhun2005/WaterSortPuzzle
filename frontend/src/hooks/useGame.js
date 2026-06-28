import { useMemo, useState } from 'react'
import { actionText, cloneBottles, isWinState, pourBetween } from '../lib/gameLogic'

export function useGame(levels) {
  const [currentLevelId, setCurrentLevelId] = useState(levels[0].id)
  const [bottles, setBottles] = useState(() => cloneBottles(levels[0].bottles))
  const [selectedBottle, setSelectedBottle] = useState(null)
  const [history, setHistory] = useState([])
  const [moveCount, setMoveCount] = useState(0)
  const [lastAction, setLastAction] = useState(null)
  const [statusMessage, setStatusMessage] = useState(
    'Select a source bottle to pour.',
  )
  const [completedLevels, setCompletedLevels] = useState([])

  const currentLevel = useMemo(
    () => levels.find((level) => level.id === currentLevelId) ?? levels[0],
    [currentLevelId, levels],
  )

  const isSolved = useMemo(() => isWinState(bottles), [bottles])

  function startLevel(level) {
    if (!level?.unlocked) {
      return false
    }

    setCurrentLevelId(level.id)
    setBottles(cloneBottles(level.bottles))
    setSelectedBottle(null)
    setHistory([])
    setMoveCount(0)
    setLastAction(null)
    setStatusMessage('Select a source bottle to pour.')
    return true
  }

  function handleBottleClick(index) {
    if (isSolved) {
      return
    }

    if (selectedBottle === null) {
      if (bottles[index].length === 0) {
        setStatusMessage('Choose a bottle that has water first.')
        return
      }

      setSelectedBottle(index)
      setStatusMessage(`Bottle ${index + 1} selected. Choose a target bottle.`)
      return
    }

    if (selectedBottle === index) {
      setSelectedBottle(null)
      setStatusMessage('Selection cleared.')
      return
    }

    const result = pourBetween(bottles, selectedBottle, index)

    if (!result) {
      if (bottles[index].length > 0) {
        setSelectedBottle(index)
        setStatusMessage(`Bottle ${index + 1} is now selected as source.`)
      } else {
        setStatusMessage('That pour is not valid for the current bottle state.')
      }
      return
    }

    setHistory((entries) => [
      ...entries,
      {
        bottles: cloneBottles(bottles),
        moveCount,
        lastAction,
      },
    ])
    setBottles(result.bottles)
    setMoveCount((count) => count + 1)
    setLastAction(result.action)
    setSelectedBottle(null)
    setStatusMessage(actionText(result.action))

    if (isWinState(result.bottles)) {
      setCompletedLevels((levelIds) =>
        levelIds.includes(currentLevelId)
          ? levelIds
          : [...levelIds, currentLevelId],
      )
    }
  }

  function undoMove() {
    if (history.length === 0) {
      return
    }

    const previous = history[history.length - 1]
    setBottles(cloneBottles(previous.bottles))
    setMoveCount(previous.moveCount)
    setLastAction(previous.lastAction)
    setHistory((entries) => entries.slice(0, -1))
    setSelectedBottle(null)
    setStatusMessage('Last move undone.')
  }

  function resetLevel() {
    setBottles(cloneBottles(currentLevel.bottles))
    setSelectedBottle(null)
    setHistory([])
    setMoveCount(0)
    setLastAction(null)
    setStatusMessage('Level reset. Select a source bottle to pour.')
  }

  return {
    bottles,
    completedLevels,
    currentLevel,
    handleBottleClick,
    isSolved,
    lastAction,
    moveCount,
    resetLevel,
    selectedBottle,
    startLevel,
    statusMessage,
    undoDisabled: history.length === 0,
    undoMove,
  }
}
