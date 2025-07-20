
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CheckSquare, Square, Timer, Building2, FileText } from 'lucide-react';

interface BulkActionsProps {
  selectedItems: string[];
  onSelectAll: () => void;
  onSelectNone: () => void;
  onBulkComplete: (items: string[], trait: string) => void;
  onBulkBank: (items: string[], inBank: boolean) => void;
  onBulkTimer: (items: string[], trait: string, hours: number) => void;
  availableTraits: string[];
}

export function BulkActions({
  selectedItems,
  onSelectAll,
  onSelectNone,
  onBulkComplete,
  onBulkBank,
  onBulkTimer,
  availableTraits
}: BulkActionsProps) {
  const [selectedTrait, setSelectedTrait] = useState<string>('');
  const [timerHours, setTimerHours] = useState<number>(6);

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            {selectedItems.length} items selected
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            className="h-8 px-3"
          >
            <CheckSquare className="w-4 h-4 mr-1" />
            All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectNone}
            className="h-8 px-3"
          >
            <Square className="w-4 h-4 mr-1" />
            None
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bulk Research Complete */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Mark Research Complete</label>
          <div className="flex gap-2">
            <Select value={selectedTrait} onValueChange={setSelectedTrait}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select trait" />
              </SelectTrigger>
              <SelectContent>
                {availableTraits.map(trait => (
                  <SelectItem key={trait} value={trait}>
                    {trait}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={() => selectedTrait && onBulkComplete(selectedItems, selectedTrait)}
              disabled={!selectedTrait}
            >
              Complete
            </Button>
          </div>
        </div>

        {/* Bulk Bank Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Bank Status</label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm" 
              onClick={() => onBulkBank(selectedItems, true)}
              className="flex-1"
            >
              <Building2 className="w-4 h-4 mr-1" />
              Add to Bank
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkBank(selectedItems, false)}
              className="flex-1"
            >
              Remove from Bank
            </Button>
          </div>
        </div>

        {/* Bulk Timer */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Set Research Timer</label>
          <div className="flex gap-2">
            <Select value={selectedTrait} onValueChange={setSelectedTrait}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select trait" />
              </SelectTrigger>
              <SelectContent>
                {availableTraits.map(trait => (
                  <SelectItem key={trait} value={trait}>
                    {trait}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={() => selectedTrait && onBulkTimer(selectedItems, selectedTrait, timerHours)}
              disabled={!selectedTrait}
            >
              <Timer className="w-4 h-4 mr-1" />
              Set
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
