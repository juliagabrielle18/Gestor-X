
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Users from './Users';
import axiosInstance from '../utils/api';


export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('user');

  const token = localStorage.getItem('ims_token');

  useEffect(() => {
    axiosInstance
      .get('/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data.success) {
          setUsers(res.data.users);
          setFilteredUsers(res.data.users);
        }
        setLoading(false);
      })
      .catch(() => {
        setUsers([]);
        setFilteredUsers([]);
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    setFilteredUsers(
      users.filter(user =>
        user.name.toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [filterText, users]);

  function handleDelete(id) {
    axiosInstance
      .delete(`/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setUsers(users.filter(u => u._id !== id));
      });
  }

  function handleAddUser(e) {
    e.preventDefault();
    axiosInstance
      .post(
        '/users/add',
        { name, email, password, address, role },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        // Recarrega usuários
        return axiosInstance.get('/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then(res => {
        if (res.data.success) {
          setUsers(res.data.users);
          setFilteredUsers(res.data.users);
          setName('');
          setEmail('');
          setPassword('');
          setAddress('');
          setRole('user');
        }
      });
  }

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Lista de Usuários</h1>
      <input
        placeholder="Pesquisar usuários"
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
      />
      <ul>
        {filteredUsers.map(user => (
          <li key={user._id}>
            {user.name} ({user.email}) - {user.role}
            <button onClick={() => handleDelete(user._id)}>Deletar</button>
          </li>
        ))}
      </ul>

      <h2>Adicionar novo usuário</h2>
      <form onSubmit={handleAddUser}>
        <input
          placeholder="Insira o nome"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          placeholder="Insira o email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="******"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          placeholder="Insira o endereço"
          value={address}
          onChange={e => setAddress(e.target.value)}
          required
        />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>

        <button type="submit">Adiconar usuário</button>
      </form>
    </div>
  );
}
