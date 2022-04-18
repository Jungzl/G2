import { Coordinate } from '@antv/coord';
import { G2View, G2CoordinateOptions, G2Library } from './types/options';
import { CoordinateComponent, CoordinateTransform } from './types/component';
import { useLibrary } from './library';
import { Layout } from './types/common';

export function createCoordinate(
  layout: Layout,
  partialOptions: G2View,
  library: G2Library,
): Coordinate {
  const [useCoordinate] = useLibrary<
    G2CoordinateOptions,
    CoordinateComponent,
    CoordinateTransform
  >('coordinate', library);

  const { innerHeight, innerWidth } = layout;
  const { coordinate: partialTransform = [] } = partialOptions;
  const transform = inferCoordinate(partialTransform);
  const coordinate = new Coordinate({
    x: 0,
    y: 0,
    width: innerWidth,
    height: innerHeight,
    transformations: transform.map(useCoordinate).flat(),
  });
  return coordinate;
}

export function isPolar(coordinate: G2CoordinateOptions[]) {
  const polar = coordinate.find((d) => d.type === 'polar');
  return polar !== undefined;
}

export function isTranspose(coordinate: G2CoordinateOptions[]) {
  const transposes = coordinate.filter(({ type }) => type === 'transpose');
  return transposes.length % 2 === 1;
}

export function isParallel(coordinate: G2CoordinateOptions[]) {
  const parallel = coordinate.find((d) => d.type === 'parallel');
  return parallel !== undefined;
}

function inferCoordinate(
  coordinate: G2CoordinateOptions[],
): G2CoordinateOptions[] {
  if (coordinate.find((d) => d.type === 'cartesian')) return coordinate;
  return [...coordinate, { type: 'cartesian' }];
}
