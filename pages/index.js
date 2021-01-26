import { useState, useEffect, useRef } from 'react';
import { fetchWalks, createWalk } from '../lib/store';
import SignIn from '../components/SignIn';
import { useAuth } from '../lib/auth';

function total(walks) {
  return walks.reduce((acc, w) => acc + w.distance, 0);
}

export default function HomePage() {
  const [walks, setWalks] = useState([]);
  const $distance = useRef(null);

  const auth = useAuth();

  useEffect(() => {
    (async () => {
      const w = await fetchWalks();
      setWalks(w);
    })();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const newWalk = {
      distance: parseFloat($distance.current.value),
      date: new Date(),
      user_id: auth.user.uid,
    };

    console.log({ newWalk });

    const walk = await createWalk(newWalk);
    if (!walk.length) {
      return;
    }
    $distance.current.value = '';
    setWalks([walk[0], ...walks]);
  }

  return (
    <>
      <nav>
        <SignIn />
      </nav>
      <main className="Home">
        <h1>Walks</h1>
        <ul>
          {walks.map((walk) => (
            <li key={walk.id}>{walk.distance}</li>
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
          <strong>Total distance: {total(walks)}</strong>
        </p>
      </main>
    </>
  );
}
