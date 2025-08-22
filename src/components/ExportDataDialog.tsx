import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Download, FileText, Calendar } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface Child {
  id: number;
  name: string;
}

interface ExportDataDialogProps {
  children: Child[];
}

const ExportDataDialog: React.FC<ExportDataDialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState('');
  const [dataTypes, setDataTypes] = useState({
    locations: true,
    battery: true,
    status: true,
    alerts: false
  });
  const [format, setFormat] = useState('csv');
  const { toast } = useToast();

  const timeRanges = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '3m', label: 'Last 3 Months' },
    { value: 'all', label: 'All Time' }
  ];

  const handleChildToggle = (childId: string) => {
    setSelectedChildren(prev => 
      prev.includes(childId) 
        ? prev.filter(id => id !== childId)
        : [...prev, childId]
    );
  };

  const handleExport = () => {
    if (selectedChildren.length === 0 || !timeRange) {
      toast({
        title: "Error",
        description: "Please select at least one child and time range",
        variant: "destructive",
      });
      return;
    }

    // Simulate data export
    const fileName = `sanatrack-export-${Date.now()}.${format}`;
    
    toast({
      title: "Export Complete",
      description: `Data exported as ${fileName}. Download started.`,
    });
    
    // In a real app, this would generate and download the file
    const selectedChildNames = children
      .filter(c => selectedChildren.includes(c.id.toString()))
      .map(c => c.name)
      .join(', ');
    
    console.log(`Exporting data for: ${selectedChildNames}`);
    console.log(`Time range: ${timeRange}`);
    console.log(`Data types:`, dataTypes);
    console.log(`Format: ${format}`);
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="btn-secondary">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </button>
      </DialogTrigger>
      <DialogContent className="sana-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center">
            <FileText className="w-5 h-5 mr-2 text-primary" />
            Export Tracking Data
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-foreground mb-2 block">Select Children</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {children.map((child) => (
                <div key={child.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`child-${child.id}`}
                    checked={selectedChildren.includes(child.id.toString())}
                    onCheckedChange={() => handleChildToggle(child.id.toString())}
                  />
                  <Label htmlFor={`child-${child.id}`} className="text-foreground text-sm">
                    {child.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="timeRange" className="text-foreground">Time Range</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-foreground mb-2 block">Data Types</Label>
            <div className="space-y-2">
              {Object.entries(dataTypes).map(([key, checked]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={checked}
                    onCheckedChange={(value) => 
                      setDataTypes(prev => ({ ...prev, [key]: !!value }))
                    }
                  />
                  <Label htmlFor={key} className="text-foreground text-sm capitalize">
                    {key === 'locations' ? 'Location History' : 
                     key === 'battery' ? 'Battery Levels' :
                     key === 'status' ? 'Status Changes' : 
                     'Alert History'}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="format" className="text-foreground">Export Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV (Spreadsheet)</SelectItem>
                <SelectItem value="json">JSON (Developer)</SelectItem>
                <SelectItem value="pdf">PDF (Report)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleExport}
              className="btn-primary flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
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

export default ExportDataDialog;