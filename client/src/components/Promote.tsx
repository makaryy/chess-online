import { PieceType } from "chess.js";
import { move, Promotion } from "../Game";

interface PromoteProps {
    promotion: Promotion;
}

function Promote({ promotion: { from, to, color } }: PromoteProps) {
    const promotionPieces = ["r", "b", "n", "q"];
    return (
        <div className="w-full h-full grid grid-rows-2 grid-cols-2 items-center justify-center">
            {promotionPieces.map((p, i) => {
                return (
                    <div
                        key={i}
                        className="flex w-full h-full items-center justify-center"
                        onClick={() => {
                            move(from, to, p as Exclude<PieceType, "p" | "k"> | undefined);
                            console.log(p);
                        }}>
                        <img
                            src={require(`../assets/${p}_${color.color}.svg`)}
                            alt={`${p}_${color.color}`}
                            className="w-full h-full cursor-pointer hover:bg-neutral-400"
                        />
                    </div>
                );
            })}
        </div>
    );
}

export default Promote;
