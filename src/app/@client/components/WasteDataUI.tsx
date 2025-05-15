
import WasteCard, { WasteCardProps } from "./WasteCard";

const WasteDataUI = ({ wasteData }: { wasteData: WasteCardProps[] }) => {
    return (
        <div className="flex py-6 px-6 w-full flex-wrap gap-4">
            {wasteData.map((data) => (
                <WasteCard key={data.wasteType} {...data} />
            ))}
        </div>
    )
}

export default WasteDataUI;