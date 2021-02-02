import { useAuth } from '../lib/auth';
import { updatePreference } from '../lib/User';

export default function UnitsSelector() {
  const auth = useAuth();

  if (!auth.user) return null;

  async function handleChange(e) {
    const { value } = e.target;

    await updatePreference(auth.user.id, 'units', value);
    auth.refreshUser();
  }

  return (
    <select onChange={handleChange} defaultValue={auth.user.preferences.units}>
      <option value="km">Kilometers</option>
      <option value="miles">Miles</option>
    </select>
  );
}
