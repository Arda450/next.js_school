import ProfileForm from "@/components/forms/profile-form";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  return (
    <div className="container max-w-2xl mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile Settings</h3>
          <p className="text-sm text-muted-foreground">
            Update your profile information.
          </p>
        </div>
        <Separator />
        <ProfileForm />
      </div>
    </div>
  );
}
