import { proxy, ref } from 'valtio';

const voices = window.speechSynthesis
  .getVoices()
  .filter((x) => x.name.toLowerCase().includes('english'))
  .map((x) => ref(x));

export const voiceStore = proxy({
  voices: ref(voices),
  voice: voices[0],
});

export const voiceSortValue = (x: SpeechSynthesisVoice): number => {
  let n = 0;

  const name = x.name.toLowerCase();

  if (name.includes('united kingdom')) {
    n += 100;
  } else if (name.includes('united state')) {
    n += 50;
  } else if (name.includes('australia')) {
    n += 30;
  }

  if (name.includes('natural')) {
    n += 10;
  }

  return n;
};

console.log('Vocie: ', voiceStore.voice);

setTimeout(() => {
  const voices = window.speechSynthesis
    .getVoices()
    .filter((x) => x.name.toLowerCase().includes('english'))
    .sort((a, b) => voiceSortValue(b) - voiceSortValue(a))
    .map((x) => ref(x));

  voiceStore.voices = ref(voices);
  voiceStore.voice = voices[0];

  console.log('Voice: ', voiceStore.voice);
}, 5);
