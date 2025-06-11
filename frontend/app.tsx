import HomePage from "../app/pagey"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./RootLayout";
import NewChat from "./pages/NewChat";

export default function App() {
    return <BrowserRouter>
        <Routes>
            <Route element={<RootLayout />}>
                <Route path="/" element={<NewChat />} />
            </Route>

        </Routes>
    </BrowserRouter>
}