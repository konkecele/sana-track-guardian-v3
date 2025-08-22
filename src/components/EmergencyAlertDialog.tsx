import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { AlertTriangle, Phone, MessageCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface Child {
  id: number;
  name: string;
}

interface EmergencyAlertDialogProps {
  children: Child[];
}

const EmergencyAlertDialog: React.FC<EmergencyAlertDialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState('');
  const [alertType, setAlertType] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const alertTypes = [
    { value: 'missing', label: 'Child Missing' },
    { value: 'danger', label: 'Immediate Danger' },
    { value: 'medical', label: 'Medical Emergency' },
    { value: 'lost', label: 'Child Lost/Confused' }
  ];

  const handleSendAlert = () => {
    if (!selectedChild || !alertType) {
      toast({
        title: "Error",
        description: "Please select a child and alert type",
        variant: "destructive",
      });
      return;
    }

    const childName = children.find(c => c.id.toString() === selectedChild)?.name;
    
    // Simulate emergency alert
    toast({
      title: "Emergency Alert Sent",
      description: `Alert sent for ${childName}. Emergency contacts notified.`,
    });
    
    setOpen(false);
    setSelectedChild('');
    setAlertType('');
    setMessage('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn-secondary">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Emergency Alert
        </button>
      </DialogTrigger>
      <DialogContent className="sana-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-status-danger" />
            Send Emergency Alert
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="child" className="text-foreground">Select Child</Label>
            <Select value={selectedChild} onValueChange={setSelectedChild}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Choose which child" />
              </SelectTrigger>
              <SelectContent>
                {children.map((child) => (
                  <SelectItem key={child.id} value={child.id.toString()}>
                    {child.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="alertType" className="text-foreground">Alert Type</Label>
            <Select value={alertType} onValueChange={setAlertType}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select emergency type" />
              </SelectTrigger>
              <SelectContent>
                {alertTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="message" className="text-foreground">Additional Information (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide any additional details..."
              className="bg-background border-border resize-none"
              rows={3}
            />
          </div>
          
          <div className="bg-status-danger/10 border border-status-danger/20 rounded-lg p-3">
            <p className="text-sm text-status-danger font-medium mb-2">
              Emergency contacts will be notified immediately:
            </p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>Local Emergency Services</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>Family Members</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleSendAlert}
              className="btn-primary flex-1 bg-status-danger hover:bg-status-danger/80"
            >
              Send Emergency Alert
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmergencyAlertDialog;