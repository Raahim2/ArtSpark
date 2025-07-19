import { MaterialCommunityIcons } from '@expo/vector-icons';

export const allMaterialCommunityIcons = Object.keys(MaterialCommunityIcons.glyphMap);
export const ICONS_PER_PAGE = 102;


export const FONT_MAP = {
  'Anton': 'Anton',
  'Cavea': 'Cavea',
  'Consent': 'Consent',
  'Grid': 'Grid',
  'Luckiest Guy': 'LuckiestGuy',
  'Monosent': 'Monosent',
  'Noto': 'Noto',
  'Pacifico': 'Pacifico',
  'Roboto': 'Roboto',
  'Rough': 'Rough'
};


export const loadedFonts = {
  'Anton': require('../../assets/Fonts/Anton.ttf'),
  'Cavea': require('../../assets/Fonts/Cavea.ttf'),
  'Consent': require('../../assets/Fonts/Consent.ttf'),
  'Grid': require('../../assets/Fonts/Grid.ttf'),
  'LuckiestGuy': require('../../assets/Fonts/LuckiestGuy.ttf'),
  'Monosent': require('../../assets/Fonts/Monosent.ttf'),
  'Noto': require('../../assets/Fonts/Noto.ttf'),
  'Pacifico': require('../../assets/Fonts/Pacifico.ttf'),
  'Roboto': require('../../assets/Fonts/Roboto.ttf'),
  'Rough': require('../../assets/Fonts/Rough.ttf'),
};


export const fontPickerItems = Object.keys(FONT_MAP).map(fontName => ({
  label: fontName,
  value: FONT_MAP[fontName],
}));