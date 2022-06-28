import {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';

/**
 * Returns true if the screen is in portrait mode
 */
 const getFontSize = (size) => {
    const dim = Dimensions.get('screen');
    var size;
    var scale = 1080 / 67.5
  };
  
  /**
   * A React Hook which updates with the screen size
   * @returns a font size based on the current screen size
   */
  export function getFontSize(size){
    // State to hold the connection status
    const [fontSize, setFontSize] = useState(0);
    useEffect(() => {
      const callback = () => setFontSize(getFontSize(size));
  
      Dimensions.addEventListener('change', callback);
    }, []);
    return fontSize;
  }