import { Node, NodeConfig } from 'konva/lib/Node';
import { Coord, ShapeModel, Size } from './canvas.model';
import { Box } from 'konva/lib/shapes/Transformer';
import {
  fitSizeToShapeSizeRestrictions,
  getShapeSizeRestrictions,
} from './canvas.util';
import { ShapeType } from '@/core/model';

interface TransFormSelectedInfo {
  selectedShapeRef: React.MutableRefObject<Node<NodeConfig> | null>;
  selectedShapeId: string;
  selectedShapeType: ShapeType | null;
}

export const useTransform = (
  setShapes: (value: React.SetStateAction<ShapeModel[]>) => void,
  transformSelectedInfo: TransFormSelectedInfo
) => {
  const { selectedShapeId, selectedShapeRef, selectedShapeType } =
    transformSelectedInfo;

  const updateShapeSizeAndPosition = (
    id: string,
    position: Coord,
    size: Size
  ) => {
    setShapes(prevShapes =>
      prevShapes.map(shape =>
        shape.id === id ? { ...shape, ...position, ...size } : shape
      )
    );
  };

  const handleTransform = () => {
    const node = selectedShapeRef.current;
    if (!node) {
      return;
    }

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const position = { x: node.x(), y: node.y() };

    const newWidth = node.width() * scaleX;
    const newHeight = node.height() * scaleY;

    updateShapeSizeAndPosition(selectedShapeId, position, {
      width: newWidth,
      height: newHeight,
    });

    node.scaleX(1);
    node.scaleY(1);
  };

  const handleTransformerBoundBoxFunc = (_: Box, newBox: Box) => {
    const limitedSize = fitSizeToShapeSizeRestrictions(
      getShapeSizeRestrictions(selectedShapeType),
      newBox.width,
      newBox.height
    );
    return {
      ...newBox,
      width: limitedSize.width,
      height: limitedSize.height,
    };
  };

  return { handleTransform, handleTransformerBoundBoxFunc };
};
