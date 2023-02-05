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
// Disagree
// Dislike
// Discourage
// Inactive
// Incorrect
// Informal
// Incomplete
// Misbehave
// Misunderstanding

// export const dayData: DayData = { ... }
export const dayData: DayData = {
  date: "2023-02-03",
  words: [
    { word: 'Disagree', phrase: 'I disagree with your opinion' },
    { word: 'Dislike', phrase: 'I dislike spicy food' },
    { word: 'Discourage', phrase: 'His parents discouraged him from quitting school' },
    { word: 'Inactive', phrase: 'Kilimanjaro is an inactive volcano' },
    { word: 'Incorrect', phrase: 'Your answer is incorrect' },
    { word: 'Informal', phrase: 'The gathering was informal and relaxed' },
    { word: 'Incomplete', phrase: 'The homework submitted was incomplete' },
    { word: 'Misbehave', phrase: 'You should not misbehave in school' },
    { word: 'Misunderstanding', phrase: 'There was a misunderstanding between us' }, s
  ],
};