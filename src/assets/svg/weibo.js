import React from 'react';

const wechat = ({ color = '#FFFFFF' }) => (
  <svg
    version="1.1"
    id="Layer_1"
    x="0px"
    y="0px"
    width="32px"
    height="32px"
    viewBox="0 0 32 32"
    enableBackground="new 0 0 32 32"
  >
    <rect x="-2" y="-2.417" display="none" width="35.583" height="35.917" />
    {/*<path
      fill={color}
      d="M16,2C8.268,2,2,8.268,2,16s6.268,14,14,14s14-6.268,14-14S23.732,2,16,2z M16,29.562
	C8.51,29.562,2.438,23.49,2.438,16S8.51,2.438,16,2.438S29.562,8.51,29.562,16S23.49,29.562,16,29.562z"
    />*/}
    <g>
      <path
        fill={color}
        d="M21.344,15.375c0,0,1.062-2.469-0.75-2.906c-1.656-0.312-3.188,0.625-4.156,0.562
		c0,0,0.927-2.469-0.99-2.969c-1.917-0.5-8.321,3.594-8.775,8.094c0.012,0.014,0.023,0.023,0.034,0.037
		c-0.019,0.149-0.034,0.299-0.034,0.451c0,2.945,3.599,5.332,8.039,5.332s9.351-2.195,9.507-5.57
		C24.303,16.596,23.003,16.275,21.344,15.375z M14.281,22.859c-3.314,0-5.461-1.407-5.562-3.484
		c-0.109-2.234,2.339-4.098,5.641-4.376c3.344-0.281,6.156,0.927,6.359,3.438C20.921,20.938,17.595,22.859,14.281,22.859z"
      />
      <path
        fill={color}
        d="M25.249,9.612c-1.808-1.935-4.901-1.604-5.028-1.587c-0.343,0.04-0.588,0.349-0.549,0.691
		c0.039,0.343,0.354,0.592,0.69,0.551c0.025-0.003,2.606-0.27,3.977,1.203c0.831,0.894,1.078,2.289,0.734,4.146
		c-0.063,0.339,0.161,0.666,0.5,0.729c0.039,0.007,0.077,0.01,0.115,0.01c0.295,0,0.558-0.21,0.613-0.511
		C26.724,12.572,26.369,10.812,25.249,9.612z"
      />
      <path
        fill={color}
        d="M22.992,14.434c0.059,0.017,0.117,0.025,0.175,0.025c0.271,0,0.521-0.177,0.601-0.451
		c0.018-0.063,0.438-1.556-0.409-2.588c-0.557-0.677-1.476-0.963-2.726-0.855c-0.344,0.03-0.598,0.333-0.568,0.677
		c0.031,0.344,0.34,0.592,0.678,0.568c0.562-0.049,1.301-0.019,1.647,0.4c0.357,0.431,0.249,1.194,0.177,1.452
		C22.472,13.992,22.662,14.337,22.992,14.434z"
      />
      <path
        fill={color}
        d="M14.281,16.531c-1.516,0.062-3.5,1.375-3.219,3.344c0.162,1.132,1.096,2.29,2.828,2.203
		c2.484-0.125,3.657-1.685,3.625-2.828C17.453,16.999,15.643,16.475,14.281,16.531z M13.141,20.844
		c-0.492,0-0.844-0.422-0.891-0.812c-0.053-0.446,0.266-1.141,1.219-1.141c0.543,0,0.828,0.386,0.828,0.75
		C14.297,20.578,13.633,20.844,13.141,20.844z M14.93,19.109c-0.211,0-0.383-0.125-0.383-0.31c0-0.206,0.171-0.393,0.383-0.393
		s0.383,0.094,0.383,0.281C15.312,18.891,15.141,19.109,14.93,19.109z"
      />
    </g>
  </svg>
);
export default wechat;