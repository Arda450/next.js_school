import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import UsernameForm from "@/components/forms/profile/username-form";
import EmailForm from "@/components/forms/profile/email-form";
import PasswordForm from "@/components/forms/profile/password-form";
import AvatarForm from "@/components/forms/profile/avatar-form";
import DeleteButton from "@/components/user/deleteUserDialog";

export default function ProfileSettings() {
  return (
    <div className="container max-w-2xl mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Profile Settings</h3>
          <p className="text-sm text-muted-foreground">
            Update your account settings here.
          </p>
        </div>
        <Separator />

        <Tabs defaultValue="username" className="w-full">
          <TabsList>
            <TabsTrigger value="username">Username</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="avatar">Avatar</TabsTrigger>
          </TabsList>

          <TabsContent value="username">
            <UsernameForm />
          </TabsContent>

          <TabsContent value="email">
            <EmailForm />
          </TabsContent>

          <TabsContent value="password">
            <PasswordForm />
          </TabsContent>

          <TabsContent value="avatar">
            <AvatarForm />
          </TabsContent>
        </Tabs>
      </div>
      <div className="mt-4">
        <DeleteButton />
      </div>
    </div>
  );
}
