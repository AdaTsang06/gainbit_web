import React from 'react';

const orderArrow = ({ width = '16', height = '16', fill = '#C4212C' }) => (
  <svg
    version="1.1"
    baseProfile="tiny"
    id="Layer_1"
    x="0px"
    y="0px"
    width={`${width}px`}
    height={`${height}px`}
    viewBox={`0 0 ${width} ${height}`}
    xmlSpace="preserve"
  >
    <polygon fill={fill} points="0.833,2.583 15.067,7.885 0.833,13.186 " />
  </svg>
);
export default orderArrow;
