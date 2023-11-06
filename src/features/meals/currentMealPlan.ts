import tuesdayImgUrl from "./img/Lentil Pasta with Pesto and Roasted Brussels Sprouts.png"
import wednesdayImgUrl from "./img/Pumpkin and Chickpea Curry + Quinoa Side.png"
import thursdayImgUrl from "./img/Quinoa Salad with Hazelnuts, Balsamic Vinegar, and Grilled Chicken.png"
import fridayImgUrl from "./img/Beet and Black Bean Burgers with Cabbage Slaw.png"

import w2d1 from "./img/Taco Natt.png"
import w2d2 from "./img/Omelett + Halloween.png"
import w2d3 from "./img/Pumpa Soppa + Rostat Bröd.png"
import w2d4 from "./img/Biff + Potatis.png"
import w2d5 from "./img/Mättande Soppa.png"

import w3d1 from "./img/Pasta + Morötter.png"
import w3d2 from "./img/Rödbetsbollar + Ärtor.png"
import w3d3 from "./img/Pannkakor + Hallon.png"
import w3d4 from "./img/Nudlar + Brysselkål + Biff.png"
import w3d5 from "./img/Mackor + Korv.png"

export interface Dish {
  Name: string
  Steps: string[]
}

export interface Meal {
  Day: string
  Meal: string
  Image: string
  Dishes: Dish[]
}

export const week2 = [
  {
    Day: "Måndag",
    Meal: "Taco Natt",
    Image: w2d1,
    Dishes: [
      {
        Name: "Ground Beef",
        Steps: ["Sauté ground beef with salt, pepper"],
      },
      {
        Name: "Tortillas",
        Steps: ["Warm tortillas"],
      },
      {
        Name: "Sides",
        Steps: [
          "Slice 1 bell pepper",
          "Slice 1 cucumber",
          "Prepare Greek yogurt and BBQ sauce for dip",
          "Grate cheese",
        ],
      },
    ],
  },
  {
    Day: "Tisdag",
    Meal: "Omelett + Halloween",
    Image: w2d2,
    Dishes: [
      {
        Name: "Omelette",
        Steps: [
          "Whisk 4 eggs",
          "Pour into hot pan, cook until done",
          "Top with sauerkraut and cheese",
        ],
      },
      {
        Name: "Halloween",
        Steps: ["Carve small pumpkin", "Use insides in omelette or as snack"],
      },
    ],
  },
  {
    Day: "Onsdag",
    Meal: "Pumpa Soppa + Rostat Bröd",
    Image: w2d3,
    Dishes: [
      {
        Name: "Pumpkin Soup",
        Steps: [
          "Sauté 1 chopped onion",
          "Add ~4 cups diced pumpkin",
          "Add 1 liter vegetable broth",
          "Cook until soft, blend, season",
        ],
      },
      {
        Name: "Toast",
        Steps: ["Toast bread", "Spread with Greek yogurt"],
      },
    ],
  },

  {
    Day: "Fredag",
    Meal: "Mättande Soppa",
    Image: w2d5,
    Dishes: [
      {
        Name: "Hearty Soup",
        Steps: [
          "Sauté 1 chopped onion",
          "Add diced 1 carrot, 1 potato, 1 bell pepper",
          "Add 1 liter vegetable broth and 1 bottle (~330ml) Guinness",
          "Add 2 cups pasta, 1 cup kidney beans",
          "Cook until done",
        ],
      },
    ],
  },
]

export const week1 = [
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

export const week3 = [
  {
    Day: "Måndag",
    Meal: "Pasta med Morot och Grönt",
    Image: w3d1,
    Dishes: [
      {
        Name: "Pasta",
        Steps: [
          "Cook favorite pasta",
          "Top with raw sliced carrots and microgreens",
          "Optional: Add Greek yogurt or cheese",
        ],
      },
    ],
  },
  {
    Day: "Tisdag",
    Meal: "Rödbetsbollar med Kål och Ärtor",
    Image: w3d2,
    Dishes: [
      {
        Name: "Veggie Balls",
        Steps: [
          "Blend or mash 2 cups of cooked beets and 1 cup of cooked carrots",
          "Mix in breadcrumbs and a beaten egg for binding (optional)",
          "Form mixture into small balls",
          "Pan-fry with a bit of oil until crispy on the outside",
        ],
      },
      {
        Name: "Sides",
        Steps: [
          "Serve with a squeeze of tomato puree from tube",
          "Accompany with fresh cabbage, shredded or chopped",
          "Serve with a side of buttered green peas",
        ],
      },
    ],
  },
  {
    Day: "Onsdag",
    Meal: "Pannkakskväll",
    Image: w3d3,
    Dishes: [
      {
        Name: "Crepes",
        Steps: ["Prepare crepes", "Serve with jam", "Serve with yogurt"],
      },
    ],
  },
  {
    Day: "Torsdag",
    Meal: "Nudlar + Grönsaker + Biff",
    Image: w3d4,
    Dishes: [
      {
        Name: "Steak",
        Steps: [
          "Season steak with salt and pepper",
          "For stove: Heat oil in a pan, cook steak 3-4 minutes each side for medium-rare",
          "For oven: Preheat oven to 200°C, bake for 10-15 minutes depending on thickness",
        ],
      },
      {
        Name: "Veggies & Noodles",
        Steps: [
          "Steam Brussels sprouts and carrots until tender",
          "Prepare and cook noodles as per package instructions",
        ],
      },
    ],
  },
  {
    Day: "Fredag",
    Meal: "Mackor + Korv",
    Image: w3d5,
    Dishes: [
      {
        Name: "Sandwiches",
        Steps: [
          "Provide variety of bread",
          "Include cheese, tomatoes, microgreens, and other toppings",
          "Prepare pan-fried butter cheese toasts",
        ],
      },
      {
        Name: "Sausage Option",
        Steps: ["Offer sausages as an additional option"],
      },
    ],
  },
]
