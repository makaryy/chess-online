import { useEffect, useState } from "react";
import Board from "./components/Board";
import { gameSubject } from "./Game";
import { setBoard } from "./redux/board";
import { useDispatch } from "react-redux";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { setTurn } from "./redux/turn";
import Alert from "./components/Alert";

const App = () => {
    const dispatch = useDispatch();
    const [alert, setAlert] = useState<string | null>(null);
    useEffect(() => {
        const subscribe = gameSubject.subscribe((game) => {
            dispatch(setBoard(game.board));
            dispatch(setTurn(game.turn));
            if (game.result) {
                setAlert(game.result);
            } else {
                setAlert(null);
            }
        });

        return () => subscribe.unsubscribe();
    }, []);
    return (
        <div className="flex container mx-auto h-screen items-center justify-center">
            <DndProvider backend={HTML5Backend}>
                {alert && <Alert alert={alert} />}
                <Board />
            </DndProvider>
        </div>
    );
};

export default App;
