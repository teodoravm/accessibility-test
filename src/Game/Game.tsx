import React, { useEffect, useRef, useState } from 'react';
import { AccessibleImage, FocusManager, SRVisual, AlertPlayer } from '../a11y-content';
import MathProblemCanvas from '../MathProblem/MathProblem';

type Apple = {
    id: number;
};

const ANIMATION_DELAY = 2000;

const Game: React.FC = () => {
    const [containerOne, setContainerOne] = useState<Apple[]>([...Array(5)].map((_, i) => ({ id: i + 1 })));
    const [containerTwo, setContainerTwo] = useState<Apple[]>([...Array(3)].map((_, i) => ({ id: i + 6 })));
    const [inputAnswer, setInputAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null | undefined>(undefined);
    const fallbackElement = useRef<HTMLParagraphElement | null>(null);
    const [moved, setMoved] = useState<boolean>(false);

    const handleDragStart = (e: React.DragEvent, apple: Apple, source: 'one' | 'two') => {
        e.dataTransfer.setData('apple', JSON.stringify(apple));
        e.dataTransfer.setData('source', source);
    };

    const handleDrop = (e: React.DragEvent, destination: 'one' | 'two') => {
        e.preventDefault();
        const apple = JSON.parse(e.dataTransfer.getData('apple')) as Apple;
        const source = e.dataTransfer.getData('source');

        if (source === destination) return;

        if (source === 'one') {
            setContainerOne((prev) => prev.filter((a) => a.id !== apple.id));
            setContainerTwo((prev) => [...prev, apple]);
        } else {
            setContainerTwo((prev) => prev.filter((a) => a.id !== apple.id));
            setContainerOne((prev) => [...prev, apple]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputAnswer(e.target.value);
    };

    const checkAnswer = () => {
        const total = containerOne.length + containerTwo.length;
        setIsCorrect(total === parseInt(inputAnswer, 10));

        setTimeout(() => {
            setIsCorrect(null);
        }, ANIMATION_DELAY);
    };

    const moveApple = (apple: Apple, dest: 'one' | 'two') => {
        if (dest === 'one') {
            setContainerTwo((prev) => prev.filter((a) => a.id !== apple.id));
            setContainerOne((prev) => [...prev, apple]);
        } else {
            setContainerOne((prev) => prev.filter((a) => a.id !== apple.id));
            setContainerTwo((prev) => [...prev, apple]);
        }
        setMoved(true);
        setTimeout(() => {
            setMoved(false);
        }, 3000);
    };

    const imageURL = 'https://file.aiquickdraw.com/imgcompressed/img/compressed_7fd5709c36a8f1487b61f384ec967659.webp';

    const applesFirst = containerOne.map((apple) => (
        <button
            key={apple.id}
            className="apple"
            draggable
            onDragStart={(e) => handleDragStart(e, apple, 'one')}
            onClick={() => moveApple(apple, 'two')}
            aria-label="Apple"
        >
            🍎
        </button>
    ));

    const applesSecond = containerTwo.map((apple) => (
        <button
            key={apple.id}
            className="apple"
            draggable
            onDragStart={(e) => handleDragStart(e, apple, 'two')}
            aria-label="Apple"
            role="button"
            onClick={() => moveApple(apple, 'one')}
        >
            🍎
        </button>
    ));

    const problemEl = '';

    return (
        <>
            <div className="app" id="game">
                <h1 className="title" id="title" tabIndex={0}>
                    Math Game: Addition
                    <SRVisual description="The problem is 5+3 = question mark. There are two containers filled with apples. Move apples from one container to the other to help you solve the problem." />
                </h1>
                <div className="question" ref={fallbackElement} id="question" tabIndex={0}>
                    <MathProblemCanvas />
                    <SRVisual description="This element represents the problem to solve: 5 + 3 = question mark" />
                </div>
                <div className="game-area">
                    <div
                        className="container first-cont"
                        onDrop={(e) => handleDrop(e, 'one')} // supports all standard HTML attributes as props
                        onDragOver={handleDragOver}
                        aria-label={`Container 1 with ${containerOne.length} apples`}
                    >
                        <h2>Container 1</h2>
                        <div className="apple-container" role="group">
                            <FocusManager
                                classes="apple-container"
                                children={applesFirst}
                                fallbackElement={'question'} // the element to be focused if all children are removed from the DOM
                                focusRectStyle={{ color: 'orange', width: 5, offset: 1 }} // custom focus border
                            ></FocusManager>
                        </div>
                    </div>
                    <div
                        className="container"
                        onDrop={(e) => handleDrop(e, 'two')}
                        onDragOver={handleDragOver}
                        aria-label={`Container 2 with ${containerTwo.length} apples`}
                    >
                        <h2>Container 2</h2>
                        <div className="apple-container" role="group">
                            <FocusManager
                                children={applesSecond}
                                fallbackElement={'question'}
                                classes="apple-container"
                            />
                        </div>
                    </div>
                    {moved && (
                        <AlertPlayer
                            message={`Moved apple. Container 1 now has ${containerOne.length} apples. Container 2 now has ${containerTwo.length} apples.`}
                        />
                    )}
                </div>
                <div className="answer-area">
                    <input
                        type="number"
                        value={inputAnswer}
                        onChange={handleInputChange}
                        placeholder="Enter your answer"
                        className="answer-input"
                        aria-label="Enter your answer"
                    />
                    <button className="check-button" onClick={checkAnswer}>
                        <SRVisual description="Careful! This button submits your answer." />❔
                    </button>
                    {isCorrect !== undefined && (
                        <AlertPlayer
                            message={isCorrect ? 'Correct!' : 'Try again!'}
                            delay={ANIMATION_DELAY} // supports delaying of message when other action needs to be performed first
                            className={`result ${isCorrect ? 'correct' : 'incorrect'}`}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Game;
