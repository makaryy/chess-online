import { useEffect } from "react";
import Board from "./components/Board";
import { gameSubject } from "./Game";
import { setBoard } from "./redux/board";
import { useDispatch } from "react-redux";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        const subscribe = gameSubject.subscribe((game) => dispatch(setBoard(game.board)));
        return () => subscribe.unsubscribe();
    }, []);
    return (
        <div className="flex container mx-auto h-screen items-center justify-center">
            <DndProvider backend={HTML5Backend}>
                <Board />
            </DndProvider>
        </div>
    );
}

export default App;
