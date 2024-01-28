import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import { useState, useEffect } from 'react';
import JoinPage from "./pages/join";
import { Providers } from "./context";


var rooms = [];
function App() {
  const [apiResponse, setResponse] = useState(null);


  useEffect(() => {
    if(apiResponse == null){
      fetch("http://localhost:9000/users")
      .then(res => res.text())
      .then(res => setResponse(res));
    }
  }, []);

  return (
    <Providers>
      <div className='w-full h-full min-h-screen min-w-screen overflow-x-hidden bg-slate-50'>
        <BrowserRouter>
          <Routes>
            <Route path="/join" element={<JoinPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Providers>
  );
}

export default App;
