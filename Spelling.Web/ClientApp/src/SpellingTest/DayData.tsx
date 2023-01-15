export interface DayData {
  date: string;
  words: WordData[];
}

export interface WordData {
  status?: undefined | 'success' | 'error';
  word: string;
  phrase: string;
}

export const dayData: DayData = {
  date: '2023-01-13',
  words: [
    {
      word: 'fruit',
      phrase: 'Fruit is the yummy part of a plant that we eat',
    },
    {
      word: 'vegetable',
      phrase: 'A vegetable garden is a fun way to grow your own food',
    },
    {
      word: 'protein',
      phrase: 'Protein is like the building blocks for our bodies',
    },
    {
      word: 'carbohydrate',
      phrase: 'Carbohydrates are a type of food that gives our body energy',
    },
    {
      word: 'water',
      phrase:
        'Water is a clear and colorless liquid that is essential for life',
    },
    {
      word: 'minerals',
      phrase:
        'Minerals are special types of substances that our body needs to stay healthy',
    },
    {
      word: 'vitamins',
      phrase:
        'Vitamins help us to grow, keep our skin looking good, and to keep us from getting sick',
    },
    {
      word: 'growth',
      phrase: 'Growth is when something gets bigger and taller',
    },
    {
      word: 'explore',
      phrase:
        'We can explore the world around us by going for a walk in the park, visiting a museum, or even by reading a book',
    },
    {
      word: 'explorer',
      phrase:
        'An explorer is someone who goes on adventures to discover new places',
    },
  ],
};
