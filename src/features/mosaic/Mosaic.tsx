// The "mosaic" is what I'm calling the main menu-type interface of the system.
// It's basically a vertical list of horizontal lists of "tiles" and it's
// navigable with a gamepad. The rows are called "tile groups".
//
// The app will use a <Mosaic> component with a content tree that can have
// multiple levels of nesting with <TileGroup> and <Tile> components. The
// <Mosaic> component will take care of gamepad navigation and focus management.
//
// The <Mosaic> component will take a content tree as a prop and render it. The
// content tree will be a nested structure of <TileGroup> and <Tile> components.

export const TileGroup: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="flex-shrink-0 overflow-x-auto border-l-8 border-slate-600 rounded-l-xl">
    <nav className="flex flex-row gap-4 p-2 border-r-8 bg-slate-800 min-w-max border-slate-600 rounded-r-xl">
      {children}
    </nav>
  </div>
)

export const Tile: React.FC<{
  children: React.ReactNode
  onClick: () => void
}> = ({ children, onClick }) => (
  <a
    href="#"
    className="flex-shrink-0 gap-4 p-2 bg-transparent opacity-70 rounded-xl focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:shadow-lg focus:opacity-100"
    onClick={onClick}
  >
    {children}
  </a>
)