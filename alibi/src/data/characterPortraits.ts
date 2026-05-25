import { ImageSourcePropType } from 'react-native';

export const characterPortraits: Record<string, ImageSourcePropType> = {
  alisa: require('../../assets/characters/alisa.png'),
  anton: require('../../assets/characters/anton.png'),
  boris: require('../../assets/characters/boris.png'),
  dina: require('../../assets/characters/dina.png'),
  gleb: require('../../assets/characters/gleb.png'),
  ivan: require('../../assets/characters/ivan.png'),
  maria: require('../../assets/characters/maria.png'),
  nikita: require('../../assets/characters/nikita.png'),
  oleg: require('../../assets/characters/oleg.png'),
  sofia: require('../../assets/characters/sofia.png'),
  vera: require('../../assets/characters/vera.png'),
};

export const getCharacterPortrait = (portraitId: string) => characterPortraits[portraitId];
