import React, {useEffect, useState} from "react";
import {
    Routes,
    Route, BrowserRouter,
} from "react-router-dom";
import Print from "./routes/print";
import Home from "./Home";
import axios from "axios";

export default function App() {

    const [apiKey, setApiKey] = useState(null);

    useEffect(() => {
        const callMapsApiKey = async () => {
            // console.debug("process.env.NODE_ENV: ", process.env.NODE_ENV);
            if (process.env.NODE_ENV === "production") {
                try {
                    const url = "https://good-neighbour-nodejs-server.uc.r.appspot.com/api"
                    const res = await axios(url);
                    setApiKey(res.data.apiKey);
                } catch (e) {
                    console.error("error getting/setting apiKey, ", e)
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
