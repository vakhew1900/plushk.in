import { useContext } from 'react';
import { ServicesContext } from '@/context/ServicesContext';

export function useServices() {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error('useServices must be used within a ServicesProvider');
  return ctx;
}
