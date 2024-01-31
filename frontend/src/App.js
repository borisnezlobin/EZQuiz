import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import JoinPage from "./pages/join";
import { Providers } from "./context";
import HomePage from "./pages/home";
import { Toaster } from 'react-hot-toast';
import Playground from "./pages/playground";
import GamePage from "./pages/game";


function App() {
  return (
    <Providers>
      <div className='w-full h-full min-h-screen min-w-screen overflow-x-hidden bg-slate-50'>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route path="/join" element={<JoinPage />} />
            <Route path="/join/:id" element={<JoinPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/game" element={<GamePage />} />
          </Routes>
        </BrowserRouter>
      </div>
      <Toaster />
    </Providers>
  );
}

export default App;
