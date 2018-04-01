import React from 'react'
import {PixelRatio, Dimensions} from 'react-native'
// import Dimensions from ''

export const Utils = {
  ratio: PixelRatio.get(),
  pixel: 1 / PixelRatio.get(),
  size: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
}

