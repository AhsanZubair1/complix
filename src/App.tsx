import { BrowserRouter as Router, Routes, Route } from "react-router";

import AppLayout from "./layout/AppLayout";
import Calendar from "./pages/Calendar/Calendar";
import Tasks from "./pages/Task/Tasks";
import Breaches from "./pages/Breaches/Breaches";
import Obligations from "./pages/Obligations/Obligations";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Calendar />} />
            <Route path="/breaches" element={<Breaches />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/obligations" element={<Obligations />} />
            <Route index path="/compliance-calendar" element={<Calendar />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}
