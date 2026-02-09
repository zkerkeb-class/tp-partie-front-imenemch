import { useState, useEffect } from "react";
import Title from "../title";

const Counter = () => {
    const [count, setCount] = useState(0);
    const [counttwo, setCounttwo] = useState(0);

    useEffect(() =>{
        console.log("in Use Effect");
        console.log(count);
        document.title = `Count: ${count}`;
    }, [count])



    const decrement = () => {
        setCount(count - 1);
    }

    return (
        <div>
            { count >= 10 &&
            <Title label="BRAVO 10 compteur"></Title>
            }
            <h2>
                Counter
            </h2>
            <p>{count}</p>
            <p>{counttwo}</p>
            <button onClick={() => setCounttwo(counttwo + 1)}>Incrémenter</button>
            <button onClick={decrement}>Décrémenter</button>
        </div>
    )
}

export default Counter;