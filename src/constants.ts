import { ImageProps } from 'react-native';

export const BACKGROUND_COLOR = '#F1F1F1';

export interface PageInterface extends Pick<ImageProps, 'source'> {
  title: string;
  description: string;
}

export const PAGES: PageInterface[] = [
  {
    title: 'Seamlessly share live GPS coordinates',
    description:
      'Navigate in real time and auto-notify your destination with pinpoint digital accuracy',
    source: require('./assets/skates/01.png'),
  },
  {
    title: 'Level up your experience',
    description:
      "Subscribe to enable a smart LED beacon that lights up your destination with one tap.",
    source: require('./assets/skates/02.png'),
  },
  {
    title: 'Trigger a smart LED device',
    description:
      'Trigger a smart LED device from your phone to visually verify exact arrival points. No guessing, just precision.',
    source: require('./assets/skates/03.png'),
  },
];
