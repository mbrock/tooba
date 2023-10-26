import React, { useState, useEffect } from "react"

type Props = {
  children: React.ReactNode
  initButtonLabel?: React.ReactNode
}

const UserInteractionInitializer: React.FC<Props> = ({
  children,
  initButtonLabel = "🎤 Click to Start",
}) => {
  const [isUserInteracted, setIsUserInteracted] = useState(false)

  const handleClick = () => {
    setIsUserInteracted(true)
  }

  return (
    <div>
      {isUserInteracted ? (
        children
      ) : (
        <button onClick={handleClick}>{initButtonLabel}</button>
      )}
    </div>
  )
}

export default UserInteractionInitializer
