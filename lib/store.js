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

export const getWalks = async () => {
  try {
    const { data, error } = await supabase.from('walks').select('*');

    if (error) {
      throw new Error(error);
    }

    return data;
  } catch (error) {
    console.log('error', error);
    return [];
  }
};

export const createWalk = async (userId, walk) => {
  const { data, error } = await supabase
    .from('walks')
    .insert([{ ...walk, user_id: userId }]);

  if (error) {
    console.log(error);
    return [];
  }

  return data;
};
