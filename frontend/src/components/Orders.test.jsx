import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import Orders from './Orders';
import axiosInstance from '../utils/api';
import { useAuth } from '../context/AuthContext';

jest.mock('../utils/api', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

jest.mock('../context/AuthContext');

describe('Orders Component básico', () => {
  const mockOrders = [
    {
      _id: 'order1',
      user: { name: 'João' },
      product: { name: 'Produto A', category: { name: 'Categoria X' } },
      quantity: 3,
      totalPrice: 150.5,
      orderDate: '2025-06-01T00:00:00Z',
    },
    {
      _id: 'order2',
      user: { name: 'Maria' },
      product: { name: 'Produto B', category: { name: 'Categoria Y' } },
      quantity: 1,
      totalPrice: 50.0,
      orderDate: '2025-06-02T00:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('exibe título e dados básicos da tabela', async () => {
    useAuth.mockReturnValue({ user: { userId: 'admin123', role: 'admin' } });
    axiosInstance.get.mockResolvedValue({ data: { success: true, orders: mockOrders } });

    render(<Orders />);

    // Espera e verifica título
    expect(await screen.findByText(/Histórico de Reposição/i)).toBeInTheDocument();

    // Verifica algumas colunas básicas (não precisa de regex)
    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('Usuário')).toBeInTheDocument();
    expect(screen.getByText('Produto')).toBeInTheDocument();

    // Verifica dados da primeira linha pelo nome do usuário
    const joaoRow = await screen.findByText('João');
    const rowElement = joaoRow.closest('tr');

    expect(within(rowElement).getByText('Produto A')).toBeInTheDocument();
    expect(within(rowElement).getByText('Categoria X')).toBeInTheDocument();
    expect(within(rowElement).getByText('3')).toBeInTheDocument();
    expect(within(rowElement).getByText('R$ 150.50')).toBeInTheDocument();

    // Verifica dados da segunda linha
    const mariaRow = await screen.findByText('Maria');
    const rowMariaElement = mariaRow.closest('tr');

    expect(within(rowMariaElement).getByText('Produto B')).toBeInTheDocument();
    expect(within(rowMariaElement).getByText('Categoria Y')).toBeInTheDocument();
    expect(within(rowMariaElement).getByText('1')).toBeInTheDocument();
    expect(within(rowMariaElement).getByText('R$ 50.00')).toBeInTheDocument();
  });
});
