import { Button } from "../ui/button";

export const History = () => {
  return (
    <div className="">
      <div className="flex flex-col gap-4">
        <div className="mt-5 mb-5">
          <h1 className="text-xl font-bold">History</h1>
          <p className="text-sm">
            Save your history as JSON, or import someone else's. Importing will
            NOT delete existing messages
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/70 flex h-38 w-full flex-col gap-2 rounded-xl border p-4">
            <p className="flex-1 text-xs">
              We found locally stored chat data on your device. If you had sync
              disabled before, it might be missing. Click below to sync it to
              our servers.
            </p>
            <Button className="mt-4 w-fit">Restore Legacy Chats</Button>
          </div>
          <div className="bg-muted/70 flex h-38 w-full flex-col gap-2 rounded-xl border p-4">
            <p className="flex-1 text-xs">
              If your chats from before June 1st are missing, click this to
              bring them back. Contact support if you have issues.
            </p>
            <Button className="mt-4 w-fit">Restore Old Chats</Button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <p className="text-sm">
            Permanently delete your history from both your local device and our
            servers.*
          </p>
          <Button variant={"destructive"} className="w-fit">
            Delete History
          </Button>
        </div>
      </div>
    </div>
  );
};
