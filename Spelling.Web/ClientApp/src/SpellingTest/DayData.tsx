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
// quickly
// slowly
// suddenly
// quietly
// angrily
// carefully
// nervously
// excitedly
// happily
// cautiously

// export const dayData: DayData = { ... }

export const dayData: DayData = {
  date: '2023-03-24',
  words: [
    {
      word: 'quickly',
      phrase: 'She ran quickly to catch the bus.',
      definition: 'at a fast speed; rapidly'
    },
    {
      word: 'slowly',
      phrase: 'The turtle walked slowly across the road.',
      definition: 'at a low speed; not quickly'
    },
    {
      word: 'suddenly',
      phrase: 'The thunderstorm arrived suddenly in the middle of the day.',
      definition: 'happening or done without warning; unexpectedly'
    },
    {
      word: 'quietly',
      phrase: "Please close the door quietly so you don't wake the baby.",
definition: 'in a way that makes little noise; silently'
},
    {
      word: 'angrily',
      phrase: 'The teacher scolded the student angrily for not doing his homework.',
      definition: 'in a way that shows anger or irritation; with rage'
    },
    {
      word: 'carefully',
      phrase: "He handled the fragile vase carefully so it wouldn't break.",
definition: 'with great attention, caution, or care; cautiously'
},
    {
      word: 'nervously',
      phrase: 'She tapped her foot nervously while waiting for the interview.',
      definition: 'in a way that shows nervousness or anxiety; apprehensively'
    },
    {
      word: 'excitedly',
      phrase: 'The children shouted excitedly when they saw the fireworks.',
      definition: 'in a way that shows enthusiasm, eagerness, or anticipation; eagerly'
    },
    {
      word: 'happily',
      phrase: 'They danced happily at their wedding reception.',
      definition: 'in a way that shows joy, contentment, or pleasure; joyfully'
    },
    {
      word: 'cautiously',
      phrase: 'The hiker moved cautiously along the narrow and rocky trail.',
      definition: 'in a way that shows carefulness, wariness, or prudence; carefully'
    }
  ]
};