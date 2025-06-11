// src/services/profileService.test.ts
import { supabase } from '@/integrations/supabase/client';
import { getProfile, updateProfile, type Profile } from './profileService'; // Adjust path as needed
import { type User } from '@supabase/supabase-js';

// Mock the Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  },
}));

// Helper to cast mock functions
const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('profileService', () => {
  const mockUser = { id: 'test-user-id', email: 'test@example.com' } as User;
  const mockProfile: Profile = {
    id: 'test-user-id',
    full_name: 'Test User',
    avatar_url: null,
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Default to user being authenticated for most tests
    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValue({ data: { user: mockUser }, error: null });
  });

  describe('getProfile', () => {
    it('should return profile data if user is authenticated and profile exists', async () => {
      (mockSupabase.from('profiles').select('*').eq('id', mockUser.id).single as jest.Mock).mockResolvedValueOnce({
        data: mockProfile,
        error: null,
        status: 200,
      });

      const profile = await getProfile(mockUser);
      expect(profile).toEqual(mockProfile);
      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', mockUser.id);
      expect(mockSupabase.single).toHaveBeenCalledTimes(1);
    });

    it('should return null if profile does not exist (status 406)', async () => {
      (mockSupabase.from('profiles').select('*').eq('id', mockUser.id).single as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'No rows found', code: 'PGRST116' }, // PGRST116 is Supabase code for no rows
        status: 406,
      });
      const profile = await getProfile(mockUser);
      expect(profile).toBeNull();
    });

    it('should return null if no user is authenticated and no user is passed', async () => {
      (mockSupabase.auth.getUser as jest.Mock).mockResolvedValueOnce({ data: { user: null }, error: null });
      const profile = await getProfile();
      expect(profile).toBeNull();
    });

    it('should throw and return null if Supabase throws an error (not 406)', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (mockSupabase.from('profiles').select('*').eq('id', mockUser.id).single as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Supabase error', code: 'XYZ' },
        status: 500,
      });
      const profile = await getProfile(mockUser);
      expect(profile).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching profile:', expect.any(Object));
      consoleErrorSpy.mockRestore();
    });
  });

  describe('updateProfile', () => {
    const profileUpdateData = { full_name: 'Updated Test User' };

    it('should update and return profile data if user is authenticated', async () => {
      const updatedProfile = { ...mockProfile, ...profileUpdateData, updated_at: expect.any(String) };
      (mockSupabase.from('profiles').update(expect.any(Object)).eq('id', mockUser.id).select().single as jest.Mock).mockResolvedValueOnce({
        data: updatedProfile,
        error: null,
      });

      const profile = await updateProfile(profileUpdateData);
      expect(profile).toEqual(updatedProfile);
      expect(mockSupabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining({
        full_name: profileUpdateData.full_name,
        id: mockUser.id,
        updated_at: expect.any(String),
      }));
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', mockUser.id);
      expect(mockSupabase.select).toHaveBeenCalledTimes(1);
      expect(mockSupabase.single).toHaveBeenCalledTimes(1);
    });

    it('should return null if no user is authenticated', async () => {
      (mockSupabase.auth.getUser as jest.Mock).mockResolvedValueOnce({ data: { user: null }, error: null });
      const profile = await updateProfile(profileUpdateData);
      expect(profile).toBeNull();
    });

    it('should throw and return null if Supabase throws an error during update', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (mockSupabase.from('profiles').update(expect.any(Object)).eq('id', mockUser.id).select().single as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Supabase update error' },
      });
      const profile = await updateProfile(profileUpdateData);
      expect(profile).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating profile:', expect.any(Object));
      consoleErrorSpy.mockRestore();
    });
  });
});
