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
  date: '2023-01-27',
  words: [
    {
      word: 'rocks',
      phrase:
        'Rocks are the building blocks of mountains. We can find different types of rocks all around us, like in the playground or in a riverbed.',
    },
    {
      word: 'fossils',
      phrase:
        'Fossils are like secret messages from long ago. They are the remains of plants and animals that lived a long time ago. We can find fossils in rocks.',
    },
    {
      word: 'process',
      phrase:
        'A process is like a recipe for making something. For example, baking a cake is a process that involves mixing ingredients, baking them, and decorating the finished product.',
    },
    {
      word: 'groups',
      phrase:
        'Groups are like teams. We are all in a group when we are in a class, and we can also be in groups when we play games or do projects.',
    },
    {
      word: 'pebble',
      phrase:
        'A pebble is a small, smooth rock. You can find pebbles at the beach or in a stream.',
    },
    {
      word: 'pocket',
      phrase:
        'A pocket is a small space in something, like a shirt or a jacket, where you can put things like your keys or your money.',
    },
    {
      word: 'igneous',
      phrase:
        'Igneous rocks are formed from cooled magma or lava. Granite is an example of an igneous rock.',
    },
    {
      word: 'metamorphic',
      phrase:
        'Metamorphic rocks are formed from heat and pressure. Marble is an example of a metamorphic rock.',
    },
    {
      word: 'sedimentary',
      phrase:
        'Sedimentary rocks are formed from the buildup of small pieces of rock and other materials. Sandstone is an example of a sedimentary rock.',
    },
    {
      word: 'imprint',
      phrase:
        "An imprint is like a stamp. It's a mark that something leaves behind when it is pressed into something soft, like mud or clay.",
    },
  ],
};
