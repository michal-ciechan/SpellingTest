export interface DayData {
  date: string;
  words: WordData[];
}

export interface WordData {
  status?: undefined | 'success' | 'error';
  word: string;
  phrase: string;
  definition: string;
}

// Put the following words in the above data for a 8 year old 
// using the exact term and tense ignoring status property
// and where the example usage is different
// where date is 2023-03-17:
// great
// grate (noun geography)
// elephant
// chase
// river
// mountain
// animals
// creeping
// scurrying
// caught

// export const dayData: DayData = { ... }

export const dayData: DayData = {
  date: '2023-03-17',
  words: [
    {
      word: 'great',
      phrase: 'I had a great time at the party.',
      definition: 'very good or impressive'
    },
    {
      word: 'grate',
      phrase: 'The grate was covered with dirt.',
      definition: 'a frame of metal bars that is used to cover an opening to a drain in the ground'
    },
    {
      word: 'elephant',
      phrase: 'The elephant had a long trunk.',
      definition: 'a very large animal with a long nose'
    },
    {
      word: 'chase', 
      phrase: 'Did you see the dog chase the cat?',
      definition: 'to run after someone or something in order to catch them'
    },
    {
      word: 'river',
      phrase: 'The river flows into the ocean.',
      definition: 'a large stream of water that flows into the sea'
    },
    {
      word: 'mountain',
      phrase: 'I climbed a mountain in Peak Districts.',
      definition: 'a large natural hill with a flat top'
    },
    {
      word: 'animals',
      phrase: 'I like to watch animals in the zoo.',
      definition: 'living things that are not people'
    },
    {
      word: 'creeping',
      phrase: 'The mouse was creeping through the grass.',
      definition: 'moving slowly and quietly'
    },
    {
      word: 'scurrying',
      phrase: 'The squirrel was scurrying through the leaves.',
      definition: 'moving quickly and quietly'
    },
    {
      word: 'caught',
      phrase: 'I caught a fish in the river.',
      definition: 'to get something that is moving'
    }
  ]
};