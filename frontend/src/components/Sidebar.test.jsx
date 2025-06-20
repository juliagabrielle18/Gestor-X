import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';

test('renderiza menu admin quando user admin no localStorage', async () => {
  localStorage.setItem('ims_user', JSON.stringify({ role: 'admin' }));

  render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Usuários')).toBeInTheDocument();
  });
});

test('renderiza menu usuário comum quando user não é admin ou não existe', async () => {
  localStorage.removeItem('ims_user');

  render(
    <MemoryRouter>
      <Sidebar />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.queryByText('Início')).not.toBeInTheDocument();
    expect(screen.getByText('Produtos')).toBeInTheDocument();
  });
});
