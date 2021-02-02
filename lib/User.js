import supabase from './supabase';

export async function updatePreference(userId, column, value) {
  const { error } = await supabase
    .from('preferences')
    .insert({ user_id: userId, [column]: value }, { upsert: true });

  if (error) console.log(error);
}

export async function getPreferences(userId) {
  const { data, error } = await supabase
    .from('preferences')
    .select('*')
    .match({ user_id: userId });

  if (error) {
    console.log(error);
    return {};
  }

  return data[0] || {};
}

export async function formatUser(rawUser) {
  const u = { id: rawUser.id, email: rawUser.email };

  u.preferences = await getPreferences(u.id);

  return u;
}
