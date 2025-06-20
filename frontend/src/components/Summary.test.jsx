import '@testing-library/jest-dom';
import { render, screen, waitFor } from "@testing-library/react";
import Summary from "./Summary";
import axiosInstance from "../utils/api";

import { BrowserRouter } from "react-router-dom";

// Mock do axiosInstance.get
jest.mock("../utils/api", () => ({
  get: jest.fn(),
}));

// Mock do useNavigate
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Summary component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve mostrar os dados carregados corretamente", async () => {
    // Mock da resposta da API
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        totalProducts: 5,
        totalStock: 50,
        ordersToday: 10,
        revenue: 1000,
        outOfStock: [
          { name: "Produto A", category: { name: "Categoria X" } },
        ],
        lowStock: [
          { name: "Produto B", stock: 2, category: { name: "Categoria Y" } },
        ],
        highestSaleProduct: null,
      },
    });

    render(
      <BrowserRouter>
        <Summary />
      </BrowserRouter>
    );

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Total de Produtos")).toBeInTheDocument();
    });

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Produto A")).toBeInTheDocument();
    expect(screen.getByText("Categoria X")).toBeInTheDocument();
    expect(screen.getByText("Produto B")).toBeInTheDocument();
    expect(screen.getByText("2 unidades")).toBeInTheDocument();
    expect(screen.getByText("Categoria Y")).toBeInTheDocument();
  });

  it("deve redirecionar para /login se API retornar erro 401", async () => {
    axiosInstance.get.mockRejectedValueOnce({
      response: {
        data: { success: false },
      },
      message: "Unauthorized",
    });

    render(
      <BrowserRouter>
        <Summary />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });

    expect(screen.getByText(/erro ao carregar dados/i)).toBeInTheDocument();
  });
});
