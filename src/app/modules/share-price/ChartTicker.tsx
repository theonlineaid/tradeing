
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	CandlestickSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	EdgeIndicator,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

import { LabelAnnotation, Label, Annotate } from "react-stockcharts/lib/annotation";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

class CandleStickChartWithAnnotation extends React.Component<any, any> {

  static propTypes: { data: any; width: any; ratio: any; type: any; };
  static defaultProps: { type: string; };

	render() {
    const { type, data: initialData, width, ratio } = this.props;
		const annotationProps = {
			fontFamily: "Glyphicons Halflings",
			fontSize: 20,
			fill: "#060F8F",
			opacity: 0.8,
			text: "\ue182",
			y: ({ yScale }) => yScale.range()[0],
			tooltip: d => timeFormat("%B")(d.date),
		};

		const margin = { left: 80, right: 80, top: 30, bottom: 50 };
		const height = 400;

		const [yAxisLabelX, yAxisLabelY] = [
			width - margin.left - 40,
			(height - margin.top - margin.bottom) / 2
		];

		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(initialData);

		const start = xAccessor(last(data));
		const end = xAccessor(data[Math.max(0, data.length - 150)]);
		const xExtents = [start, end];

		return (
			<ChartCanvas height={400}
					ratio={ratio}
					width={width}
					margin={margin}
					type={type}
					seriesName="MSFT"
					data={data}
					xScale={xScale}
					xAccessor={xAccessor}
					displayXAccessor={displayXAccessor}
					xExtents={xExtents}>

				<Label x={(width - margin.left - margin.right) / 2} y={30}
					fontSize="30" text="Ticker Chart" />

				<Chart id={1}
						yExtents={[d => [d.high, d.low]]}
						padding={{ top: 10, bottom: 20 }}>
					<XAxis axisAt="bottom" orient="bottom"/>
					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")} />
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<Label x={(width - margin.left - margin.right) / 2} y={height - 45}
						fontSize="12" text="XAxis Label here" />

					<YAxis axisAt="right" orient="right" ticks={5} />

					<Label x={yAxisLabelX} y={yAxisLabelY}
						rotate={-90}
						fontSize="12" text="YAxis Label here" />

					<CandlestickSeries />
					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>

					<OHLCTooltip origin={[-40, 0]}/>

					<Annotate with={LabelAnnotation}
						when={d => d.date.getDate() === 1 /* some condition */}
						usingProps={annotationProps} />

				</Chart>
				<CrossHairCursor strokeDasharray="LongDashDot" />

			</ChartCanvas>
		);
	}
}


CandleStickChartWithAnnotation.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithAnnotation.defaultProps = {
	type: "svg",
};
let x = fitWidth(CandleStickChartWithAnnotation);
export default x;