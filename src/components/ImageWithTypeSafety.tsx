import type { CssCoordinate } from "@/lib/types";
import type { ComponentProps } from "react";
import { Image } from "react-konva";

type ImageWithTypeSafetyProps = ComponentProps<typeof Image> & {
  x: CssCoordinate;
  y: CssCoordinate;
};

export const ImageWithTypeSafety = ({
  x,
  y,
  ...props
}: ImageWithTypeSafetyProps) => {
  return <Image x={x} y={y} {...props} />;
};
