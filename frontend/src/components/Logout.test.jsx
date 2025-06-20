
import { render } from '@testing-library/react';
import Logout from './Logout';

// Mocks
const mockLogout = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('Logout component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('chama logout e navega para /login', () => {
    render(<Logout />);
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
