import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./assets/font-awesome/css/all.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import "./assets/js/snow-animation"
import SnowAnimation from './components/SnowAnimation';
import "./assets/css/style.css";
import "./assets/css/santa.css"
import "./assets/css/config.css";
import "./assets/css/snow-animation.css"
import Wrapper from './components/Wrapper';
import Header from './components/Header';
import ChatWithSanta from "./pages/chat-with-santa"
import Footer from "./components/Footer"

function App() {
  return (
    <div >

      {/* <div id="snow" aria-hidden="true"></div>
       */}
      {/* <SnowAnimation/> */}
      <div className="wrapper">
        <Header />
        <Router>
      <Routes>
        <Route path="/chat" element={<ChatWithSanta />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>

        <Footer />
      </div>
    </div>
  );
}

export default App;
