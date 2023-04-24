
import { useEffect, useRef, useState } from 'react';
import '../styles/App.css';

function App() {

    const svgRef = useRef(null);
    const pathRef = useRef(null);

    const [center, setCenter] = useState({ x: 0, y: 0 })

    const [isDrawing, setDrawing] = useState(false);

    const [pathData, setPathData] = useState('');


    const [pathLength, setPathLength] = useState(0);

    const [radius, setRadius] = useState(0);

    const [perfection, setPerfection] = useState(0);

    const [state, setState] = useState('green')

    const [error, setError] = useState(null)


    useEffect(() => {
        setCenter({ x: (svgRef.current.getBoundingClientRect()).width / 2, y: (svgRef.current.getBoundingClientRect()).height / 2 });
    }, [])

    function handleMouseDown(e) {
        let dx = e.clientX - center.x;
        let dy = e.clientY - center.y;
        if (Math.sqrt(dx * dx + dy * dy) > 80) {
            setError(null)
            const { offsetX, offsetY } = e.nativeEvent;
            setPathData(`M${offsetX},${offsetY}`);
            setDrawing(true);
        }
        else {
            setError("Too close to dot")
        }


    }

    function handleMouseMove({ clientX, clientY, nativeEvent }) {
        if (!isDrawing) return;
        let dx = clientX - center.x;
        let dy = clientY - center.y;
        if (Math.sqrt(dx * dx + dy * dy) > 30) {
            const { offsetX, offsetY } = nativeEvent;
            setPathData(`${pathData} L${offsetX},${offsetY}`);
            setPathLength(pathRef.current.getTotalLength());
        }
        else {
            setDrawing(false)
            setError("Too close to dot")
        }
    }

    function handleMouseUp() {
        setDrawing(false);
    }

    useEffect(() => {
        setRadius(pathLength / (2 * Math.PI));

    }, [pathLength])

    useEffect(() => {
        const pathBlock = pathRef.current.getBoundingClientRect();

        const perfectArea = pathBlock.width * pathBlock.height;


        const currentArea = Math.PI * radius * radius;
        setPerfection(currentArea / perfectArea * 100)
    }, [radius])

    useEffect(() => {
        if (perfection > 85) {
            setState('green');
        }
        else if (perfection > 75) {
            setState('orange');
        }
        else if (perfection < 75) {
            setState('red');
        }
    }, [perfection])

    return (
        <div className="App">
            <header className='header'>
                <p className='p'>Dastan Tynyshtyk</p>

                <p>{error ? `${error}` : `Perfection: ${((perfection ? perfection : 0).toString().slice(0, 4))}%`}</p>
                <a href="http://t.me/dastan_tynyshtyk" target="_blank" rel="noopener noreferrer">Telegram</a>
            </header>
            <div className='center' style={{ left: center.x, top: center.y }}></div>
            <section className='plane'>
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    <path d={pathData} ref={pathRef} stroke={state} strokeWidth="2" fill="none" />
                </svg>
            </section>
        </div>
    );
}

export default App;
