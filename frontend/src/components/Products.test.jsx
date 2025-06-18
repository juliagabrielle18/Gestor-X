import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import Products from "./Products"; 


// Mock do axios para evitar erro de import no Jest
jest.mock("axios", () => ({
  create: () => ({
    get: jest.fn(() =>
      Promise.resolve({
        data: [
          { id: 1, name: "Produto 1" },
          { id: 2, name: "Produto 2" },
        ],
      })
    ),
  }),
}));

import Products from "./Products";

test("renderiza lista de produtos", async () => {
  render(<Products />);
  
  // Espera aparecer os nomes dos produtos no DOM
  await waitFor(() => {
    expect(screen.getByText("Produto 1")).toBeInTheDocument();
    expect(screen.getByText("Produto 2")).toBeInTheDocument();
  });
});
