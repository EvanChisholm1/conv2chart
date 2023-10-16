import { FC } from "react";
import { ChartItem } from "../types/ChartItem";

interface Props {
    chartItems: ChartItem[];
}

export const Chart: FC<Props> = ({ chartItems }) => {
    return (
        <>
            <h2 className="font-semibold text-3xl">Chart:</h2>
            <ul className="flex flex-col gap-2">
                {chartItems.map((item) => (
                    <li className="flex flex-col gap-2" key={item.name}>
                        <hr />
                        <h3 className="font-medium text-lg">{item.name}:</h3>
                        {item.content.split("\n").map((c, i) => (
                            <p key={i}>{c}</p>
                        ))}
                    </li>
                ))}
            </ul>
        </>
    );
};
