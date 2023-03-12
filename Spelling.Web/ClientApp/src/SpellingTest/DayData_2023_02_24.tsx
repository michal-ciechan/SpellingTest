export interface DayData {
  date: string;
  words: WordData[];
}

export interface WordData {
  status?: undefined | 'success' | 'error';
  word: string;
  phrase: string;
}

// Put the following words in the above data for a 8 year old:
// address
// appear
// arrive
// different
// difficult
// disappear
// grammar
// occasion
// opposite
// pressure
// support

// export const dayData: DayData = { ... }
export const dayData: DayData = {
  date: '2023-02-24',
  words: [
    { word: 'address', phrase: 'My school address is Barton Road, Torquay.' },
    { word: 'appear', phrase: 'The sun will appear in the sky every morning.' },
    { word: 'arrive', phrase: 'I will arrive at the park at 3pm.' },
    { word: 'different', phrase: 'Apples and oranges are different fruits.' },
    { word: 'difficult', phrase: 'This math problem is very difficult.' },
    { word: 'disappear', phrase: 'The magician made the rabbit disappear.' },
    { word: 'grammar', phrase: 'Learning proper grammar is important.' },
    { word: 'occasion', phrase: 'Birthday is my favourite special occasion.' },
    { word: 'opposite', phrase: 'Up and down are opposite directions.' },
    { word: 'pressure', phrase: 'The air pressure changes when we go up a mountain.' },
    { word: 'support', phrase: 'Will you support me when I try the big ramp.' }
  ]
};