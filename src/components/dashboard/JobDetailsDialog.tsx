// src/components/dashboard/JobDetailsDialog.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MapPin, Briefcase, Building2, CheckCircle2, XCircle } from 'lucide-react';
import { Job } from '../../lib/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  userId: string;
  onToggleJob: (jobId: string | number, userId: string, isApplying: boolean) => Promise<void>;
}

export function JobDetailsDialog({ isOpen, onClose, job, userId, onToggleJob }: Props) {
  if (!job) return null;

  const isApplied = job.applicantIds?.includes(userId);

  const handleAction = async () => {
    // Si isApplied es true, queremos ANULAR (false). Si es false, queremos APLICAR (true).
    await onToggleJob(job.id, userId, !isApplied);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">{job.title}</DialogTitle>
              <div className="flex items-center gap-2 text-gray-500 mt-2">
                <Building2 size={16} />
                <span className="font-medium">{job.company}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                {job.type}
                </Badge>
                {isApplied && (
                    <span className="text-xs text-green-600 flex items-center gap-1 font-medium bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle2 size={12}/> Postulado
                    </span>
                )}
            </div>
          </div>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
              <MapPin size={16} /> {job.location}
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
              <Briefcase size={16} /> {job.applicants} postulantes
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> Estilo {job.style}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Descripción del puesto</h4>
            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-xl border border-gray-100">
              {job.description || "No hay descripción disponible para esta vacante."}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          
          <Button 
            onClick={handleAction} 
            variant={isApplied ? "destructive" : "default"}
            className={isApplied 
                ? "bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" 
                : "bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:opacity-90 text-white"
            }
          >
            {isApplied ? (
                <>
                    <XCircle size={18} className="mr-2"/> Anular postulación
                </>
            ) : (
                "Postularme ahora"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}