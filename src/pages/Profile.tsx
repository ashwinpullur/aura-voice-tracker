import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, updateProfile, type Profile as ProfileType } from '@/services/profileService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state
import { ArrowLeft } from 'lucide-react'; // Added for back button consistency
import { useNavigate } from 'react-router-dom'; // Added for back button

const Profile = () => { // Changed component name to Profile
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate(); // Added for back button
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [fullName, setFullName] = useState('');
  // const [avatarUrl, setAvatarUrl] = useState(''); // Optional for now
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      getProfile(user)
        .then((data) => {
          if (data) {
            setProfile(data);
            setFullName(data.full_name || '');
            // setAvatarUrl(data.avatar_url || '');
          } else {
            // Toast is now more specific based on the new "profile not found" message
            // toast({ title: 'Notice', description: 'Profile not found. It might be created shortly.', variant: 'default' });
          }
        })
        .catch((error) => {
          console.error('Failed to fetch profile', error);
          toast({ title: 'Error', description: 'Failed to fetch profile.', variant: 'destructive' });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false); // No user, so not loading
    }
  }, [user, toast]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile && !user) { // Check for user as well, as profile might be null initially
        toast({ title: 'Error', description: 'User or profile not available.', variant: 'destructive'});
        return;
    }

    setFormLoading(true);
    try {
      // Ensure full_name is not undefined, provide empty string if null
      const currentFullName = fullName;

      const updatedProfileData = await updateProfile({
        full_name: currentFullName,
        // avatar_url: avatarUrl, // Optional
      });

      if (updatedProfileData) {
        setProfile(updatedProfileData);
        setFullName(updatedProfileData.full_name || '');
        // setAvatarUrl(updatedProfileData.avatar_url || '');
        toast({ title: 'Success', description: 'Profile updated successfully.' });
      } else {
        toast({ title: 'Error', description: 'Failed to update profile. The profile might not exist yet or an error occurred.', variant: 'destructive' });
      }
    } catch (error) {
      console.error('Failed to update profile', error);
      toast({ title: 'Error', description: 'An error occurred while updating profile.', variant: 'destructive' });
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/')} disabled={loading}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <Skeleton className="h-8 w-32 mb-1" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
            </div>
            <Skeleton className="h-10 w-1/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Please log in to view your profile.</p>
        <Button onClick={() => navigate('/auth')} className="mt-4">Go to Login</Button>
      </div>
    );
  }

  if (!profile && !loading) { // This condition implies user is loaded, but profile is not.
     return (
      <div className="container mx-auto p-4">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your personal information</p>
          </div>
        </div>
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Profile Not Found</CardTitle>
                <CardDescription>
                We could not load your profile. This can happen if it's your first time signing in and the profile is still being created.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Please try the following:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Wait a few moments and refresh the page.</li>
                    <li>Log out and log back in.</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                If this issue persists, there might be a delay or an issue with the profile creation process.
                The `handle_new_user` trigger in the database is responsible for creating your profile automatically.
                </p>
                 <Button onClick={() => window.location.reload()} className="mt-4">Refresh Page</Button>
            </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="container mx-auto p-4">
       <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} disabled={formLoading}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Profile</h1>
          <p className="text-muted-foreground">Manage your personal information.</p>
        </div>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Update your full name. Your email is linked to your authentication account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email || ''} disabled />
              <p className="text-sm text-muted-foreground mt-1">Your email address cannot be changed here.</p>
            </div>

            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                disabled={formLoading}
              />
            </div>

            {/*
            // Optional Avatar URL field
            <div>
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                type="text"
                value={avatarUrl} // Ensure avatarUrl state is defined if using this
                onChange={(e) => setAvatarUrl(e.target.value)} // Ensure setAvatarUrl state setter is defined
                placeholder="Enter URL for your avatar"
                disabled={formLoading}
              />
            </div>
            */}

            {profile?.updated_at && (
              <div>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(profile.updated_at).toLocaleString()}
                </p>
              </div>
            )}

            <Button type="submit" disabled={formLoading || loading} className="w-full md:w-auto">
              {formLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile; // Changed to Profile
