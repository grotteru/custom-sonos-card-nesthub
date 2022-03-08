import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { MediaPlayerItem } from '../types';

class MediaButton extends LitElement {
  @property() mediaItem!: MediaPlayerItem;

  render() {
    return html`
      <div class="media-button-wrapper">
        <div
          class="media-button ${this.mediaItem.thumbnail || this.mediaItem.can_expand ? 'image' : ''}"
          style="${this.mediaItem.thumbnail ? `background-image: url(${this.mediaItem.thumbnail});` : ''};"
        >
          <div class="title ${this.mediaItem.thumbnail || this.mediaItem.can_expand ? 'title-with-image' : ''}">
            ${this.mediaItem.title}
          </div>
          ${this.mediaItem.can_expand && !this.mediaItem.thumbnail
            ? html` <ha-icon class="folder" .icon=${'mdi:folder-music'}></ha-icon>`
            : ''}
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      .media-button-wrapper {
        padding: 0 0.3rem 0.4rem 0.3rem;
        box-sizing: border-box;
      }
      .media-button {
        overflow: hidden;
        border: var(--sonos-int-border-width) solid var(--sonos-int-background-color);
        display: flex;
        flex-direction: column;
        border-radius: var(--sonos-int-border-radius);
        justify-content: center;
        background-color: var(--sonos-int-background-color);
        box-shadow: var(--sonos-int-box-shadow);
      }
      .image {
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 100%;
      }
      .title {
        width: calc(100% - 1.2rem);
        font-size: 1rem;
        padding: 0px 0.5rem;
      }
      .title-with-image {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: var(--sonos-int-media-button-white-space);
        background-color: var(--sonos-int-player-section-background);
        border-radius: calc(var(--sonos-int-border-radius) - 0.25rem) calc(var(--sonos-int-border-radius) - 0.25rem) 0 0;
        position: absolute;
        top: 0.1rem;
        left: 0.1rem;
      }
      .media-button:focus,
      .media-button:hover {
        border-color: var(--sonos-int-accent-color);
      }
      .folder {
        margin-bottom: -30%;
        height: 100%;
        --mdc-icon-size: 1;
      }
    `;
  }
}

customElements.define('sonos-media-button', MediaButton);