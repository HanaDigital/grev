import { FC } from "react";
import "../sass/App.scss";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Search from "./Search";
import topBlob from "../assets/blob-top.png";
import bottomBlob from "../assets/blob-bottom.png";

const App: FC = () => {
  return (
    <div className="App">
      <div className="blobs">
        <img src={bottomBlob} alt="bottom blob" className="blob bottomBlob" />
        <img src={topBlob} alt="top blob" className="blob topBlob" />
      </div>
      <Navbar />
      <Search />
      <Footer />
    </div>
  );
};

export default App;
