import { html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import { isPlaying, stylable } from '../utils';
import { CardConfig } from '../types';

class Progress extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() config!: CardConfig;
  @property() public entityId!: string;
  @state() private playingProgress!: number;
  private entity!: HassEntity;
  private tracker?: NodeJS.Timer;

  disconnectedCallback() {
    if (this.tracker) {
      clearInterval(this.tracker);
      this.tracker = undefined;
    }
    super.disconnectedCallback();
  }

  render() {
    this.entity = this.hass.states[this.entityId];
    const mediaDuration = this.entity?.attributes.media_duration || 0;
    const showProgress = mediaDuration > 0;
    if (showProgress) {
      this.trackProgress();
      return html`
        <div style="${this.progressStyle()}">
          <span style="${this.timeStyle()}">${convertProgress(this.playingProgress)}</span>
          <div style="${this.barStyle()}">
            <paper-progress
              value="${this.playingProgress}"
              max="${mediaDuration}"
              style="${this.paperProgressStyle()}"
            ></paper-progress>
          </div>
          <span style="${this.timeStyle()}"> -${convertProgress(mediaDuration - this.playingProgress)}</span>
        </div>
      `;
    }
    return html``;
  }

  progressStyle() {
    return stylable('progress', this.config, {
      width: '100%',
      fontSize: 'x-small',
      display: 'flex',
      '--paper-progress-active-color': 'lightgray',
    });
  }

  timeStyle() {
    return stylable('progress-time', this.config);
  }

  barStyle() {
    return stylable('progress-bar', this.config, {
      display: 'flex',
      'flex-grow': '1',
      'align-items': 'center',
      padding: '5px',
    });
  }

  trackProgress() {
    const position = this.entity?.attributes.media_position || 0;
    const playing = isPlaying(this.entity?.state);
    const updatedAt = this.entity?.attributes.media_position_updated_at || 0;
    if (playing) {
      this.playingProgress = position + (Date.now() - new Date(updatedAt).getTime()) / 1000.0;
    } else {
      this.playingProgress = position;
    }
    if (!this.tracker) {
      this.tracker = setInterval(() => this.trackProgress(), 1000);
    }
    if (!playing) {
      clearInterval(this.tracker);
      this.tracker = undefined;
    }
  }

  private paperProgressStyle() {
    return stylable('progress-bar-paper', this.config, {
      flexGrow: '1',
      '--paper-progress-active-color': 'var(--sonos-int-accent-color)',
    });
  }
}

const convertProgress = (duration: number) => {
  const date = new Date(duration * 1000).toISOString().substring(11, 19);
  return date.startsWith('00:') ? date.substring(3) : date;
};

customElements.define('sonos-progress', Progress);
