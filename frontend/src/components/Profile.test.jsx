import '@testing-library/jest-dom';
import axiosInstance from '../utils/api';
import { render, screen, } from '@testing-library/react';
import Profile from './Profile';
import { useAuth } from '../context/AuthContext';

jest.mock('../utils/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    put: jest.fn(),
  },
}));

jest.mock('../context/AuthContext');

describe('Profile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      user: { userId: '123' },
    });
  });

  test('mostra dados do usuário João', async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        success: true,
        user: {
          name: 'João',
          email: 'joao@email.com',
          address: 'Rua João',
          password: 'abc123',
        },
      },
    });

    render(<Profile />);

    expect(await screen.findByDisplayValue('João')).toBeInTheDocument();
    expect(screen.getByDisplayValue('joao@email.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Rua João')).toBeInTheDocument();
  });
});
