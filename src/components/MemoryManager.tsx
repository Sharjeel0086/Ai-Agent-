import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Brain, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Memory {
  id: string;
  category: string;
  key: string;
  value: string;
}

export default function MemoryManager() {
  const [open, setOpen] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newCategory, setNewCategory] = useState("preference");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: memories = [] } = useQuery({
    queryKey: ["userMemories"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("user_memories")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Memory[];
    },
  });

  const addMemory = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("user_memories").insert({
        user_id: user.id,
        category: newCategory,
        key: newKey,
        value: newValue,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userMemories"] });
      setNewKey("");
      setNewValue("");
      toast({ title: "Memory added successfully" });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Failed to add memory", description: error.message });
    },
  });

  const deleteMemory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_memories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userMemories"] });
      toast({ title: "Memory deleted" });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Failed to delete memory", description: error.message });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Brain className="h-4 w-4" />
          <span className="hidden sm:inline">Memories</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Your Memories</DialogTitle>
          <DialogDescription>
            Store preferences, facts, and information that the AI will remember about you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold">Add New Memory</h3>
            <div className="space-y-2">
              <div>
                <Label>Category</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preference">Preference</SelectItem>
                    <SelectItem value="fact">Fact</SelectItem>
                    <SelectItem value="writing_style">Writing Style</SelectItem>
                    <SelectItem value="goal">Goal</SelectItem>
                    <SelectItem value="interest">Interest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Key</Label>
                <Input
                  placeholder="e.g., Favorite color"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                />
              </div>
              <div>
                <Label>Value</Label>
                <Input
                  placeholder="e.g., Blue"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
              </div>
              <Button
                onClick={() => addMemory.mutate()}
                disabled={!newKey || !newValue || addMemory.isPending}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Memory
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Saved Memories</h3>
            {memories.length === 0 ? (
              <p className="text-sm text-muted-foreground">No memories yet. Add one above!</p>
            ) : (
              <div className="space-y-2">
                {memories.map((memory) => (
                  <div
                    key={memory.id}
                    className="flex items-start justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          {memory.category}
                        </span>
                        <span className="font-semibold">{memory.key}:</span>
                      </div>
                      <p className="text-sm mt-1">{memory.value}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMemory.mutate(memory.id)}
                      className="ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

