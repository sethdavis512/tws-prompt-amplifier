// Simple script to create a tray icon
// Run this once before starting the app if icon.png doesn't exist

const fs = require('fs');
const path = require('path');

// A simple 16x16 purple star icon as base64 PNG
// This is a pre-generated icon for convenience
const iconBase64 = `iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlz
AAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGeSURB
VDiNlZM9SwNBEIbfvb3EGEzEQgsRBEUQLMROCzvtxNZGO3+Av8DOxt5ObPwJgo2Nha2FnYiNIFgE
IQSMSYx3t+OeFxy5S2bYnXln5p3ZFf6TsiyTLMt+9d1uF67rAgCEECiKAgBQVRVhGEZJkiQIgsD9
/X1YlgXHcZAkCYQQyPMcuq5jOBwGSZJ4w+Ew5HkeiqJAVVUIIZBlGWzbRr/fR5IkGA6HYRiGSJLE
V1UVpmmiqipEUYSqqrBtG47joNVqIYoihGGIMAzjIAgiy7Lguq7b7XZ9XddRliVGoxHa7TZM00Sc
xDgajRD4Poq8QEtT4boOyqKA5/soihK2baNWq0FRFARBEFqWhXq9jiAIMB6P0ev1UCYJiiJHo9FA
HMdotVoYDodot9swTROu68KybCSJD9M0Ua/XQ8dx0Gq1oGka4jjGdDqFruuYz+dwXRe6oaPRaIRK
pYJKpQLLspCmKWazGWq1GlqtFjzPQ5IkSNMUWZahVqshTVM4joNGowHP8xDHMQYDAaA0yzKZpmmE
bduZEAKO4/wAgHCJ3eAkwTMAAAAASUVORK5CYII=`;

const iconPath = path.join(__dirname, 'icon.png');

// Create the icon file
const buffer = Buffer.from(iconBase64, 'base64');
fs.writeFileSync(iconPath, buffer);

console.log('Icon created at:', iconPath);
