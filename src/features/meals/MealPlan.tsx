import { Tile, TileGroup } from "../mosaic/Mosaic"
import mealPlan from "./currentMealPlan"

type Dish = {
  Name: string
  Steps: string[]
}

type Meal = {
  Day: string
  Meal: string
  Image: string
  Dishes: Dish[]
}

type MealProps = {
  meal: Meal
  today: boolean
}

const Meal = ({ meal, today }: MealProps) => {
  return (
    <Tile key={meal.Day} onClick={() => console.log("clicked")}>
      <div className={`flex flex-col w-80`}>
        <img
          src={meal.Image}
          className={`w-full h-auto rounded-md ${
            today ? "border-8 border-yellow-500" : ""
          }`}
        />
        <div className="px-2 py-1 uppercase">
          <span className="text-xs text-gray-300">{meal.Day}</span>{" "}
          <h2 className="text-sm">
            <span className="font-bold">{meal.Meal}</span>
          </h2>
          <ul className="flex-col hidden gap-4 xflex">
            {meal.Dishes.map((dish: Dish) => (
              <li key={dish.Name}>
                <div className="text-lg font-bold">{dish.Name}</div>
                <ul className="ml-4 list-disc list-outside">
                  {dish.Steps.map((step: string) => (
                    <li key={step} className="text-base">
                      {step}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Tile>
  )
}

export const MealPlan = () => {
  const today = "Onsdag"
  return (
    <TileGroup>
      {mealPlan.map((meal: Meal) => (
        <Meal meal={meal} today={meal.Day === today} />
      ))}
    </TileGroup>
  )
}
