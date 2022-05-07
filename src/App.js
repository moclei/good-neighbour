import React, {useCallback, useEffect, useReducer, useState} from "react";
import {
    Routes,
    Route, BrowserRouter,
} from "react-router-dom";
import Print from "./routes/print";
import Home from "./Home";
import axios from "axios";
import {usePosition} from "./hooks/usePosition";

const mapsApiKeyReducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            return {
                ...state,
                isLoading: true,
                isError: false
            }
        case "SUCCESS":
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload
            }
        case "FAILURE":
            return {
                ...state,
                isLoading: false,
                isError: true
            }
        default:
            throw new Error()
    }
}

export default function App(props) {

    const [state, dispatch] = useReducer(mapsApiKeyReducer, {
        isLoading: false,
        isError: false,
        data: {"status":""}
    })

    const [apiKey, setApiKey] = useState(null);

    useEffect(() => {
        const callMapsApiKey = async () => {
            // console.debug("process.env.NODE_ENV: ", process.env.NODE_ENV);
            if (process.env.NODE_ENV === "production") {
                dispatch({
                    type: "INIT"
                })
                try {
                    const url = "https://good-neighbour-nodejs-server.uc.r.appspot.com/api"
                    const headers = {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    }
                    const res = await axios(url);
                    dispatch({
                        type: 'SUCCESS',
                        payload: res.data.apiKey
                    })
                    // setApiKey(res.data.apiKey)
                    setApiKey(res.data.apiKey);
                }
                catch (err) {
                    dispatch({
                        type: 'FAILURE'
                    })
                }
            } else {
                setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
            }
        }
        if (!apiKey) {
            callMapsApiKey()
        }

    }, []);

    return (
        <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Home apiKey={apiKey} />}/>
                    <Route exact path="/print" element={<Print apiKey={apiKey} />}/>
                </Routes>
        </BrowserRouter>
    );
};
