import { Stage, Layer, Text, Label, Tag } from "react-konva";
import mowerPictureUrl from "../assets/mower.png";
import grassPictureUrl from "../assets/gass.png";
import useImage from "use-image";
import type { BoardCoordinate, Direction, Mower } from "@/lib/types";
import { ImageWithTypeSafety } from "./ImageWithTypeSafety";
import {
  getCssCoordinatesFromBoardCoordinates,
  getMowerAnimationSteps,
  getShortestRotation,
  numberToCssCoordinate,
} from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import Konva from "konva";

const DIRECTION_TO_ROTATION = {
  N: 180,
  E: -90,
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
  const [finalPosition, setFinalPosition] = useState<{
    x: BoardCoordinate;
    y: BoardCoordinate;
    direction: Direction;
  } | null>(null);
  const labelRef = useRef<Konva.Label>(null);
  const rotationRef = useRef(DIRECTION_TO_ROTATION[mower.start.direction]);

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

          const newRotation = getShortestRotation(
            rotationRef.current,
            DIRECTION_TO_ROTATION[step.direction]
          );
          rotationRef.current = newRotation;
          const tween = new Konva.Tween({
            node: imageRef.current!,
            duration: 0.5,
            x: numberToCssCoordinate(targetCoords.x + squareSize / 2),
            y: numberToCssCoordinate(targetCoords.y + squareSize / 2),
            rotation: newRotation,
            easing: Konva.Easings.Linear,
            onFinish: resolve,
          });
          if (labelRef.current) {
            const labelTween = new Konva.Tween({
              node: labelRef.current,
              duration: 0.5,
              x: numberToCssCoordinate(targetCoords.x + squareSize / 2),
              y: numberToCssCoordinate(
                targetCoords.y + squareSize / 2 - height / 2 - 30
              ),
              easing: Konva.Easings.Linear,
            });
            labelTween.play();
          }
          tween.play();
        });
      }
      const finalStep = steps[steps.length - 1];
      if (finalStep) {
        setFinalPosition(finalStep);
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
    maxCoordinates,
    height,
  ]);

  const finalCssCoordinates = finalPosition
    ? getCssCoordinatesFromBoardCoordinates({
        maxY: maxCoordinates.y,
        squareSize,
        x: finalPosition.x,
        y: finalPosition.y,
      })
    : null;

  if (!mowerImage) return null;

  return (
    <>
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
      {finalPosition && (
        <Label
          ref={labelRef}
          x={finalCssCoordinates ? finalCssCoordinates.x + squareSize / 2 : 0}
          y={finalCssCoordinates ? finalCssCoordinates.y + squareSize / 2 : 0}
        >
          <Tag
            fill="white"
            pointerDirection="down"
            pointerWidth={10}
            pointerHeight={10}
            lineJoin="round"
            shadowColor="black"
            shadowBlur={10}
            shadowOffset={{ x: 10, y: 10 }}
            shadowOpacity={0.5}
            cornerRadius={5}
            stroke="black"
          />
          <Text
            text={`x: ${finalPosition.x}\ny: ${finalPosition.y}\nDirection: ${finalPosition.direction}`}
            fontFamily="Calibri"
            fontSize={18}
            padding={5}
            fill="black"
          />
        </Label>
      )}
    </>
  );
};

const SQUARE_SIZE_MAX = 100;
const SQUARE_SIZE_MIN = 50;

type BoardWithCoordinatesProps = {
  maxCoordinates: { x: BoardCoordinate; y: BoardCoordinate };
  mowers: Mower[];
};

const PADDING = 50;

export const BoardWithCoordinates = ({
  maxCoordinates,
  mowers = [],
}: BoardWithCoordinatesProps) => {
  const [grassImage] = useImage(grassPictureUrl);
  const [stageSize, setStageSize] = useState({
    width: 0,
    height: 0,
  });
  const [squareSize, setSquareSize] = useState(SQUARE_SIZE_MIN);
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const [currentMowerIndex, setCurrentMowerIndex] = useState(0);

  const handleAnimationComplete = useCallback(() => {
    setCurrentMowerIndex((prev) => prev + 1);
  }, []);

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

        const availableWidthForGrid =
          containerWidth - yAxisLabelPadding - PADDING * 2;
        if (availableWidthForGrid <= 0) return;

        let newSquareSize = availableWidthForGrid / xMax;
        newSquareSize = Math.max(SQUARE_SIZE_MIN, newSquareSize);
        newSquareSize = Math.min(SQUARE_SIZE_MAX, newSquareSize);

        setSquareSize(newSquareSize);
        setStageSize({
          width: xMax * newSquareSize + yAxisLabelPadding + PADDING * 2,
          height: yMax * newSquareSize + xAxisLabelPadding + PADDING * 2,
        });
      }
    });

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [xMax, yMax]);

  if (grassImage === null) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="p-4 border-2 border-gray-300 rounded-lg flex justify-start overflow-x-auto"
      ref={containerRef}
    >
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        className="mx-auto"
      >
        <Layer x={PADDING} y={PADDING}>
          {[...Array(yMax)].map((_, i) =>
            [...Array(xMax)].map((_, j) => (
              <ImageWithTypeSafety
                key={`${i}-${j}`}
                x={numberToCssCoordinate(j * squareSize)}
                y={numberToCssCoordinate(i * squareSize)}
                width={squareSize}
                height={squareSize}
                image={grassImage}
              />
            ))
          )}
        </Layer>

        <Layer x={PADDING} y={PADDING}>
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

        <Layer ref={layerRef} x={PADDING} y={PADDING}>
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
