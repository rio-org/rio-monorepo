import React from 'react';

type Props = {
  direction: 'up' | 'down';
};

const IconSelectArrow = ({ direction }: Props) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <svg
      width="12"
      height="8"
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      transform={`rotate(${direction === 'up' ? 180 : 0})`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <path
        d="M10.293 1.29308L6.00001 5.58608L1.70701 1.29308C1.51841 1.11092 1.26581 1.01013 1.00361 1.01241C0.741412 1.01469 0.4906 1.11985 0.305192 1.30526C0.119784 1.49067 0.0146148 1.74148 0.0123364 2.00368C0.010058 2.26588 0.110852 2.51848 0.29301 2.70708L5.29301 7.70708C5.48054 7.89455 5.73485 7.99987 6.00001 7.99987C6.26517 7.99987 6.51948 7.89455 6.70701 7.70708L11.707 2.70708C11.8025 2.61483 11.8787 2.50449 11.9311 2.38249C11.9835 2.26048 12.0111 2.12926 12.0123 1.99648C12.0134 1.8637 11.9881 1.73202 11.9378 1.60913C11.8876 1.48623 11.8133 1.37458 11.7194 1.28069C11.6255 1.18679 11.5139 1.11254 11.391 1.06226C11.2681 1.01198 11.1364 0.986677 11.0036 0.987831C10.8708 0.988985 10.7396 1.01657 10.6176 1.06898C10.4956 1.12139 10.3853 1.19757 10.293 1.29308Z"
        fill="black"
        fillOpacity={isHovered ? '0.7' : '0.35'}
      />
    </svg>
  );
};

export default IconSelectArrow;
