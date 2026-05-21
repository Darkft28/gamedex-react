import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout/MainLayout';
import Home from './pages/Home/Home';
import GameDetail from './pages/GameDetail/GameDetail';
import Publisher from './pages/Publisher/Publisher';
import Favorites from './pages/Favorites/Favorites';
import NotFound from './pages/NotFound/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          {/* Redirige /games vers / pour éviter un double montage du composant */}
          <Route path="/games" element={<Navigate to="/" replace />} />
          <Route path="/games/:id" element={<GameDetail />} />
          <Route path="/publisher/:id" element={<Publisher />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
