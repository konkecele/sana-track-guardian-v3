import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { UserPlus } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface AddChildDialogProps {
  onAddChild: (child: any) => void;
}

const AddChildDialog: React.FC<AddChildDialogProps> = ({ onAddChild }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    address: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.address) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const newChild = {
      id: Date.now(),
      name: formData.name,
      age: parseInt(formData.age),
      location: { 
        lat: -33.9249 + (Math.random() - 0.5) * 0.1, 
        lng: 18.4241 + (Math.random() - 0.5) * 0.1, 
        address: formData.address 
      },
      status: 'safe' as const,
      lastSeen: 'Just now',
      battery: Math.floor(Math.random() * 100),
      isOnline: true
    };

    onAddChild(newChild);
    setFormData({ name: '', age: '', address: '' });
    setOpen(false);
    
    toast({
      title: "Success",
      description: `${formData.name} has been added to tracking`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn-primary">
          <UserPlus className="w-4 h-4 mr-2" />
          Add New Child
        </button>
      </DialogTrigger>
      <DialogContent className="sana-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Child</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-foreground">Child's Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter child's name"
              className="bg-background border-border"
            />
          </div>
          <div>
            <Label htmlFor="age" className="text-foreground">Age</Label>
            <Input
              id="age"
              type="number"
              min="1"
              max="18"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder="Enter age"
              className="bg-background border-border"
            />
          </div>
          <div>
            <Label htmlFor="address" className="text-foreground">Current Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter current address"
              className="bg-background border-border"
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" className="btn-primary flex-1">
              Add Child
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddChildDialog;