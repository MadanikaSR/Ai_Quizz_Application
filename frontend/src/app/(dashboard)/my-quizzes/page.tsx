"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  LayoutGrid, 
  Search, 
  BookOpen, 
  User as UserIcon,
  Sparkles,
  ChevronRight,
  FolderPlus,
  MoreVertical,
  Filter,
  Layers,
  Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function MyQuizzesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const res = await api.get("categories/");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("categories/", {
        name: newCatName,
        description: newCatDesc
      });
      setIsDialogOpen(false);
      setNewCatName("");
      setNewCatDesc("");
      fetchCategories();
    } catch (err) {
      console.error("Failed to create category", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20 overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
            <Layers className="h-3 w-3" />
            Knowledge Assets
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Library</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-lg">
            Manage your custom categories and organized knowledge domains for targeted AI generation.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button size="lg" className="h-16 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02]">
              <FolderPlus className="mr-3 h-5 w-5" />
              New Category
            </Button>
          } />
          <DialogContent className="rounded-[32px] border-none shadow-2xl p-8 max-w-md">
            <form onSubmit={handleCreateCategory} className="space-y-8">
              <DialogHeader>
                <DialogTitle className="text-3xl font-black tracking-tight">Expand Library</DialogTitle>
                <DialogDescription className="text-base font-medium">
                  Create a new subject bucket to categorize your future AI quizzes.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="cat-name" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category Name</Label>
                  <Input 
                    id="cat-name" 
                    placeholder="e.g. Advanced Bio-Chemistry" 
                    className="h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none px-6 font-bold"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="cat-desc" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mission Statement (Optional)</Label>
                  <Textarea 
                    id="cat-desc" 
                    placeholder="Deep dive into molecular structures..." 
                    className="rounded-2xl bg-slate-50 dark:bg-slate-800 border-none p-6 min-h-[120px] font-medium"
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="button" variant="ghost" className="h-14 rounded-2xl font-black uppercase text-xs tracking-widest" onClick={() => setIsDialogOpen(false)}>Abort</Button>
                <Button type="submit" className="h-14 flex-1 rounded-2xl bg-slate-900 text-white font-black uppercase text-xs tracking-widest shadow-xl" disabled={isSubmitting || !newCatName}>
                  {isSubmitting ? "Syncing..." : "Provision Category"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
         <div className="relative group flex-1 md:max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 transition-colors group-focus-within:text-blue-600" />
            <Input 
              className="h-14 pl-14 pr-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-2xl font-bold shadow-sm focus:ring-blue-600" 
              placeholder="Search across domains..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <Button variant="outline" className="h-14 w-14 rounded-2xl border-slate-100 dark:border-slate-800 p-0 text-slate-400">
            <Filter className="h-5 w-5" />
         </Button>
      </div>

      {/* Responsive Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-72 rounded-[40px] bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="py-40 text-center flex flex-col items-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[64px]">
           <div className="p-8 rounded-[40px] bg-slate-50 dark:bg-slate-800 mb-8 border border-white dark:border-slate-700">
              <Sparkles className="h-12 w-12 text-slate-200" />
           </div>
           <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Library Empty</h3>
           <p className="text-slate-400 font-medium mb-10 max-w-xs text-lg">Your categorized knowledge is waiting to be structured. Create your first category today.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((cat, idx) => (
            <Card key={cat.id} className="group flex flex-col hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] transition-all duration-500 border-none bg-white dark:bg-slate-900 rounded-[48px] overflow-hidden p-3 pt-6 h-full min-h-[320px]">
              <CardHeader className="p-8 pb-4 relative flex-1">
                 <div className="absolute top-8 right-8 text-slate-300 dark:text-slate-700 opacity-20 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-5 w-5" />
                 </div>
                 
                 <div className="flex flex-col gap-6">
                    <div className={`h-16 w-16 rounded-[24px] flex items-center justify-center text-blue-600 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${idx % 2 === 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-indigo-50 dark:bg-indigo-900/20'}`}>
                       <LayoutGrid className="h-8 w-8" />
                    </div>
                    
                    <div className="space-y-4">
                       <div className="flex flex-col gap-2">
                          {cat.created_by && (
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 bg-blue-50/50 dark:bg-blue-900/30 px-3 py-1 rounded-lg w-fit">
                                Personalized Domain
                             </span>
                          )}
                          <CardTitle className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white line-clamp-2 uppercase leading-none min-h-[60px]">
                            {cat.name}
                          </CardTitle>
                       </div>
                       <CardDescription className="text-base font-medium line-clamp-2 text-slate-400">
                         {cat.description || "Synthesizing deep-learning modules for this subject block."}
                       </CardDescription>
                    </div>
                 </div>
              </CardHeader>

              <CardContent className="px-8 pb-4 pt-0">
                 <div className="flex items-center gap-6 text-sm text-slate-400 font-bold uppercase tracking-widest">
                    <div className="flex items-center">
                       <BookOpen className="h-4 w-4 mr-2 text-blue-500" />
                       {cat.quiz_count || 0} Sets
                    </div>
                    {cat.created_by && (
                       <div className="flex items-center">
                         <UserIcon className="h-4 w-4 mr-2 text-indigo-500" />
                         {cat.created_by.username}
                       </div>
                    )}
                 </div>
              </CardContent>

              <CardFooter className="p-4 pt-4">
                <Button 
                   className="w-full h-16 rounded-[28px] bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs border border-transparent hover:border-blue-500 hover:bg-white dark:hover:bg-slate-900 transition-all group/btn"
                   onClick={() => router.push(`/create-quiz?category=${cat.id}`)}
                >
                   Generate Session
                   <ChevronRight className="ml-2 h-4 w-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
