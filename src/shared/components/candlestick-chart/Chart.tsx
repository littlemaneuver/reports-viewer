import Candle from './Candle';
import { LeftAxis, BottomAxis } from './Axis';
import { scaleLinear, scaleTime } from 'd3-scale';
import { extent } from 'd3-array';
import type { AggregatedBarData } from '@/types';

export default function Chart({
  data,
  width,
  height,
}: {
  data: AggregatedBarData;
  width: number;
  height: number;
}) {
  const padding = 5;
  const leftAxisWidth = 50;
  const bottomAxisHeight = 30;
  const chartHeight = height - bottomAxisHeight - 2 * padding;
  const chartWidth = width - leftAxisWidth - 2 * padding;

  const candleWidth = Math.floor(chartWidth / (data.bars.length + 1));

  const getY = (price: number) =>
    Math.abs(
      ((price - data.minPrice) / data.priceRange) * chartHeight - chartHeight
    );
  const xExtent = extent(data.bars, (d) => d.t);
  const yExtent = extent(data.bars, (d) => d.h);

  if (
    xExtent[0] == null ||
    xExtent[1] == null ||
    yExtent[0] == null ||
    yExtent[1] == null
  ) {
    return <div>insufficient data for chart</div>;
  }
  const xScale = scaleTime().domain(xExtent).range([0, chartWidth]);
  const yScale = scaleLinear().domain(yExtent).range([chartHeight, 0]);

  return (
    <svg
      width={width}
      height={height}
      style={{ backgroundColor: 'midnightblue', color: 'whitesmoke' }}
    >
      {data.bars.map((bar, i) => {
        return (
          <Candle
            key={i}
            data={bar}
            x={leftAxisWidth + padding + candleWidth * (i + 1)}
            getY={getY}
            width={candleWidth * 0.8}
          />
        );
      })}
      <g transform={`translate(${padding}, ${padding})`}>
        <LeftAxis scale={yScale} width={leftAxisWidth} />
      </g>
      <g
        transform={`translate(${leftAxisWidth + padding},${
          chartHeight + padding
        })`}
      >
        <BottomAxis scale={xScale} width={width} />
      </g>
    </svg>
  );
}