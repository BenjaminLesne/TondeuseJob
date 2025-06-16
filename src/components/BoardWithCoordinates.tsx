import { useEffect, useRef } from "react";
import { Stage, Layer, Circle, Image } from "react-konva";
import mowerPictureUrl from "../assets/mower.png";
import useImage from "use-image";

const MOWER_WIDTH = 150;

const Mower = () => {
  const [mowerImage] = useImage(mowerPictureUrl);

  return (
    <Image
      x={0}
      y={0}
      image={mowerImage}
      scaleX={0.5}
      scaleY={0.5}
      width={MOWER_WIDTH}
      height={MOWER_WIDTH * 1.5}
    />
  );
};

export const BoardWithCoordinates = () => {
  const circleRef = useRef(null);

  useEffect(() => {
    const amplitude = 100;
    const period = 2000; // in milliseconds

    const anim = new Konva.Animation((frame) => {
      circleRef.current.x(
        amplitude * Math.sin((frame.time * 2 * Math.PI) / period) +
          window.innerWidth / 2
      );
    }, circleRef.current.getLayer());

    anim.start();

    return () => {
      anim.stop();
    };
  }, []);

  return (
    <>
      {/* <img src={mowerPictureUrl} alt="Mower" width={100} /> */}
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Circle
            ref={circleRef}
            x={50}
            y={window.innerHeight / 2}
            radius={30}
            fill="red"
            stroke="black"
            strokeWidth={4}
          />
          <Mower />
        </Layer>
      </Stage>
    </>
  );
};
