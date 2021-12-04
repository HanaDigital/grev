import { FC, useState } from "react";
import "../sass/App.scss";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Search from "./Search";
import topBlob from "../assets/blob-top.png";
import bottomBlob from "../assets/blob-bottom.png";
import ReadMe from "./ReadMe";

const App: FC = () => {
  const [showReadMe, setShowReadMe] = useState(false);

  return (
    <div className="App">
      {showReadMe && <ReadMe setShowReadMe={setShowReadMe} />}
      <div className="blobs">
        <img src={bottomBlob} alt="bottom blob" className="blob bottomBlob" />
        <img src={topBlob} alt="top blob" className="blob topBlob" />
      </div>
      <Navbar />
      <Search setShowReadMe={setShowReadMe} />
      <Footer />
    </div>
  );
};

export default App;
