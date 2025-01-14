import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import { getCurrentTrack, sharedStyle, stylable } from '../utils';
import { CardConfig } from '../types';

class PlayerHeader extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() config!: CardConfig;
  @property() entity!: HassEntity;
  render() {
    const attributes = this.entity.attributes;
    return attributes.media_title
      ? html`
          <div style="${this.infoStyle()}">
            <div style="${this.entityStyle()}">${attributes.friendly_name}</div>
            <div style="${this.songStyle()}">${getCurrentTrack(this.entity)}</div>
            <div style="${this.artistAlbumStyle()}">${attributes.media_album_name}</div>
            <sonos-progress
              .hass=${this.hass}
              .entityId=${this.entity.entity_id}
              .config=${this.config}
            ></sonos-progress>
          </div>
        `
      : html` <div style="${this.noMediaTextStyle()}">
          <div style="${this.artistAlbumStyle()}">${attributes.friendly_name}</div>
          <div>${this.config.noMediaText ? this.config.noMediaText : '🎺 What do you want to play? 🥁'}</div>
        </div>`;
  }

  private infoStyle() {
    return stylable('player-info', this.config, {
      margin: '0.25rem',
      padding: '0.5rem',
      textAlign: 'center',
      background: 'var(--sonos-int-player-section-background)',
      borderRadius: 'var(--sonos-int-border-radius)',
    });
  }

  private entityStyle() {
    return stylable('player-entity', this.config, {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '0.75rem',
      fontWeight: '500',
      color: 'var(--sonos-int-artist-album-text-color)',
      whiteSpace: 'wrap',
    });
  }

  private artistAlbumStyle() {
    return stylable('player-artist-album', this.config, {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '0.75rem',
      fontWeight: '300',
      color: 'var(--sonos-int-artist-album-text-color)',
      whiteSpace: 'wrap',
    });
  }

  private songStyle() {
    return stylable('player-song', this.config, {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: '1.15rem',
      fontWeight: '400',
      color: 'var(--sonos-int-song-text-color)',
      whiteSpace: 'wrap',
    });
  }

  private noMediaTextStyle() {
    return stylable('no-media-text', this.config, {
      flexGrow: '1',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0.25rem',
      padding: '0.5rem',
    });
  }

  static get styles() {
    return sharedStyle;
  }
}

customElements.define('sonos-player-header', PlayerHeader);
