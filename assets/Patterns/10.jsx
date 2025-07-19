import React from 'react';
import { Svg, Defs, Pattern, Rect, Path } from 'react-native-svg';

const SVG10 = (props) => (
  <Svg {...props}>
    <Defs>
      <Pattern
        id="a"
        width={60}
        height={36.043}
        patternTransform={`scale(${props.scale || 2})`}
        patternUnits="userSpaceOnUse"
      >
        <Rect width="100%" height="100%" fill={props.stroke || "#2b2b31"} />
        <Path
          fill={props.fill || "#ecc94b"}
          d="M20.001 0v11.998L30 18.046V0Zm19.998 0v11.998l10.002 6.051v11.995L60 36.043V11.998Zm-30 18.046v11.998l10.002 5.999H30v-5.999z"
        />
        <Path
          fill={props.fill || "#ecc94b"}
          d="M0 0v11.998L20.001 0Zm39.999 0L60 11.998V0ZM20.001 11.998 9.999 18.046 30 30.044l20.001-11.998-10.002-6.048L30 18.046ZM9.999 30.044 0 36.043h20.001zm40.002 0-10.002 5.999H60z"
        />
      </Pattern>
    </Defs>
    <Rect width="800%" height="800%" fill="url(#a)" />
  </Svg>
);

export default SVG10;
