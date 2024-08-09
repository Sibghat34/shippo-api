import "./App.css";
import InfoForm from "./components/InfoForm";

function App() {
  return (
    <main className="flex flex-col items-center gap-y-10 bg-slate-100 min-h-screen">
      <div className="bg-[#1a3722] w-full">
        <h1 className="text-white font-bold text-3xl py-5 text-center">
          Welcome
        </h1>
      </div>

      <InfoForm />
    </main>
  );
}

export default App;
