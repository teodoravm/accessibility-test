import React, { useState } from 'react';
import './App.css';
import Game from './Game/Game';
import NavBar from './NavBar/NavBar';
import { FocusManager } from './a11y-content';

function App() {
    const [showHelp, setShowHelp] = useState(false);
    return (
        <>
            <NavBar setShowHelp={setShowHelp} />
            <Game />
            {showHelp && (
                <FocusManager fallbackElement="helpBtn" focusRectStyle={{ offset: 5 }}>
                    <div className="modal-overlay" onClick={() => setShowHelp(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>How to Play</h2>
                            <p>
                                Move the apples between the containers using drag-and-drop or by clicking. Then, enter
                                the total number of apples in the input box and press "Check Answer". A happy face
                                appears if you’re correct, and a sad face if you’re not.
                            </p>
                            <button onClick={() => setShowHelp(false)} className="close-button">
                                Close
                            </button>
                        </div>
                    </div>
                </FocusManager>
            )}
        </>
    );
}

export default App;
