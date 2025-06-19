import { Stage, Layer, Text, Rect } from "react-konva";
import mowerPictureUrl from "../assets/mower.png";
import useImage from "use-image";
import type { BoardCoordinate, Mower } from "@/lib/types";
import { ImageWithTypeSafety } from "./ImageWithTypeSafety";
import {
  getCssCoordinatesFromBoardCoordinates,
  getMowerAnimationSteps,
  numberToCssCoordinate,
} from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import Konva from "konva";

const DIRECTION_TO_ROTATION = {
  N: 180,
  E: 270,
  S: 0,
  W: 90,
};

type MowerProps = {
  mower: Mower;
  squareSize: number;
  maxCoordinates: { x: BoardCoordinate; y: BoardCoordinate };
  onAnimationComplete: () => void;
  shouldAnimate: boolean;
};

const MowerUI = ({
  mower,
  squareSize,
  onAnimationComplete,
  shouldAnimate,
  maxCoordinates,
}: MowerProps) => {
  const [mowerImage] = useImage(mowerPictureUrl);
  const imageRef = useRef<Konva.Image>(null);

  const { start, instructions } = mower;

  const width = squareSize * 0.6;
  const height = width * 1.5;

  const startCoords = getCssCoordinatesFromBoardCoordinates({
    x: start.x,
    y: start.y,
    squareSize,
    maxY: maxCoordinates.y,
  });

  const startX = numberToCssCoordinate(startCoords.x + squareSize / 2);
  const startY = numberToCssCoordinate(startCoords.y + squareSize / 2);

  useEffect(() => {
    if (!mowerImage || !imageRef.current || !shouldAnimate) return;

    const steps = getMowerAnimationSteps({
      instructions,
      startDirection: start.direction,
      startCoordinates: { x: start.x, y: start.y },
      maxCoordinates,
    });

    const animate = async () => {
      for (const step of steps) {
        await new Promise<void>((resolve) => {
          const targetCoords = getCssCoordinatesFromBoardCoordinates({
            x: step.x,
            y: step.y,
            squareSize,
            maxY: maxCoordinates.y,
          });

          const tween = new Konva.Tween({
            node: imageRef.current!,
            duration: 0.5,
            x: numberToCssCoordinate(targetCoords.x + squareSize / 2),
            y: numberToCssCoordinate(targetCoords.y + squareSize / 2),
            rotation: DIRECTION_TO_ROTATION[step.direction],
            easing: Konva.Easings.Linear,
            onFinish: resolve,
          });
          tween.play();
        });
      }
      onAnimationComplete();
    };

    animate();
  }, [
    mowerImage,
    instructions,
    start,
    squareSize,
    onAnimationComplete,
    shouldAnimate,
  ]);

  if (!mowerImage) return null;

  return (
    <ImageWithTypeSafety
      ref={imageRef}
      x={startX}
      y={startY}
      image={mowerImage}
      width={width}
      height={height}
      offsetX={width / 2}
      offsetY={height / 2}
      rotation={DIRECTION_TO_ROTATION[start.direction]}
    />
  );
};

const SQUARE_SIZE_MAX = 100;
const SQUARE_SIZE_MIN = 50;

type BoardWithCoordinatesProps = {
  maxCoordinates: { x: BoardCoordinate; y: BoardCoordinate };
  mowers: Mower[];
};
export const BoardWithCoordinates = ({
  maxCoordinates,
  mowers = [],
}: BoardWithCoordinatesProps) => {
  const [stageSize, setStageSize] = useState({
    width: 0,
    height: 0,
  });
  const [squareSize, setSquareSize] = useState(SQUARE_SIZE_MIN);
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const [currentMowerIndex, setCurrentMowerIndex] = useState(0);

  const handleAnimationComplete = () => {
    setCurrentMowerIndex((prev) => prev + 1);
  };

  const xMax = maxCoordinates.x + 1;
  const yMax = maxCoordinates.y + 1;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const containerWidth = entry.contentRect.width;

        if (containerWidth === 0) return;

        const yAxisLabelPadding = 40;
        const xAxisLabelPadding = 30;

        const availableWidthForGrid = containerWidth - yAxisLabelPadding;
        if (availableWidthForGrid <= 0) return;

        let newSquareSize = availableWidthForGrid / xMax;
        newSquareSize = Math.max(SQUARE_SIZE_MIN, newSquareSize);
        newSquareSize = Math.min(SQUARE_SIZE_MAX, newSquareSize);

        setSquareSize(newSquareSize);
        setStageSize({
          // width: containerWidth,
          width: xMax * newSquareSize + xAxisLabelPadding,
          height: yMax * newSquareSize + xAxisLabelPadding,
        });
      }
    });

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [xMax, yMax]);

  return (
    <div
      className="p-4 border-2 border-gray-300 rounded-lg flex justify-center overflow-x-scroll"
      ref={containerRef}
    >
      <Stage width={stageSize.width} height={stageSize.height}>
        <Layer>
          {[...Array(yMax)].map((_, i) =>
            [...Array(xMax)].map((_, j) => (
              <Rect
                key={`${i}-${j}`}
                x={j * squareSize}
                y={i * squareSize}
                width={squareSize}
                height={squareSize}
                fill={(i + j) % 2 === 0 ? "#f0f0f0" : "#d3d3d3"}
              />
            ))
          )}
        </Layer>

        <Layer>
          {[...Array(yMax)].map((_, i) => (
            <Text
              key={`yAxis-${i}`}
              text={`${yMax - 1 - i}`}
              x={xMax * squareSize + 10}
              y={i * squareSize + squareSize / 2 - 10}
              fontSize={12}
            />
          ))}

          {[...Array(xMax)].map((_, j) => (
            <Text
              key={`xAxis-${j}`}
              text={`${j}`}
              x={j * squareSize + squareSize / 2 - 5}
              y={yMax * squareSize + 10}
              fontSize={12}
            />
          ))}
        </Layer>

        <Layer ref={layerRef}>
          {mowers.map(
            (mower, index) =>
              currentMowerIndex >= index && (
                <MowerUI
                  key={index}
                  mower={mower}
                  squareSize={squareSize}
                  maxCoordinates={{
                    x: maxCoordinates.x,
                    y: maxCoordinates.y,
                  }}
                  onAnimationComplete={handleAnimationComplete}
                  shouldAnimate={currentMowerIndex === index}
                />
              )
          )}
        </Layer>
      </Stage>
    </div>
  );
};
