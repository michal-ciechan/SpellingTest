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
  date: '2023-01-20',
  words: [
    {
      word: 'quickly',
      phrase: 'running quickly like a cheetah',
    },
    {
      word: 'quietly',
      phrase: 'quietly tiptoe like a cat trying to catch a mouse',
    },
    {
      word: 'slowly',
      phrase: 'move slowly like a snail',
    },
    {
      word: 'excitedly',
      phrase: 'jump excitedly like a kangaroo',
    },
    {
      word: 'happily',
      phrase:
        'He smiled happily like a sunflower',
    },
    {
      word: 'purposefully',
      phrase:
        'Walk purposefully like a soldier on a mission',
    },
    {
      word: 'adventurously',
      phrase:
        'adventurously climb a mountain',
    },
    {
      word: 'rapidly',
      phrase: 'swim rapidly like a shark',
    },
    {
      word: 'proudly',
      phrase:
        'stand tall proudly, like a peacock showing off its feathers',
    },
    {
      word: 'anxiously',
      phrase:
        'He is fidgeting anxiously like a child waiting for christmas morning',
    },
  ],
};
