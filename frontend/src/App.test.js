import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ElectroShop AI brand logo', () => {
  render(<App />);
  const brandElements = screen.getAllByText(/ElectroShop AI/i);
  expect(brandElements.length).toBeGreaterThan(0);
});

