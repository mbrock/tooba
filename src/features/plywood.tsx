import React, { CSSProperties } from "react"

type PanelProps = {
  panel: [number, number]
  cuts: [number, number][]
  numUnits: number
  kerfWidth: number
}

const PanelLayout: React.FC<PanelProps> = ({
  panel,
  cuts,
  numUnits,
  kerfWidth,
}) => {
  const [panelWidth, panelHeight] = panel
  const totalUnits = cuts.length * numUnits

  let remainingWidth = panelWidth
  let xOffset = 0
  let yOffset = 0
  const layout: JSX.Element[] = []

  const sortedCuts = cuts.sort((a, b) => b[0] * b[1] - a[0] * a[1])

  for (let i = 0; i < totalUnits; i++) {
    const cut = sortedCuts[i % cuts.length]
    const [cutWidth, cutHeight] = cut

    if (cutWidth > remainingWidth) {
      yOffset += cutHeight + kerfWidth
      remainingWidth = panelWidth
      xOffset = 0
    }

    const style: CSSProperties = {
      width: `${cutWidth}px`,
      height: `${cutHeight}px`,
      position: "absolute",
      left: `${xOffset}px`,
      top: `${yOffset}px`,
    }

    layout.push(
      <div
        style={style}
        key={i}
        className="font-mono border-2 bg-yellow-50 text-slate-600"
      >
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {`${cutWidth}x${cutHeight}`}
        </span>
      </div>,
    )

    xOffset += cutWidth + kerfWidth
    remainingWidth = panelWidth - xOffset
  }

  return (
    <div
      style={{
        width: `${panelWidth}px`,
        height: `${panelHeight}px`,
        position: "relative",
        border: "1px solid black",
      }}
    >
      {layout}
    </div>
  )
}

export default PanelLayout

export const TestPlywood: React.FC = () => {
  const panel: [number, number] = [1250, 2500]
  const cuts: [number, number][] = [
    [460, 1071.5], // Side pieces
    [460, 1071.5], // Side pieces
    [658, 1071.5], // Back piece
    [658, 460], // Top piece
    [658, 460], // Bottom piece
  ]
  const numUnits = 1
  const kerfWidth = 3

  return (
    <div>
      <PanelLayout
        panel={panel}
        cuts={cuts}
        numUnits={numUnits}
        kerfWidth={kerfWidth}
      />
    </div>
  )
}
