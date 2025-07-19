import React from 'react';
import { Svg, Defs, Pattern, Rect, Path } from 'react-native-svg';

const SVG2 = (props) => (
  <Svg {...props}>
    <Defs>
      <Pattern
        id="a"
        width={50.41}
        height={87}
        patternTransform={`scale(${props.scale || 2})`}
        patternUnits="userSpaceOnUse"
      >
        <Rect width="100%" height="100%" fill={props.fill || "#2b2b31"} />
        <Path
          fill="none"
          stroke={props.stroke || "#ecc94b"}
          strokeWidth={props.strokeWidth || 1}
          d="M25.3 87 12.74 65.25m0 14.5h-25.12m75.18 0H37.68M33.5 87l25.28-43.5m-50.23 29 4.19 7.25L16.92 87h-33.48m33.48 0h16.75-8.37zM8.55 72.5 16.92 58m50.06 29h-83.54m79.53-50.75L50.4 14.5M37.85 65.24 50.41 43.5m0 29 12.56-21.75m-50.24-14.5h25.12zM33.66 29l4.2 7.25 4.18 7.25M33.67 58H16.92l-4.18-7.25M-8.2 72.5l20.92-36.25L33.66 0m25.12 72.5H42.04l-4.19-7.26L33.67 58l4.18-7.24 4.19-7.25M33.67 29l8.37-14.5h16.74m0 29H8.38m29.47 7.25H12.74M50.4 43.5 37.85 21.75m-.17 58L25.12 58M12.73 36.25.18 14.5M0 43.5l-12.55-21.75M24.95 29l12.9-21.75M12.4 21.75 25.2 0M12.56 7.25h-25.12m75.53 0H37.85M58.78 43.5 33.66 0h33.5m-83.9 0h83.89M33.32 29H16.57l-4.18-7.25-4.2-7.25m.18 29H-8.37M-16.74 0h33.48l-4.18 7.25-4.18 7.25H-8.37m8.38 58 12.73-21.75m-25.3 14.5L0 43.5m-8.37-29 21.1 36.25 20.94 36.24M8.37 72.5H-8.36"
        />
      </Pattern>
    </Defs>
    <Rect
      width="800%"
      height="800%"
      fill="url(#a)"
    />
  </Svg>
);

export default SVG2;
