export type MenuItem = {
  name: string;
  price: string;
  priceValue: number;
  category?: string;
  description?: string;
  tag?: string;
  image?: string;
};

export type MenuCategory = {
  id: string;
  label: string;
  description: string;
  items: MenuItem[];
};

export const menuCategories: MenuCategory[] = [
  {
    id: "starters",
    label: "Starters",
    description: "",
    items: [
      {
        name: "Seared Scallops",
        description:
          "Golden seared scallops with seasonal vegetables and a delicate finishing sauce.",
        price: "3,250/=",
        priceValue: 3250,
        tag: "Seasonal",
        image: "/images/seared-scallops.png",
      },
      {
        name: "Garden Burrata",
        description:
          "Creamy burrata, heirloom tomatoes, basil oil and toasted sourdough.",
        price: "2,250/=",
        priceValue: 2250,
        image: "/images/garden-burrata.png",
      },
      {
        name: "Crispy Calamari",
        description:
          "Lightly seasoned calamari with lemon, herbs and house-made aioli.",
        price: "1,950/=",
        priceValue: 1950,
        image: "/images/crispy-calamari.png",
      },
      {
        name: "Roasted Pumpkin Soup",
        description:
          "Silky roasted pumpkin, warming spices, cream and toasted seeds.",
        price: "1,450/=",
        priceValue: 1450,
        image: "/images/roasted-pumpkin-soup.png",
      },
    ],
  },

  {
    id: "main-meals",
    label: "Main Meals",
    description: "",
    items: [
      {
        name: "Herb Crusted Lamb Rack",
        description:
          "Tender lamb rack with a fragrant herb crust, seasonal vegetables and jus.",
        price: "3,950/=",
        priceValue: 3950,
        tag: "Chef's recommendation",
        image: "/images/herb-crusted-lamb-rack.png",
      },
      {
        name: "Grilled Sea Bass",
        description:
          "Fresh sea bass with roasted vegetables, lemon butter and garden herbs.",
        price: "3,450/=",
        priceValue: 3450,
        image: "/images/grilled-sea-bass.png",
      },
      {
        name: "Slow Braised Beef",
        description:
          "Slow-cooked beef, creamy mash, glazed vegetables and rich red-wine jus.",
        price: "3,650/=",
        priceValue: 3650,
        image: "/images/slow-braised-beef.png",
      },
      {
        name: "Roasted Chicken Supreme",
        description:
          "Herb-roasted chicken breast with seasonal vegetables and pan jus.",
        price: "2,850/=",
        priceValue: 2850,
        image: "/images/roasted-chicken-supreme.png",
      },
    ],
  },

  {
    id: "snacks",
    label: "Snacks & Small Plates",
    description: "",
    items: [
      {
        name: "Truffle Parmesan Fries",
        description:
          "Crisp fries finished with parmesan, herbs and truffle oil.",
        price: "1,250/=",
        priceValue: 1250,
        image: "/images/truffle-parmesan-fries.png",
      },
      {
        name: "Spiced Chicken Skewers",
        description:
          "Charred chicken skewers with house spices and a cooling herb dip.",
        price: "1,650/=",
        priceValue: 1650,
        image: "/images/spiced-chicken-skewers.png",
      },
      {
        name: "Crispy Halloumi",
        description:
          "Golden halloumi with honey, herbs and toasted seeds.",
        price: "1,450/=",
        priceValue: 1450,
        image: "/images/crispy-halloumi.png",
      },
      {
        name: "Sourdough & Dips",
        description:
          "Warm sourdough served with whipped butter and seasonal house dips.",
        price: "950/=",
        priceValue: 950,
        image: "/images/sourdough-dips.png",
      },
    ],
  },

  {
    id: "pasta",
    label: "Pasta & Rice",
    description: "",
    items: [
      {
        name: "Wild Mushroom Tagliatelle",
        description:
          "Fresh tagliatelle with wild mushrooms, parmesan, herbs and cream.",
        price: "2,450/=",
        priceValue: 2450,
        tag: "House favourite",
        image: "/images/wild-mushroom-tagliatelle.png",
      },
      {
        name: "Prawn Linguine",
        description:
          "Linguine with prawns, garlic, chilli, lemon and fresh herbs.",
        price: "2,950/=",
        priceValue: 2950,
        image: "/images/prawn-linguine.png",
      },
      {
        name: "Creamy Chicken Risotto",
        description:
          "Arborio rice, roasted chicken, parmesan and seasonal vegetables.",
        price: "2,650/=",
        priceValue: 2650,
        image: "/images/creamy-chicken-risotto.png",
      },
      {
        name: "Mushroom & Parmesan Risotto",
        description:
          "Slow-cooked arborio rice with wild mushrooms and aged parmesan.",
        price: "2,350/=",
        priceValue: 2350,
        image: "/images/mushroom-parmesan-risotto.png",
      },
    ],
  },

  {
    id: "drinks",
    label: "Drinks",
    description: "",
    items: [
      {
        name: "Alora Signature Spritz",
        description:
          "A bright house spritz with citrus, botanicals and sparkling finish.",
        price: "1,250/=",
        priceValue: 1250,
        image: "/images/alora-signature-spritz.png",
      },
      {
        name: "Passion Fruit Cooler",
        description:
          "Fresh passion fruit, citrus and mint over ice.",
        price: "850/=",
        priceValue: 850,
        image: "/images/passion-fruit-cooler.png",
      },
      {
        name: "Ginger & Lime Fizz",
        description:
          "Fresh ginger, lime and sparkling water with a touch of sweetness.",
        price: "750/=",
        priceValue: 750,
        image: "/images/ginger-lime-fizz.png",
      },
      {
        name: "House Iced Tea",
        description:
          "Freshly brewed tea with seasonal fruit and herbs.",
        price: "650/=",
        priceValue: 650,
        image: "/images/house-iced-tea.png",
      },
      {
        name: "Espresso",
        description: "Rich, aromatic espresso.",
        price: "450/=",
        priceValue: 450,
        image: "/images/espresso.png",
      },
      {
        name: "Cappuccino",
        description: "Espresso with steamed milk and a soft layer of foam.",
        price: "650/=",
        priceValue: 650,
        image: "/images/cappuccino.png",
      },
    ],
  },

  {
    id: "desserts",
    label: "Desserts",
    description: "",
    items: [
      {
        name: "Chocolate Delice",
        description:
          "Dark chocolate delice with vanilla cream and seasonal berries.",
        price: "1,350/=",
        priceValue: 1350,
        tag: "To finish",
        image: "/images/chocolate-delice.png",
      },
      {
        name: "Vanilla Crème Brûlée",
        description:
          "Silky vanilla custard beneath a delicate caramelised crust.",
        price: "1,150/=",
        priceValue: 1150,
        image: "/images/vanilla-creme-brulee.png",
      },
      {
        name: "Seasonal Cheesecake",
        description:
          "Creamy baked cheesecake with seasonal fruit and house compote.",
        price: "1,250/=",
        priceValue: 1250,
        image: "/images/seasonal-cheesecake.png",
      },
      {
        name: "Warm Sticky Toffee Pudding",
        description:
          "Soft date pudding with toffee sauce and vanilla ice cream.",
        price: "1,250/=",
        priceValue: 1250,
        image: "/images/warm-sticky-toffee-pudding.png",
      },
    ],
  },
];