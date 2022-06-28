///Derived from:
///https://stackoverflow.com/questions/47683591/react-native-different-styles-applied-on-orientation-change/61838183#61838183
///
import {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

/**
 * Returns true if the screen is in portrait mode
 */
const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

/**
 * A React Hook which updates when the orientation changes
 * @returns whether the user is in 'PORTRAIT' or 'LANDSCAPE'
 */
export function useOrientation(){
  // State to hold the connection status
  const [orientation, setOrientation] = useState("PORTRAIT", "LANDSCAPE");

  useEffect(() => {
    const callback = () => setOrientation(isPortrait() ? 'PORTRAIT' : 'LANDSCAPE');

    Dimensions.addEventListener('change', callback);
  }, []);
  return orientation;
}