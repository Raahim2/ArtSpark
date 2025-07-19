import React from 'react';
import { Svg, Defs, Pattern, Rect, Path } from 'react-native-svg';

const SVG9 = (props) => (
  <Svg {...props}>
    <Defs>
      <Pattern
        id="a"
        width={45}
        height={51.96}
        patternTransform={`scale(${props.scale || 2})`}
        patternUnits="userSpaceOnUse"
      >
        <Rect width="100%" height="100%" fill={props.fill || "#2b2b31"} />
        <Path
          fill="none"
          strokeWidth={props.strokeWidth || 1}
          stroke={props.stroke || "#ecc94b"}
          d="M52.48 44.47a15 15 0 0 1-14.96 0 15 15 0 0 0-7.48 12.96M7.48 44.42a15 15 0 0 1-14.96 0M15 57.44c0-5.35-2.9-10.35-7.52-13.02a15 15 0 0 1 7.48-12.97M7.48 18.5a14.97 14.97 0 0 1-14.98-.03m15.02-.03A15 15 0 0 1 15 5.47a15 15 0 0 0-4.4-10.62m23.8.05A15 15 0 0 0 30 5.53a15 15 0 0 1 7.48 12.96 14.9 14.9 0 0 0 15.02-.03m-22.5 13a15.13 15.13 0 0 1 7.52 13.01m-7.56-39a15 15 0 0 1-14.96 0M7.48 18.5a15 15 0 0 1 7.48 12.96 15 15 0 0 0 15.04 0 15 15 0 0 1 7.48-12.96" 
        />
      </Pattern>
    </Defs>
    <Rect width="100%" height="100%" fill="url(#a)" />
  </Svg>
);

export default SVG9;
