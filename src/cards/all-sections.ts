import { html, LitElement } from 'lit';
import { StyleInfo } from 'lit-html/directives/style-map.js';
import { titleStyle } from '../sharedStyle';
import { CardConfig, Section, Size } from '../types';
import { getWidth, haCardStyle, isMobile, sharedStyle, stylable, validateConfig } from '../utils';
import { property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';

export class AllSections extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() config!: CardConfig;

  render() {
    if (this.config.singleSectionMode) {
      return this.renderDeprecatedSingleSectionMode();
    }
    return html`
      <ha-card style="${haCardStyle(this.config)}">
        <div style="${this.titleStyle()}">${this.config.name}</div>
        <div style="${this.contentStyle()}">
          <div style=${this.groupsStyle()}>
            <sonos-groups-mg .config=${this.config} .hass=${this.hass}></sonos-groups-mg>
          </div>

          <div style=${this.playersStyle()}>
            <sonos-player-mg .config=${this.config} .hass=${this.hass}></sonos-player-mg>
            <sonos-grouping-mg .config=${this.config} .hass=${this.hass}></sonos-grouping-mg>
          </div>

          <div style=${this.mediaBrowserStyle()}>
            <sonos-media-browser-mg .config=${this.config} .hass=${this.hass}></sonos-media-browser-mg>
          </div>
        </div>
      </ha-card>
    `;
  }

  private renderDeprecatedSingleSectionMode() {
    switch (this.config.singleSectionMode) {
      case Section.GROUPING:
        return html` <sonos-grouping-mg .config=${this.config} .hass=${this.hass}></sonos-grouping-mg> `;
      case Section.GROUPS:
        return html` <sonos-groups-mg .config=${this.config} .hass=${this.hass}></sonos-groups-mg> `;
      case Section.MEDIA_BROWSER:
        return html` <sonos-media-browser-mg .config=${this.config} .hass=${this.hass}></sonos-media-browser-mg> `;
      case Section.PLAYER:
      default:
        return html` <sonos-player-mg .config=${this.config} .hass=${this.hass}></sonos-player-mg> `;
    }
  }

  setConfig(config: CardConfig) {
    const parsed = JSON.parse(JSON.stringify(config));
    parsed.showAllSections = !parsed.singleSectionMode;
    validateConfig(parsed);
    this.config = parsed;
  }

  private titleStyle() {
    return stylable('title', this.config, { display: this.config.name ? 'block' : 'none', ...titleStyle });
  }

  private groupsStyle() {
    return this.columnStyle(this.config.layout?.groups, '1', '25%', 'groups', {
      padding: '0 1rem',
      boxSizing: 'border-box',
    });
  }

  private playersStyle() {
    return this.columnStyle(this.config.layout?.players, '0', '40%', 'players');
  }

  private mediaBrowserStyle() {
    return this.columnStyle(this.config.layout?.mediaBrowser, '2', '25%', 'media-browser', {
      padding: '0 1rem',
      boxSizing: 'border-box',
    });
  }

  private columnStyle(
    size: Size | undefined,
    order: string,
    defaultWidth: string,
    name: string,
    additionalStyle?: StyleInfo,
  ) {
    const width = getWidth(this.config, defaultWidth, '100%', size);
    let style: StyleInfo = {
      width: width,
      maxWidth: width,
      ...additionalStyle,
    };
    if (isMobile(this.config)) {
      style = {
        ...style,
        order,
        padding: '0.5rem',
        margin: '0',
        boxSizing: 'border-box',
      };
    }
    return stylable(name, this.config, style);
  }

  private contentStyle() {
    return stylable('content', this.config, {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
    });
  }

  static get styles() {
    return sharedStyle;
  }
}
