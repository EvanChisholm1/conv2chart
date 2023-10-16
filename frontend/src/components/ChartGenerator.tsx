import { FC, useState } from "react";
import { ChartItem } from "../types/ChartItem";
import { Chart } from "./Chart";

interface Props {
    transcript: string;
}

export const ChartGenerator: FC<Props> = ({ transcript }) => {
    const [chartItems, setChartItems] = useState<ChartItem[] | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateChart = async () => {
        setChartItems(null);
        setIsGenerating(true);
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/fill-chart`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ transcript: transcript }),
            }
        );

        const json = await response.json();
        console.log(json);

        setChartItems(json["chart_items"]);
        setIsGenerating(false);
    };

    return (
        <>
            <button
                className="bg-green-600 text-white rounded-md p-2 px-5 font-semibold hover:bg-green-700"
                onClick={generateChart}
            >
                Generate Chart
            </button>
            {isGenerating ? <p>Generating Chart...</p> : ""}
            {chartItems ? <Chart chartItems={chartItems} /> : ""}
        </>
    );
};
