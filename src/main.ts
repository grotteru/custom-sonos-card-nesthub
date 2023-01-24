import { Player } from './cards/player';
import { AllSections } from './cards/all-sections';
import { Grouping } from './cards/grouping';
import { Groups } from './cards/groups';
import { MediaBrowser } from './cards/media-browser';
import { CustomSonosCard } from './cards/custom-sonos-card';

const name = (type?: string) => `Sonos${type ? ` (${type})` : ''}`;
const desc = (type?: string) => `Media player for your Sonos speakers${type ? ` (${type})` : ''}`;

window.customCards.push(
  {
    type: 'sonos-card-mg',
    name: name(),
    description: desc(),
    preview: true,
  },
  {
    type: 'sonos-grouping-mg',
    name: name('Grouping section'),
    description: desc('Grouping section'),
    preview: true,
  },
  {
    type: 'sonos-groups-mg',
    name: name('Groups section'),
    description: desc('Groups section'),
    preview: true,
  },
  {
    type: 'sonos-media-browser-mg',
    name: name('Media Browser section'),
    description: desc('Media Browser section'),
    preview: true,
  },
  {
    type: 'sonos-player-mg',
    name: name('Player section'),
    description: 'Media player for your Sonos speakers (Player section)',
    preview: true,
  },
);

customElements.define('custom-sonos-card', CustomSonosCard);
customElements.define('sonos-card-mg', AllSections);
customElements.define('sonos-grouping-mg', Grouping);
customElements.define('sonos-groups-mg', Groups);
customElements.define('sonos-media-browser-mg', MediaBrowser);
customElements.define('sonos-player-mg', Player);
