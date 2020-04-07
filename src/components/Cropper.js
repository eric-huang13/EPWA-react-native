import React, { Component } from 'react';
import { View } from 'react-native';
import {DragResizeBlock} from './DragResizeShape';

class Cropper extends Component {
  componentDidMount() {
    const {x, y, w, h, onChange} = this.props;

    if (onChange && typeof onChange === 'function') {
      onChange({x, y, w, h});
    }
  }

  toObject = (coord) => {
    return {
      x: coord[0],
      y: coord[1],
      w: coord[2],
      h: coord[3],
    }
  };

  render() {
    const {x, y, w, h, maxWidth, maxHeight, onChange, size, isDisabled} = this.props;
    return (
      <DragResizeBlock
        x={x || 0}
        y={y || 0}
        w={w || 40}
        h={h || 40}
        limitation={{
          x: 0,
          y: 0,
          w: (maxWidth - 48) || 80,
          h: maxHeight || 80,
        }}
        connectors={['tl', 'tr', 'br', 'bl', 'c']}
        size={size || 15}
        zIndex={2}
        borderColor="#6038B5"
        borderBackground="#AC76DB"
        isDisabled={isDisabled}
        onResizeEnd={(coord) => {
          if (onChange && typeof onChange === 'function') {
            onChange(this.toObject(coord));
          }
        }}
        onDragEnd={(coord) => {
          if (onChange && typeof onChange === 'function') {
            onChange(this.toObject(coord));
          }
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
            borderRadius: 1
          }}
        />
      </DragResizeBlock>
    )
  }
}
export default Cropper;