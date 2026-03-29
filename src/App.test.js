import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./utils/animeQuote', () => {
  const data = {
    anime: 'Test Anime',
    character: 'Test Character',
    quote: 'A calm line for tests.',
  };
  return {
    fetchRandomAnimeQuote: () => {
      const self = {
        then(onFulfilled) {
          onFulfilled(data);
          return self;
        },
        catch() {
          return self;
        },
        finally(onFinally) {
          onFinally();
          return self;
        },
      };
      return self;
    },
  };
});

test('renders Soothing Space login UI', () => {
  render(<App />);

  expect(screen.getByText(/A calm line for tests\./i)).toBeInTheDocument();
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
