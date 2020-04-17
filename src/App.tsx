import React from "react";
import "./tailwind.generated.css";
import Recorder from "./components/Recorder";
import Calendar from "./components/Calendar";
import Footer from "./components/Footer";
import Header from "./components/Header";

if (!localStorage.getItem("events"))
  localStorage.setItem("events", JSON.stringify([]));

function App() {
  return (
    <div className="bg-gray-800 w-screen h-screen flex flex-col items-center font-sans overflow-auto">
      <Header />
      <Recorder />
      <Calendar />
      <Footer />
    </div>
  );
}

export default App;
