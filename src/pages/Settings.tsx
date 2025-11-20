import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/chat")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>
              Your intelligent AI chat companion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This AI chat application provides real-time conversations with an advanced AI assistant
              that adapts to your needs and communicates naturally in any language.
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Features:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Real-time streaming responses</li>
                <li>Multi-language support</li>
                <li>Persistent chat history</li>
                <li>Secure authentication</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
            <CardDescription>
              Features in development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Voice input and output</li>
              <li>File and image upload</li>
              <li>Internet search integration</li>
              <li>Personality modes (Friendly, Professional, etc.)</li>
              <li>Enhanced memory system</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;