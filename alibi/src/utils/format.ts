import { TransportType } from '../types';

export const transportLabels: Record<TransportType, string> = {
  walk: 'пешком',
  car: 'машина',
  bus: 'автобус',
  metro: 'метро',
  taxi: 'такси',
};

export const hintLevelLabels = {
  light: 'Легкая',
  medium: 'Средняя',
  strong: 'Сильная',
};
