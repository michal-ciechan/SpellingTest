export interface DayData {
  date: string;
  words: WordData[];
}

export interface WordData {
  status?: undefined | 'success' | 'error';
  word: string;
  phrase: string;
  exampleUsage: string;
  definition: string;
}

// Put the following words in the above data for a 8 year old using the exact term and tense ignoring status:
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
  date: '2023-03-12',
  words: [
    {
      word: 'persuade',
      phrase: 'I will try to persuade my friend to come to my party.',
      exampleUsage: 'Can you persuade your little brother to eat his vegetables?',
      definition: 'to convince someone to do or believe something'
    },
    {
      word: 'persuasion',
      phrase: 'My mom used her powers of persuasion to get me to clean my room.',
      exampleUsage: 'She is very good at using persuasion to get what she wants.',
      definition: 'the act of convincing someone to do or believe something'
    },
    {
      word: 'argue',
      phrase: 'My parents always argue about what to watch on TV.',
      exampleUsage: 'I don\'t want to argue with you, I just want to find a solution.',
      definition: 'to express different opinions and disagree with someone'
    },
    {
      word: 'advert',
      phrase: 'I saw an advert for a new video game on TV.',
      exampleUsage: 'They are going to put an advert for their new product in the newspaper.',
      definition: 'a public promotion of some product or service'
    },
    {
      word: 'opposing',
      phrase: 'The two teams have opposing views on how to win the game.',
      exampleUsage: 'The opposing candidates had very different opinions on the issues.',
      definition: 'having different views or opinions'
    },
    {
      word: 'argument',
      phrase: 'I had an argument with my friend about who was the best singer.',
      exampleUsage: 'The couple had a big argument about where to go on vacation.',
      definition: 'a disagreement or clash of opinions'
    },
    {
      word: 'however',
      phrase: 'I really want to go to the party, however, I have to study for my test.',
      exampleUsage: 'I know you want to play video games, however, you need to finish your homework first.',
      definition: 'used to introduce a contrasting idea or statement'
    },
    {
      word: 'exaggeration',
      phrase: 'My little brother always uses exaggeration when he tells a story.',
      exampleUsage: 'I think the news report was an exaggeration of what actually happened.',
      definition: 'a statement that represents something as better or worse than it really is'
    },
    {
      word: 'structure',
      phrase: 'The structure of the building is very interesting.',
      exampleUsage: 'I need to work on the structure of my essay to make it more clear.',
      definition: 'the way something is arranged or organized'
    },
    {
      word: 'statistics',
      phrase: 'I found some interesting statistics about how much people use their phones.',
      exampleUsage: 'The professor used a lot of statistics to support her argument.',
      definition: 'numerical data used for analysis or interpretation'
    }
  ]
};