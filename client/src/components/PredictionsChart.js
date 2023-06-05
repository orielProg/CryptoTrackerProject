
import ReactSpeedometer from "react-d3-speedometer/dist/index"

const PredictionsChart = (props) => (
        <ReactSpeedometer
          needleHeightRatio={0.7}
          height={200}
          startColor="#9399ff"
          endColor="#00bbf0"
          value={props.prediction}
          currentValueText="Prediction"
          customSegmentLabels={[
            {
              text: 'Strong sell',
              position: 'OUTSIDE',
              fontSize: '80%',
            },
            {
              text: 'Sell',
              position: 'OUTSIDE',
              fontSize: '80%',
            },
            {
              text: 'Neutral',
              position: 'OUTSIDE',
              fontSize: '80%',              
            },
            {
              text: 'Buy',
              position: 'OUTSIDE',
              fontSize: '80%',
            },
            {
              text: 'Strong buy',
              position: 'OUTSIDE',
              fontSize: '80%',
            },
          ]}
          ringWidth={25}
          needleTransitionDuration={3333}
          needleTransition="easeElastic"
          needleColor={'#a7ff83'}
          textColor={'#d8dee9'}
          minValue = {0}
          maxValue={100}></ReactSpeedometer>
  );

export default PredictionsChart;