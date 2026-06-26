import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: userService.getMyProfile,
  });

  const profile = data?.data;

  if (isLoading) {
    return (
      <div className="p-10 text-center">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">

      {/* Profile Card */}

      <Card>
        <CardContent className="pt-8">

          <div className="flex flex-col md:flex-row gap-8 items-center">

            <div>

              <Avatar className="h-36 w-36 border-4 border-primary shadow-xl">

                <AvatarFallback className="text-5xl">
                  {profile.name?.charAt(0).toUpperCase()}
                </AvatarFallback>

              </Avatar>

            </div>

            <div className="space-y-2 flex-1">

              <h1 className="text-3xl font-bold">
                {profile.name}
              </h1>

              <p className="text-muted-foreground">
                @{profile.username}
              </p>

              <Badge>
                {profile.role.toUpperCase()}
              </Badge>

              <p className="text-sm text-muted-foreground">
                Joined{" "}
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>

            </div>

          </div>

        </CardContent>
      </Card>

      {/* Information */}

      <Card>

        <CardHeader>

          <CardTitle>
            Profile Information
          </CardTitle>

        </CardHeader>

        <CardContent className="space-y-6">

          <div>
            <Label>Name</Label>

            <Input
              value={profile.name}
              disabled
            />
          </div>

          <div>
            <Label>Username</Label>

            <Input
              value={profile.username}
              disabled
            />
          </div>

          <div>
            <Label>Email</Label>

            <Input
              type="email"
              value={profile.email}
              disabled
            />
          </div>

          <div>
            <Label>Role</Label>

            <Input
              value={profile.role}
              disabled
            />
          </div>

          <div>
            <Label>Member Since</Label>

            <Input
              value={new Date(profile.createdAt).toLocaleDateString()}
              disabled
            />
          </div>

        </CardContent>

      </Card>

    </div>
  );
};

export default Profile;