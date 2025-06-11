import { supabase } from '@/integrations/supabase/client';
import { type User } from '@supabase/supabase-js';

// Define the Profile type based on the 'profiles' table structure
// This should align with src/integrations/supabase/types.ts
export interface Profile {
  id: string; // UUID, matches auth.users.id
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null; // ISO 8601 timestamp
}

/**
 * Fetches the profile for a given user.
 * If no user is provided, it attempts to get the current authenticated user.
 * @param user - Optional Supabase User object.
 * @returns The user's profile data or null if not found or an error occurs.
 */
export const getProfile = async (user?: User | null): Promise<Profile | null> => {
  const userToFetch = user || (await supabase.auth.getUser()).data.user;

  if (!userToFetch) {
    console.error('No user provided or found to fetch profile.');
    return null;
  }

  try {
    const { data, error, status } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userToFetch.id)
      .single();

    if (error && status !== 406) { // 406 is expected if no row is found
      console.error('Error fetching profile:', error);
      throw error;
    }

    if (data) {
      return data as Profile;
    }
  } catch (error) {
    console.error('Exception in getProfile:', error);
    return null;
  }
  return null; // No profile found
};

/**
 * Updates the profile for the current authenticated user.
 * @param profileData - An object containing the profile fields to update.
 *                      Can include 'full_name' and 'avatar_url'.
 * @returns The updated profile data or null if an error occurs.
 */
export const updateProfile = async (
  profileData: Partial<Pick<Profile, 'full_name' | 'avatar_url'>>
): Promise<Profile | null> => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.error('No authenticated user found to update profile.');
    return null;
  }

  try {
    const updateData = {
      ...profileData,
      updated_at: new Date().toISOString(), // Ensure updated_at is set
      id: user.id, // Ensure 'id' is part of the update object for the upsert
    };

    // Use upsert to handle cases where a profile might not exist,
    // though the trigger should create it. 'id' is the conflict target.
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData) // Supabase update only updates, does not insert by default.
                               // For upsert behavior, use .upsert(updateData) if needed,
                               // but RLS for INSERT might conflict if not careful.
                               // Given the trigger, a simple update should suffice.
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    if (data) {
      return data as Profile;
    }
  } catch (error) {
    console.error('Exception in updateProfile:', error);
    return null;
  }
  return null;
};

// Example of how to handle avatar uploads if needed in the future.
// This is more complex and would involve Supabase Storage.
/*
export const uploadAvatar = async (file: File): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars') // Assuming 'avatars' is a public bucket in Supabase Storage
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    console.error('Error uploading avatar:', uploadError);
    return null;
  }

  // Construct the public URL, ensuring it's correctly formed
  const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

  // The publicUrl might have the path duplicated if not handled correctly by Supabase client
  // or if the path itself contains the bucket name. Check Supabase docs for latest on getPublicUrl.
  // For now, assume it returns the direct URL.

  return publicUrl;
};
*/
