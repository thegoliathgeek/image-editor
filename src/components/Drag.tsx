import { Box, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { Stage, Layer, Image, Transformer, Circle, Line } from "react-konva";
import useImage from "use-image";
import beerImg from "../assets/beer.jpeg";
import goKartImg from "../assets/gokart.jpeg";
const URLImage = ({
  image,
  shapeProps,
  unSelectShape,
  isSelected,
  onSelect,
  onChange,
  stageScale,
  onDelete,
}: any) => {
  const shapeRef = React.useRef<any>();
  const trRef = React.useRef<any>();
  const deleteButton = React.useRef<any>();
  const [img] = useImage(image.src);

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const onMouseEnter = (event: {
    target: {
      getStage: () => {
        (): any;
        new (): any;
        container: {
          (): {
            (): any;
            new (): any;
            style: { (): any; new (): any; cursor: string };
          };
          new (): any;
        };
      };
    };
  }) => {
    if (isSelected) {
      event.target.getStage().container().style.cursor = "move";
    }
    if (!isSelected) {
      event.target.getStage().container().style.cursor = "pointer";
    }
  };

  const onMouseLeave = (event: {
    target: {
      getStage: () => {
        (): any;
        new (): any;
        container: {
          (): {
            (): any;
            new (): any;
            style: { (): any; new (): any; cursor: string };
          };
          new (): any;
        };
      };
    };
  }) => {
    event.target.getStage().container().style.cursor = "default";
  };

  const handleDelete = () => {
    unSelectShape(null);
    onDelete(shapeRef.current);
  };

  return (
    <React.Fragment>
      <Image
        image={img}
        x={image.x}
        y={image.y}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        // I will use offset to set origin to the center of the image
        offsetX={img ? img.width / 2 : 0}
        offsetY={img ? img.height / 2 : 0}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        >
          <Circle
            radius={8}
            fill="red"
            ref={deleteButton}
            onClick={handleDelete}
            x={shapeRef.current.width() * stageScale}
          ></Circle>
        </Transformer>
      )}
    </React.Fragment>
  );
};

const DragandDrop = () => {
  const dragUrl = React.useRef<any>();
  const stageRef = React.useRef<any>();
  const [images, setImages] = React.useState([]);
  const [selectedId, selectShape] = React.useState(null);
  // const stage = stageRef.current?.getStage();
  const [stageSpec, setStageSpec] = useState({
    scale: 1,
    x: 0,
    y: 0,
  });
  const handleWheel = (e: {
    evt: { preventDefault: () => void; deltaY: number };
    target: { getStage: () => any };
  }) => {
    e.evt.preventDefault();

    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    setStageSpec({
      scale: newScale,
      x: (stage.getPointerPosition().x / newScale - mousePointTo.x) * newScale,
      y: (stage.getPointerPosition().y / newScale - mousePointTo.y) * newScale,
    });
  };

  const handleRemove = (index: any) => {
    const newList = images.filter((item: any) => item.index !== index);

    setImages(newList);
  };

  const checkDeselect = (e: { target: { getStage: () => any } }) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const unSelectShape = (prop: React.SetStateAction<null>) => {
    selectShape(prop);
  };

  const onDeleteImage = (node: { index: number }) => {
    const newImages = [...images];
    newImages.splice(node.index, 1);
    setImages(newImages);
  };

  return (
    <Stack
      alignItems={"center"}
      justifyContent={"flex-start"}
      direction={"row"}
      padding={4}
    >
      <Stack
        direction={"row"}
        spacing={1}
        sx={{
          width: "10%",
        }}
      >
        {/* Replace the image paths */}
        <img
          height="50rem"
          width="50rem"
          objectfit="contain"
          key="img3"
          alt="Rotary Pump - Grinder"
          src={beerImg}
          draggable="true"
          onDragStart={(e) => {
            dragUrl.current = e.target.src;
          }}
        />

        <img
          height="50rem"
          width="50rem"
          objectfit="contain"
          key="img3"
          alt="Rotary Pump - Grinder"
          src={goKartImg}
          draggable="true"
          onDragStart={(e) => {
            dragUrl.current = e.target.src;
          }}
        />
      </Stack>
      <Box
        sx={{
          width: "50%",
        }}
      >
        <div>
          <div>
            <div>
              <div>
                <div>
                  <Stack direction={"row"} spacing={1}></Stack>
                </div>
              </div>
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  // register event position
                  stageRef.current.setPointersPositions(e);
                  // add image
                  setImages(
                    images.concat([
                      {
                        ...stageRef.current.getRelativePointerPosition(),
                        src: dragUrl.current,
                      },
                    ] as any)
                  );
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                {console.log("images =", images)}
                <Stage
                  width={window.innerWidth * 0.97}
                  height={window.innerHeight * 0.5}
                  onMouseDown={checkDeselect}
                  onTouchStart={checkDeselect}
                  style={{
                    border: "1px solid grey",
                  }}
                  ref={stageRef}
                  draggable="true"
                  scaleX={stageSpec.scale}
                  scaleY={stageSpec.scale}
                  x={stageSpec.x}
                  y={stageSpec.y}
                  onWheel={handleWheel}
                >
                  <Layer>
                    {images.map((image, index) => {
                      return (
                        <URLImage
                          image={image}
                          key={index}
                          shapeProps={image}
                          stageScale={stageSpec.scale}
                          isSelected={image === selectedId}
                          unSelectShape={unSelectShape}
                          onClick={handleRemove}
                          onSelect={() => {
                            selectShape(image);
                          }}
                          onChange={(newAttrs: any) => {
                            const rects = images.slice();
                            rects[index] = newAttrs;
                            setImages(rects);
                          }}
                          onDelete={onDeleteImage}
                        />
                      );
                    })}
                  </Layer>
                </Stage>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Stack>
  );
};

export default DragandDrop;
