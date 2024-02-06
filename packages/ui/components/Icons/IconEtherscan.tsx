import { cn } from '../../lib/utilities';
import { motion } from 'framer-motion';

export const IconEtherscan = ({
  className,
  ...props
}: React.ComponentProps<typeof motion.svg>) => (
  <motion.svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('[&>path]:fill-black', className)}
    {...props}
  >
    <path
      d="M5.07295 7.7317C5.07296 7.67603 5.08397 7.62092 5.10534 7.56952C5.12671 7.51811 5.15802 7.47143 5.19748 7.43216C5.23694 7.39289 5.28376 7.3618 5.33527 7.34068C5.38678 7.31956 5.44195 7.30883 5.49762 7.30908L6.20172 7.31138C6.31398 7.31138 6.42164 7.35597 6.50102 7.43535C6.5804 7.51474 6.625 7.62239 6.625 7.73465V10.397C6.70426 10.3734 6.80607 10.3483 6.91746 10.3221C6.99484 10.3039 7.0638 10.2602 7.11316 10.1979C7.16251 10.1356 7.18936 10.0584 7.18934 9.97892V6.67646C7.18934 6.56419 7.23393 6.45652 7.31331 6.37713C7.39269 6.29774 7.50035 6.25312 7.61262 6.2531H8.31811C8.43038 6.25312 8.53804 6.29774 8.61742 6.37713C8.6968 6.45652 8.74139 6.56419 8.74139 6.67646V9.74146C8.74139 9.74146 8.91803 9.66998 9.09008 9.59736C9.15399 9.57034 9.20853 9.52508 9.2469 9.46726C9.28527 9.40943 9.30575 9.34159 9.30582 9.2722V5.61826C9.30582 5.50602 9.3504 5.39837 9.42976 5.31899C9.50912 5.23961 9.61676 5.19501 9.72901 5.19498H10.4345C10.5468 5.19498 10.6544 5.23958 10.7338 5.31896C10.8132 5.39834 10.8578 5.506 10.8578 5.61826V8.6272C11.4694 8.18392 12.0893 7.6508 12.5811 7.00974C12.6525 6.91669 12.6998 6.80743 12.7186 6.69169C12.7375 6.57596 12.7274 6.45735 12.6893 6.34646C12.4616 5.69136 12.0997 5.091 11.6266 4.58381C11.1536 4.07661 10.5799 3.67375 9.94225 3.401C9.3046 3.12825 8.61702 2.99163 7.92353 2.99986C7.23004 3.0081 6.54591 3.16102 5.91492 3.44883C5.28392 3.73665 4.71995 4.15302 4.25911 4.6713C3.79826 5.18959 3.45069 5.79837 3.23863 6.4587C3.02657 7.11902 2.9547 7.81634 3.02761 8.50603C3.10052 9.19573 3.31661 9.86261 3.66205 10.464C3.72222 10.5677 3.81075 10.6522 3.91724 10.7073C4.02372 10.7625 4.14374 10.7861 4.2632 10.7755C4.39664 10.7638 4.56279 10.7471 4.76033 10.7239C4.84632 10.7142 4.92571 10.6731 4.98338 10.6086C5.04105 10.544 5.07296 10.4605 5.07303 10.374L5.07295 7.7317Z"
      fill="#A2B5DA"
    />
    <path
      d="M5.05755 12.0018C5.80118 12.5428 6.67999 12.8675 7.59674 12.9401C8.51349 13.0125 9.43243 12.8301 10.2519 12.4127C11.0714 11.9953 11.7593 11.3594 12.2398 10.5753C12.7202 9.79118 12.9744 8.88943 12.9742 7.96981C12.9742 7.85506 12.9689 7.74152 12.9612 7.62865C11.14 10.3449 7.77715 11.6152 5.05755 12.0018Z"
      fill="#A2B5DA"
      fillOpacity="0.7"
    />
  </motion.svg>
);