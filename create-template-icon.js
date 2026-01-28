// Create a proper macOS template icon (black with transparency)
const fs = require('fs');
const path = require('path');

// A simple 16x16 black star icon as base64 PNG (template format)
// This is black on transparent, which works as a template image
const iconBase64 = `iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlz
AAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAE4SURB
VDiNpZMxTsNAEEXfzK4dO0BEh0SBaKiQqGgpKCjo6bgBd+EmdNyFO3ALik3FCQUVEhI1FR0VEgUS
wmvvTo8jjBMgAq2k1Wr39P/OzKxCRNDpdBAEAVzXheu6qFQqyLIMuVzuMAxDhGEIAMjlctB1HUSE
LMsQBAE6nQ4URYGiKBARpJT4d5imaaCqKvr9PsbGxlCv12GaJizLgmEYaDabqNVqGBoaQqVSgWVZ
EEJI+H4AYFpV1SFd12HbNnRdh2EY0DQNuq7Dtm3ous47BAA+Y/EfgCRJEMcxFEWBiEBVVSRJgiRJ
oCgKoiiCiODzHKdpijAMoes6kiRBGIYQQiCOY4gI4jiGEAJhGEJKOZPL5XKapmF8fByNRgOj09MY
nphAc3IShUIBQRAgjmMAAMdxsCgEfd/HkuM8A/gG+dplb0yG9FQAAAAASUVORK5CYII=`;

const iconPath = path.join(__dirname, 'iconTemplate.png');

// Create the icon file
const buffer = Buffer.from(iconBase64.replace(/\s/g, ''), 'base64');
fs.writeFileSync(iconPath, buffer);

console.log('Template icon created at:', iconPath);
