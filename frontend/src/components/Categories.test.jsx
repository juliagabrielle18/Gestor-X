import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Categories from './Categories';
import axiosInstance from '../utils/api';

jest.mock('../utils/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

beforeAll(() => {
  
  Storage.prototype.getItem = jest.fn(() => 'token-mock');
});

describe('Categories Component', () => {
  const mockCategories = [
    { _id: '1', name: 'Teste 1', description: 'Desc 1' },
    { _id: '2', name: 'Teste 2', description: 'Desc 2' },
  ];

  beforeEach(() => {
    
    
    axiosInstance.get.mockResolvedValue({ data: { success: true, categories: mockCategories } });
    axiosInstance.post.mockReset();
    axiosInstance.put.mockReset();
    axiosInstance.delete.mockReset();
  });

  test('renderiza título, inputs e lista de categorias', async () => {
    render(<Categories />);
    expect(screen.getByText(/Gerenciar Categorias/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Insira o nome da categoria/i)).toBeInTheDocument();

   
    expect(await screen.findByText('Teste 1')).toBeInTheDocument();
  });

  test('filtra categorias na busca', async () => {
    render(<Categories />);
    await screen.findByText('Teste 1');
    await screen.findByText('Teste 2');

    fireEvent.change(screen.getByPlaceholderText(/Pesquisar por categorias/i), {
      target: { value: '1' },
    });

    await waitFor(() => {
      expect(screen.getByText('Teste 1')).toBeInTheDocument();
      expect(screen.queryByText('Teste 2')).not.toBeInTheDocument();
    });
  });

  test('adicionar categoria chama axios.post e atualiza lista', async () => {
    axiosInstance.post.mockResolvedValue({ data: { success: true } });

    render(<Categories />);
    await screen.findByText('Teste 1');

    fireEvent.change(screen.getByPlaceholderText(/Insira o nome da categoria/i), {
      target: { value: 'Nova Categoria' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Descrição da categoria/i), {
      target: { value: 'Descrição nova' },
    });
    fireEvent.click(screen.getByText(/Adicionar Categoria/i));

    expect(axiosInstance.post).toHaveBeenCalledWith(
      '/category/add',
      { formCategory: 'Nova Categoria', formDescription: 'Descrição nova' },
      expect.any(Object) 
    );

  
    await waitFor(() => expect(axiosInstance.get).toHaveBeenCalledTimes(2));
  });

  test('editar categoria chama axios.put e atualiza lista', async () => {
    axiosInstance.put.mockResolvedValue({ data: { success: true } });

    render(<Categories />);
    await screen.findByText('Teste 1');

    
    fireEvent.click(screen.getAllByText('Editar')[0]);

  
    fireEvent.change(screen.getByPlaceholderText(/Insira o nome da categoria/i), {
      target: { value: 'Teste 1 Editado' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Descrição da categoria/i), {
      target: { value: 'Desc 1 Editada' },
    });

    
    fireEvent.click(screen.getByText('Salvar'));

    expect(axiosInstance.put).toHaveBeenCalledWith(
      '/category/1',
      { formCategory: 'Teste 1 Editado', formDescription: 'Desc 1 Editada' },
      expect.any(Object)
    );

    await waitFor(() => expect(axiosInstance.get).toHaveBeenCalledTimes(2));
  });

  test('deletar categoria chama axios.delete e remove da lista', async () => {
    axiosInstance.delete.mockResolvedValue({ data: { success: true } });

    render(<Categories />);
    await screen.findByText('Teste 1');

    
    fireEvent.click(screen.getAllByText('Deletar')[0]);

    expect(axiosInstance.delete).toHaveBeenCalledWith('/category/1', expect.any(Object));

    
    await waitFor(() => {
      expect(screen.queryByText('Teste 1')).not.toBeInTheDocument();
    });
  });
});