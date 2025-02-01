import { useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import { LiveAPIProvider } from "./contexts/LiveAPIContext";
import SidePanel from "./components/side-panel/SidePanel";
import { MedSahayak } from "./components/interview/Interview";
import ControlTray from "./components/control-tray/ControlTray";
import cn from "classnames";
import { DualTranscription } from "./components/dt/DualTranscription";
import LandingPage from "./components/Landing";
import { LanguageNavigationAssistant } from "./components/ShopingAssistant";
import { Market } from "./components/community-market/Market"; 
import ProductList from "./components/community-market/ProductList";
import AddProduct from "./components/community-market/AddProduct";
import ProductDetail from "./components/community-market/ProductDetail";
import LoginSignup from "./components/community-market/Loginsignup";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY as string;
if (typeof API_KEY !== "string") {
  throw new Error("set REACT_APP_GEMINI_API_KEY in .env");
}

const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  return (
    <div className="streaming-console">
      <SidePanel />
      <main className="scrollable-content">
        <div className="main-app-area">
          {children}
          <video
            className={cn("stream", {
              hidden: !videoRef.current || !videoStream,
            })}
            ref={videoRef}
            autoPlay
            playsInline
          />
        </div>
        <ControlTray
          videoRef={videoRef}
          supportsVideo={true}
          onVideoStreamChange={setVideoStream}
        />
      </main>
    </div>
  );
};

const BasicLayout = ({ children }: { children: React.ReactNode }) => {
  return <main className="basic-layout">{children}</main>;
};

function App() {
  return (
    <Router>
      <div className="App">
        <LiveAPIProvider url={uri} apiKey={API_KEY}>
          <Routes>
            <Route
              path="/"
              element={
                <BasicLayout>
                  <LandingPage />
                </BasicLayout>
              }
            />

            <Route
              path="/health"
              element={
                <MainLayout>
                  <MedSahayak />
                </MainLayout>
              }
            />
            <Route
              path="/dt"
              element={
                <MainLayout>
                  <DualTranscription />
                </MainLayout>
              }
            />
            <Route
              path="/sa"
              element={
                <MainLayout>
                  <LanguageNavigationAssistant />
                </MainLayout>
              }
            />

            {/* Community Market Routes */}
            <Route path="/market" element={<Market />}>
              <Route index element={<LoginSignup />} />
              <Route path="productList" element={<ProductList />} />
              <Route path="addProduct" element={<AddProduct />} />
              <Route path="products/:productId" element={<ProductDetail />} />
            </Route>
          </Routes>
        </LiveAPIProvider>
      </div>
    </Router>
  );
}

export default App;
