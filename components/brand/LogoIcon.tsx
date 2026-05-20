import type { CSSProperties } from "react";

type LogoIconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: CSSProperties;
};

export function LogoIcon({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  style,
}: LogoIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-3 -3 30 30"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      aria-hidden="true"
      style={style}
    >
      <g transform="rotate(-45 12 12)">
        <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16151496 C3.50612381,-0.1 2.40999899,0.0570974309 1.77946707,0.4744748 C0.994623095,1.1077932 0.837654326,2.0503775 1.15159189,2.99696189 L3.03521743,9.43788479 C3.03521743,9.59498213 3.19218622,9.75207947 3.50612381,9.75207947 L16.6915026,10.5375664 C16.6915026,10.5375664 17.1624089,10.5375664 17.1624089,11.0088585 C17.1624089,11.4801506 16.6915026,11.5363379 16.6915026,12.4744748 Z" />
      </g>
    </svg>
  );
}
