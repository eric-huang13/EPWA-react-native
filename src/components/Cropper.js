import React, { Component } from 'react';
import { View } from 'react-native';
import {DragResizeBlock} from './DragResizeShape';

class Cropper extends Component {
  render() {
    const {maxWidth, maxHeight} = this.props;
    return (
      <DragResizeBlock
        x={0}
        y={0}
        w={maxWidth - 48}
        h={maxHeight / 4}
        limitation={{
          x: 0,
          y: 0,
          w: maxWidth - 48,
          h: maxHeight,
        }}
        connectors={['tl', 'tr', 'br', 'bl', 'c']}
        size={10}
        zIndex={2}
        borderColor="#6038B5"
        borderBackground="#AC76DB"
        onResizeEnd={(coord) => {
          console.log('onResizeEnd', coord);
        }}
        onDragEnd={(coord) => {
          console.log('onDragEnd', coord);
        }}
        style={{
          borderStyle: 'dotted',
          borderColor: '#6038B5',
          borderWidth: 3
        }}
      >
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            borderColor: '#6038B5',
            borderWidth: 3,
            borderStyle: 'dashed',
            borderRadius: 1,
            borderTopColor:'white'
          }}
        />
      </DragResizeBlock>
    )
  }
}
export default Cropper;