import React from 'react';
import { Svg, Defs, Pattern, Rect, Path } from 'react-native-svg';

const SVG3 = (props) => (
  <Svg {...props}>
    <Defs>
      <Pattern
        id="a"
        width={23.07}
        height={40}
        patternTransform={`scale(${props.scale || 2})`}
        patternUnits="userSpaceOnUse"
      >
        <Rect width="100%" height="100%" fill={props.fill || "#2b2b31"} />
        <Path
          fill="none"
          stroke={props.stroke || "#ecc94b"}
          strokeLinecap="square"
          strokeWidth={props.strokeWidth || 1}
          d="m17.62 0-6.07 10.5m2.74 4.76L8.22 4.75m-5.48 0h12.13M.01 0h23.07M6.07 20 0 9.5m2.74-4.75-6.07 10.5m-5.48 0H3.33m8.2 4.75L0 .02-11.54 20m40.68 0L23.07 9.5m2.74-4.75-6.06 10.5m-5.49 0H26.4M34.6 20 23.08.02 11.53 20m-5.46 0L0 30.51m2.74 4.75-6.07-10.5m-5.48 0H3.33m8.2-4.75L0 40l-11.54-19.98zM17.6 40l-6.06-10.5m2.74-4.76L8.2 35.25m-5.48 0h12.13M0 40h23.07L11.54 20.01m17.6 0-6.07 10.5m2.74 4.75-6.06-10.5m-5.49 0H26.4M11.53 20h23.08L23.07 40"
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

export default SVG3;
