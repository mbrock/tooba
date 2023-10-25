import tuesdayImgUrl from "./img/Lentil Pasta with Pesto and Roasted Brussels Sprouts.png"
import wednesdayImgUrl from "./img/Pumpkin and Chickpea Curry + Quinoa Side.png"
import thursdayImgUrl from "./img/Quinoa Salad with Hazelnuts, Balsamic Vinegar, and Grilled Chicken.png"
import fridayImgUrl from "./img/Beet and Black Bean Burgers with Cabbage Slaw.png"

export default [
  {
    Day: "Tisdag",
    Meal: "Pasta + Pesto + Brysselkål",
    Image: tuesdayImgUrl,
    Dishes: [
      {
        Name: "Pasta",
        Steps: [
          "Boil 1 pack lentil pasta",
          "Mix with 1 small jar of pesto",
          "Top with handful of grated parmesan",
        ],
      },
      {
        Name: "Brussels Sprouts",
        Steps: ["Roast 2 cups Brussels sprouts at 200°C, 20 min"],
      },
    ],
  },
  {
    Day: "Onsdag",
    Meal: "Pumpa Kikärta Curry + Quinoa",
    Image: wednesdayImgUrl,
    Dishes: [
      {
        Name: "Curry",
        Steps: [
          "Dice 1 small pumpkin",
          "Sauté with 1 can chickpeas",
          "Add 1 can coconut milk",
          "Spices: 1 tsp each of cumin, coriander, turmeric, pinch of chili flakes",
          "Simmer 20 min",
        ],
      },
      {
        Name: "Quinoa",
        Steps: [
          "Rinse 2 cups quinoa",
          "Cook in 4 cups water with pinch of salt",
          "Simmer until water is absorbed",
        ],
      },
    ],
  },
  {
    Day: "Torsdag",
    Meal: "Quinoa Hasselnöt Kyckling Sallad",
    Image: thursdayImgUrl,
    Dishes: [
      {
        Name: "Salad",
        Steps: [
          "Reheat leftover quinoa",
          "Mix with handful of hazelnuts, splash of balsamic vinegar, sliced bell peppers, and chopped sauerkraut",
        ],
      },
      {
        Name: "Chicken",
        Steps: ["Grill 4 chicken breasts", "Slice and mix into salad"],
      },
    ],
  },
  {
    Day: "Fredag",
    Meal: "Rödbeta & Bönor Burgare + Slaw",
    Image: fridayImgUrl,
    Dishes: [
      {
        Name: "Burger",
        Steps: [
          "Grate 2 medium beets",
          "Mash 1 can black beans",
          "Mix and form patties",
          "Bake at 180°C, 20 min",
          "Top with slices of Latvian round cheese",
        ],
      },
      {
        Name: "Slaw",
        Steps: [
          "Shred Chinese cabbage",
          "Mix with sauerkraut, splash of olive oil, and pinch of salt",
        ],
      },
    ],
  },
]
