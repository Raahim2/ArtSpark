import React from 'react';
import { Svg, Defs, Pattern, Rect, Path } from 'react-native-svg';

const SVG5 = (props) => (
  <Svg {...props}>
    <Defs>
      <Pattern
        id="a"
        width={40}
        height={40}
        patternTransform={`scale(${props.scale || 3})`}
        patternUnits="userSpaceOnUse"
      >
        <Rect width="100%" height="100%" fill={props.fill || "#2b2b31"} />
        <Path
          fill="none"
          strokeWidth={props.strokeWidth || 1}
          stroke={props.stroke || "#ecc94b"}
          d="M0 0h10v20H0zm30 0v10H10V0zM10 10h10v20H10zm30 0v10H20V10zM20 20h10v20H20zm30 0v10H30V20zM30 30h10v20H30zm-10 0v10H0V30zM10 20v10h-20V20zm20-30h10v20H30z" 
        />
      </Pattern>
    </Defs>
    <Rect width="800%" height="800%" fill="url(#a)" />
  </Svg>
);

export default SVG5;
