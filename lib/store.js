import supabase from './supabase';

export const createUser = async (user) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([user], { upsert: true });

    if (error) {
      throw new Error(error);
    }

    return data;
  } catch (error) {
    console.log('error creating user', error);
  }
};

export const fetchWalks = async () => {
  try {
    const { data, error } = await supabase.from('walks').select('*');

    if (error) {
      throw new Error(error);
    }

    return data;
  } catch (error) {
    console.log('error', error);
  }
};

export const createWalk = async (walk) => {
  const { data, error } = await supabase.from('walks').insert([walk]);

  if (error) {
    console.log(error);
    return [];
  }

  return data;
};
