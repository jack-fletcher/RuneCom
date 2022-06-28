import {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

/**
 * Gets the font scale multiplier based on screen size
 */

/**
 * @returns the new size of the font
 */
export function scaleFont(size){

const dim = Dimensions.get('screen');

const scale = dim.width / 320;

const scaledFont = size * scale;

  return scaledFont;
}