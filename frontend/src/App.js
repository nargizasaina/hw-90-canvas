import React, {useState, useRef, useEffect} from 'react';

const App = () => {
    const [state, setState] = useState({
        mouseDown: false,
        pixelsArray: []
    });

    const canvas = useRef(null);

    useEffect(() => {
        canvas.current = new WebSocket('ws://localhost:8000/canvas');

    });

    const canvasMouseMoveHandler = event => {
        if (state.mouseDown) {
            const clientX = event.clientX;
            const clientY = event.clientY;
            setState(prevState => {
                return {
                    ...prevState,
                    pixelsArray: [...prevState.pixelsArray, {
                        x: clientX,
                        y: clientY
                    }]
                };
            });

            const context = canvas.current.getContext('2d');
            // context.scale(2, 2);
            // context.lineCap = 'round';
            // context.lineWidth = 5;
            const imageData = context.createImageData(10, 10);
            const d = imageData.data;

            d[0] = 0;
            d[1] = 0;
            d[2] = 0;
            d[3] = 255;

            context.putImageData(imageData, event.clientX, event.clientY);
        }
    };

    const mouseDownHandler = event => {
        setState({...state, mouseDown: true});
    };

    const mouseUpHandler = event => {
        // Где-то здесь отправлять массив пикселей на сервер
        setState({...state, mouseDown: false, pixelsArray: []});
    };

    const onChange = e => {
        console.log(e.target.value);
    };

    return (
        <div>
            <canvas
                ref={canvas}
                style={{border: '1px solid black'}}
                width={800}
                height={600}
                onMouseDown={mouseDownHandler}
                onMouseUp={mouseUpHandler}
                onMouseMove={canvasMouseMoveHandler}
            />
            <input style={{margin: '20px 0'}} type="color" onChange={onChange}/>
        </div>
    );
};

export default App;