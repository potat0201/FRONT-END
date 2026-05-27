import { render, screen } from "@testing-library/react";

import App from "./App";

test("renders the logged-out final project screen", () => {
  render(<App />);

  expect(screen.getByText(/Le Dang Khoa/i)).toBeInTheDocument();
  expect(screen.getByText(/Please Login/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Register Me/i })).toBeInTheDocument();
});
