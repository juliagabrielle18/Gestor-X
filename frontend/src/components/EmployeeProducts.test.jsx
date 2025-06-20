import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import EmployeeProducts from './EmployeeProducts';
import axiosInstance from '../utils/api';

jest.mock('../utils/api');

describe('EmployeeProducts component', () => {
  const mockCategories = [
    { _id: 'cat1', name: 'Bebidas' },
    { _id: 'cat2', name: 'Comidas' },
  ];
  const mockProducts = [
    {
      _id: 'prod1',
      name: 'Coca Cola',
      category: { _id: 'cat1', name: 'Bebidas' },
      price: 5,
      stock: 10,
    },
    {
      _id: 'prod2',
      name: 'Pizza',
      category: { _id: 'cat2', name: 'Comidas' },
      price: 20,
      stock: 0,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve carregar e mostrar produtos', async () => {
    axiosInstance.get.mockResolvedValue({
      data: {
        success: true,
        categories: mockCategories,
        products: mockProducts,
      },
    });

    render(<EmployeeProducts />);

    // espera o carregamento terminar
    await waitFor(() => expect(axiosInstance.get).toHaveBeenCalledTimes(1));

    // verifica se os produtos aparecem na tela
    expect(screen.getByText('Coca Cola')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();

    // verifica se as categorias aparecem no select
    expect(screen.getByRole('option', { name: 'Bebidas' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Comidas' })).toBeInTheDocument();
  });

  test('deve abrir modal ao clicar em "Fazer Pedido" e fechar', async () => {
    axiosInstance.get.mockResolvedValue({
      data: {
        success: true,
        categories: mockCategories,
        products: mockProducts,
      },
    });

    render(<EmployeeProducts />);

    await waitFor(() => screen.getByText('Coca Cola'));

    // botão de "Fazer Pedido" para o produto com estoque > 0 deve estar habilitado
    const orderButton = screen.getByRole('button', { name: /fazer pedido/i });
    expect(orderButton).toBeEnabled();

    // clica para abrir modal
    fireEvent.click(orderButton);

    // espera modal aparecer
    expect(screen.getByText('Fazer Pedido')).toBeInTheDocument();

    // botão cancelar fecha modal
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    await waitFor(() => {
      expect(screen.queryByText('Fazer Pedido')).not.toBeInTheDocument();
    });
  });
});
