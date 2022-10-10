import React, {useState, useRef, useEffect} from 'react';

const circle = (x, y, ctx, color) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.stroke();
};

const App = () => {
    const canvasRef = useRef(null);
    const [color, setColor] = useState('red');
    const ws = useRef(null);
    const [state, setState] = useState({
        mouseDown: false,
        pixelsArray: []
    });

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:8000/draw');
        const ctx = canvasRef.current.getContext('2d');

        ws.current.onmessage = event => {
            const decodedMessage = JSON.parse(event.data);

            if (decodedMessage.type === 'NEW_LINE') {
                decodedMessage.message.forEach(location => circle(location.x, location.y, ctx, color));
            }

            if (decodedMessage.type === 'CONNECTED') {
                decodedMessage.drawing.forEach(location => circle(location.x, location.y, ctx, color));
            }
        };
        // eslint-disable-next-line
    }, []);

    const canvasMouseMoveHandler = event => {
        if (state.mouseDown) {
            const clientX = event.clientX;
            const clientY = event.clientY;
            setState(prevState => ({
                ...prevState,
                pixelsArray: [...prevState.pixelsArray, {
                    x: clientX,
                    y: clientY
                }]
            }));

            const ctx = canvasRef.current.getContext('2d');
            circle(clientX, clientY, ctx, color);
        }
    };

    const mouseDownHandler = () => {
        setState({...state, mouseDown: true});
    };

    const mouseUpHandler = () => {
        ws.current.send(JSON.stringify({
            type: 'CREATE_LINE',
            message: [...state.pixelsArray],
        }));
        setState({...state, mouseDown: false, pixelsArray: []});
    };

    return (
        <>
            <div style={{position: 'absolute'}} >
                <input type="color" onChange={(e) => setColor(e.target.value)}/>
            </div>
            <canvas
                ref={canvasRef}
                style={{border: '1px solid black'}}
                width={800}
                height={600}
                onMouseDown={mouseDownHandler}
                onMouseUp={mouseUpHandler}
                onMouseMove={canvasMouseMoveHandler}
            />
        </>
    );
};

export default App;