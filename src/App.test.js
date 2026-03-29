import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders Soothing Space login UI', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', { name: /Soothing Space/i })
  ).toBeInTheDocument();
  expect(
    screen.getByText(/your personal space for soothing sounds/i)
  ).toBeInTheDocument();

  expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: /log in/i })
  ).toBeInTheDocument();
});

test('shows validation error on submit', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /log in/i }));
  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
});

test('navigates from login to signup and back', () => {
  render(<App />);

  fireEvent.click(
    screen.getByRole('button', { name: /don't have an account\? sign up/i })
  );
  expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/name/i)).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole('button', { name: /already have an account\? back to log in/i })
  );
  expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
});
