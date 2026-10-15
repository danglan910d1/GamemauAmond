import { useState } from 'react';
import { ScreenId, PrizeItem, PRIZES } from './types';
import { sound } from './sound';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { Game1Screen } from './components/Game1Screen';
import { Game2Screen } from './components/Game2Screen';
import { LuckyWheelScreen } from './components/LuckyWheelScreen';
import { ClaimScreen } from './components/ClaimScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [wonPrize, setWonPrize] = useState<PrizeItem | null>(PRIZES[0]);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sound.enabled = nextState;
  };

  const handleStartGame = () => {
    setCurrentScreen('game1');
  };

  const handleToGame2 = () => {
    setCurrentScreen('game2');
  };

  const handleToWheel = () => {
    setCurrentScreen('wheel');
  };

  const handleClaimPrize = (prize: PrizeItem) => {
    setWonPrize(prize);
    setCurrentScreen('claim');
  };

  const handleGoHome = () => {
    setCurrentScreen('home');
  };

  return (
    <div className="min-h-screen w-full bg-[#ede5d8] flex items-center justify-center sm:p-4">
      {/* Mobile Shell Container */}
      <div className="w-full max-w-[440px] h-[100dvh] sm:h-[884px] bg-[#fdf9f3] flex flex-col shadow-2xl sm:rounded-[36px] overflow-hidden border border-[#d7c2ba]/50 relative">
        {/* Top Header */}
        <Header
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />

        {/* Dynamic Screens */}
        <main className="flex-1 w-full flex flex-col overflow-hidden relative">
          {currentScreen === 'home' && (
            <HomeScreen
              onStart={handleStartGame}
              onNavigate={(screen) => setCurrentScreen(screen)}
            />
          )}

          {currentScreen === 'game1' && (
            <Game1Screen
              onNextRound={handleToGame2}
              onGoHome={handleGoHome}
              onNavigate={(screen) => setCurrentScreen(screen)}
            />
          )}

          {currentScreen === 'game2' && (
            <Game2Screen
              onNextRound={handleToWheel}
              onNavigate={(screen) => setCurrentScreen(screen)}
            />
          )}

          {currentScreen === 'wheel' && (
            <LuckyWheelScreen
              onClaimPrize={handleClaimPrize}
              onNavigate={(screen) => setCurrentScreen(screen)}
            />
          )}

          {currentScreen === 'claim' && (
            <ClaimScreen
              prize={wonPrize}
              onReturnWheel={handleToWheel}
              onGoHome={handleGoHome}
              onNavigate={(screen) => setCurrentScreen(screen)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
