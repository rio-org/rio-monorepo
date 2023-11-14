import React from 'react'

type Props = {
  direction: 'left' | 'right'
}

const IconLineArrow = ({ direction = "right" }: Props) => {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      transform={`rotate(${direction === 'left' ? 180 : 0})`}
    >
      <path opacity="0.5" d="M54.6647 95.6687L45.9184 87.0197L76.2877 56.6511H0V44.0177H76.2877L45.9184 13.6976L54.6647 5L100 50.3344L54.6647 95.6687Z" fill="black" />
    </svg>
  )
}

export default IconLineArrow