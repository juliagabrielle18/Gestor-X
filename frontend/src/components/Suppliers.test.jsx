import '@testing-library/jest-dom';
import { render, screen, waitFor } from "@testing-library/react";
import Suppliers from "./Suppliers";
import axiosInstance from "../utils/api";


jest.mock("../utils/api", () => ({
  get: jest.fn(),
}));

describe("Suppliers component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar a lista de fornecedores após buscar os dados", async () => {
    const mockSuppliers = [
      { _id: "1", name: "Fornecedor A", email: "a@exemplo.com", phone: "111", address: "Rua A" },
      { _id: "2", name: "Fornecedor B", email: "b@exemplo.com", phone: "222", address: "Rua B" },
    ];

    axiosInstance.get.mockResolvedValueOnce({
      data: {
        success: true,
        suppliers: mockSuppliers,
      },
    });

    render(<Suppliers />);

    expect(screen.getByText(/Carregando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Fornecedor A")).toBeInTheDocument();
      expect(screen.getByText("Fornecedor B")).toBeInTheDocument();
    });

    expect(axiosInstance.get).toHaveBeenCalledWith("/supplier", expect.any(Object));
  });

  it("deve mostrar mensagem de erro se a API falhar", async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error("Erro de rede"));

    render(<Suppliers />);

    await waitFor(() => {
      expect(screen.getByText(/Erro de rede/i)).toBeInTheDocument();
    });
  });
});
