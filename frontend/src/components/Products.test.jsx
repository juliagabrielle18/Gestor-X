import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import Products from './Products';
import axiosInstance from '../utils/api';

// Mock do axiosInstance
jest.mock('../utils/api');

beforeAll(() => {
  Storage.prototype.getItem = jest.fn(() => 'fake-token');
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Products component', () => {
  it('deve renderizar a lista de produtos após buscar os dados', async () => {
    const mockProducts = [
      { id: 1, name: 'Produto 1' },
      { id: 2, name: 'Produto 2' },
    ];

    axiosInstance.get.mockResolvedValueOnce({
      data: {
        success: true,
        products: mockProducts,
      },
    });

    render(<Products />);

    // Espera que os produtos apareçam na tela
    await waitFor(() => {
      expect(screen.getByText('Produto 1')).toBeInTheDocument();
      expect(screen.getByText('Produto 2')).toBeInTheDocument();
    });

    // Verifica que a chamada foi feita com o endpoint correto
    expect(axiosInstance.get).toHaveBeenCalledWith('/products', expect.any(Object));
  });

  it('deve mostrar mensagem de erro se a API falhar', async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error('Erro de rede'));

    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText(/Erro de rede/i)).toBeInTheDocument();
    });
  });
});
