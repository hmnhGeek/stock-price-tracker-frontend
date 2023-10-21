import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';

const StockChart = props => {
    const elementToScroll = useRef();

    useEffect(() => {
        // Scroll to the element when the component is loaded
        elementToScroll.current.scrollIntoView({ behavior: 'smooth' });
      }, []);

    // Options for the chart
    const options = {
        scales: {
        x: {
            title: {
                display: true,
                text: 'Time in epoch',
            },
        },
        },
    };

    return <div ref={elementToScroll} style={{ height: '400px', width: '100%', display: "flex", justifyContent: "center" }}>
        <Line
            datasetIdKey='id'
            data={{
                labels: props.data.labels,
                datasets: [
                    {
                        id: 1,
                        label: 'Price in USD',
                        data: props.data.priceHistory,
                    }
                ],
            }}
            options={options}
        />
    </div>
}

export default StockChart;