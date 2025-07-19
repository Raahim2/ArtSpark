// ../Components/PixcelArt/CheckerboardBackground.js
import React, { useMemo } from 'react';
import { Rect } from '@shopify/react-native-skia';
import { GRID_SIZE } from './utils';

const CHECKERBOARD_LIGHT = '#E5E7EB';
const CHECKERBOARD_DARK = '#D1D5DB';

const CheckerboardBackground = ({ layout }) => {
  const squares = useMemo(() => {
    if (!layout || layout.cellSize === 0) return [];
    const cells = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        cells.push({
          key: `${r}-${c}`, x: c * layout.cellSize, y: r * layout.cellSize,
          color: (r + c) % 2 === 0 ? CHECKERBOARD_LIGHT : CHECKERBOARD_DARK,
        });
      }
    }
    return cells;
  }, [layout]);

  return (
    <>
      {squares.map(s => (
        <Rect key={s.key} x={s.x} y={s.y} width={layout.cellSize} height={layout.cellSize} color={s.color} />
      ))}
    </>
  );
};

export default React.memo(CheckerboardBackground);