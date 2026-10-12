import Phaser from 'phaser';
import { GameConfig } from './config/GameConfig';

window.addEventListener('DOMContentLoaded', () => {
  new Phaser.Game(GameConfig);
});
