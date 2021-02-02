import { useState, useEffect, useRef } from 'react';
import { getWalks, createWalk } from '../lib/store';
import { useAuth } from '../lib/auth';
import Distance, { oneMile } from '../components/Distance';
import Header from '../components/Header';

function total(walks) {
  return walks.reduce((acc, w) => acc + w.distance, 0);
}

export default function HomePage() {
  const [walks, setWalks] = useState([]);
  const $distance = useRef(null);

  const auth = useAuth();

  // Load walks on page load
  useEffect(() => {
    (async () => {
      const w = await getWalks();
      setWalks(w);
    })();
  }, []);

  // Update walks when auth state changes.
  useEffect(() => {
    if (!auth.user) {
      setWalks([]);
      return;
    }

    (async () => {
      const w = await getWalks();
      setWalks(w);
    })();
  }, [auth.user]);

  /**
   * Handle creating a new walk when the form is submitted.
   *
   * @param {SubmitEvent} e
   */
  async function handleSubmit(e) {
    e.preventDefault();

    const unitsMultiplier = auth.user.preferences.units === 'km' ? 1 : oneMile;

    const newWalk = {
      distance: parseFloat($distance.current.value / unitsMultiplier),
      date: new Date(),
    };

    const walk = await createWalk(auth.user.id, newWalk);
    if (!walk.length) {
      return;
    }
    $distance.current.value = '';
    setWalks([walk[0], ...walks]);
  }

  return (
    <>
      <Header />

      <main className="Home">
        <h1>Walks</h1>
        <ul>
          {walks.map((walk) => (
            <li key={walk.id}>
              <Distance km={walk.distance} />
            </li>
          ))}
        </ul>

        {auth.user ? (
          <form onSubmit={handleSubmit}>
            <label>
              <span>Distance</span>
              <input
                name="distance"
                type="number"
                step="0.01"
                placeholder="0.0"
                ref={$distance}
              />
            </label>

            <button type="submit">Submit</button>
          </form>
        ) : (
          <p>You must be logged in to add walks.</p>
        )}

        <p>
          <strong>
            Total distance: <Distance km={total(walks)} />
          </strong>
        </p>
      </main>
    </>
  );
}
