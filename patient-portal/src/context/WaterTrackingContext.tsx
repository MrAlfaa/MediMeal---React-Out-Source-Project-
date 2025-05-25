import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface WaterTrackingContextType {
  dailyGoal: number;
  currentIntake: number;
  logWater: (amount?: number) => void;
  resetDaily: () => void;
  getProgress: () => number;
  getLastLoggedDate: () => string;
}

const WaterTrackingContext = createContext<WaterTrackingContextType | undefined>(undefined);

export const useWaterTracking = () => {
  const context = useContext(WaterTrackingContext);
  if (!context) {
    throw new Error('useWaterTracking must be used within a WaterTrackingProvider');
  }
  return context;
};

interface WaterTrackingProviderProps {
  children: ReactNode;
}

export const WaterTrackingProvider: React.FC<WaterTrackingProviderProps> = ({ children }) => {
  const [dailyGoal] = useState(8); // 8 glasses
  const [currentIntake, setCurrentIntake] = useState(0);

  // Load data from localStorage on mount
  useEffect(() => {
    const today = new Date().toDateString();
    const savedData = localStorage.getItem('waterTracking');
    
    if (savedData) {
      const { date, intake } = JSON.parse(savedData);
      if (date === today) {
        setCurrentIntake(intake);
      } else {
        // New day, reset
        setCurrentIntake(0);
        localStorage.setItem('waterTracking', JSON.stringify({ date: today, intake: 0 }));
      }
    } else {
      localStorage.setItem('waterTracking', JSON.stringify({ date: today, intake: 0 }));
    }
  }, []);

  // Save to localStorage when intake changes
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem('waterTracking', JSON.stringify({ 
      date: today, 
      intake: currentIntake 
    }));
  }, [currentIntake]);

  const logWater = (amount: number = 1) => {
    setCurrentIntake(prev => Math.min(prev + amount, dailyGoal + 5)); // Allow slight overflow
  };

  const resetDaily = () => {
    setCurrentIntake(0);
    const today = new Date().toDateString();
    localStorage.setItem('waterTracking', JSON.stringify({ 
      date: today, 
      intake: 0 
    }));
  };

  const getProgress = () => {
    return Math.min((currentIntake / dailyGoal) * 100, 100);
  };

  const getLastLoggedDate = () => {
    const savedData = localStorage.getItem('waterTracking');
    if (savedData) {
      const { date } = JSON.parse(savedData);
      return date;
    }
    return new Date().toDateString();
  };

  return (
    <WaterTrackingContext.Provider value={{
      dailyGoal,
      currentIntake,
      logWater,
      resetDaily,
      getProgress,
      getLastLoggedDate
    }}>
      {children}
    </WaterTrackingContext.Provider>
  );
};