import { useAuth } from '../lib/auth';

export const oneMile = 0.6213712;

export default function Distance({ km }) {
  const auth = useAuth();

  const units = auth.user?.preferences?.units || 'km';

  const normalised = units === 'km' ? km : km * oneMile;

  return (
    <span>
      {normalised} {units}
    </span>
  );
}
