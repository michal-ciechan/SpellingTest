import { proxy, ref } from 'valtio';
import { queryClient } from '../App';

export const voiceStore = proxy({
  voices: [] as SpeechSynthesisVoice[],
  voice: undefined as SpeechSynthesisVoice | undefined,
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

export const getVoices = () => {
  console.log('Fetching voices at ', new Date());
  let voices = window.speechSynthesis
    .getVoices()
    .filter((x) => x.name.toLowerCase().includes('english'));

  if (voices.length == 0) {
    voices = window.speechSynthesis.getVoices();
  }

  if (voices.length == 0) {
    throw 'Could not find any voices. Please report this to Jan Ciechan';
  }

  const voiceRefs = voices
    .sort((a, b) => voiceSortValue(b) - voiceSortValue(a))
    .map((x) => ref(x));

  voiceStore.voices = ref(voiceRefs);
  voiceStore.voice = voiceRefs[0];

  return voiceStore.voices;
};
