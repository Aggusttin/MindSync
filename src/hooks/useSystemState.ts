// src/hooks/useSystemState.ts

import { useState, useEffect, useCallback } from 'react';
import { Evento, Job, Grupo, Recurso } from '../lib/types';
import * as db from '../lib/db-service';
import { toast } from 'sonner';

export function useSystemState() {
  const [events, setEvents] = useState<Evento[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [groups, setGroups] = useState<Grupo[]>([]);
  const [resources, setResources] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [eventsData, jobsData, groupsData, resourcesData] = await Promise.all([
        db.getEventsFromDB(),
        db.getJobsFromDB(),
        db.getGroupsFromDB(),
        db.getResourcesFromDB(),
      ]);
      setEvents(eventsData);
      setJobs(jobsData);
      setGroups(groupsData);
      setResources(resourcesData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar datos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addEvent = async (eventData: any) => {
    const success = await db.createEventInDB(eventData);
    if (success) {
      // @ts-ignore
      setEvents(prev => [success, ...prev]);
      toast.success("Evento creado con éxito");
      return true;
    }
    return false;
  };

  const addJob = async (jobData: any) => {
    const success = await db.createJobInDB(jobData);
    if (success) {
      // @ts-ignore
      setJobs(prev => [success, ...prev]);
      toast.success("Vacante publicada con éxito");
      return true;
    }
    return false;
  };

  const addGroup = async (groupData: any) => {
    const success = await db.createGroupInDB(groupData);
    if (success) {
      // @ts-ignore
      setGroups(prev => [success, ...prev]);
      toast.success("Grupo creado con éxito");
      return true;
    }
    return false;
  };

  // Maneja inscripción/anulación de eventos
  const handleToggleEvent = async (eventId: string | number, userId: string, isRegistering: boolean) => {
    const idString = String(eventId);
    const success = await db.toggleEventRegistrationInDB(idString, userId, isRegistering);
    
    if (success) {
      setEvents(prev => prev.map(ev => {
        if (String(ev.id) === idString) {
          const currentIds = ev.attendeeIds || [];
          return {
            ...ev,
            attendees: isRegistering ? ev.attendees + 1 : ev.attendees - 1,
            attendeeIds: isRegistering 
              ? [...currentIds, userId] 
              : currentIds.filter(id => id !== userId)
          };
        }
        return ev;
      }));
      toast.success(isRegistering ? "¡Te has inscrito correctamente!" : "Inscripción anulada.");
    } else {
      toast.error("Hubo un error al procesar tu solicitud.");
    }
  };

  // Maneja postulación/anulación de empleos
  const handleToggleJob = async (jobId: string | number, userId: string, isApplying: boolean) => {
    const idString = String(jobId);
    const success = await db.toggleJobApplicationInDB(idString, userId, isApplying);
    
    if (success) {
      setJobs(prev => prev.map(jb => {
        if (String(jb.id) === idString) {
          const currentIds = jb.applicantIds || [];
          return {
            ...jb,
            applicants: isApplying ? jb.applicants + 1 : jb.applicants - 1,
            applicantIds: isApplying 
              ? [...currentIds, userId] 
              : currentIds.filter(id => id !== userId)
          };
        }
        return jb;
      }));
      toast.success(isApplying ? "¡Postulación enviada!" : "Postulación retirada.");
    } else {
      toast.error("Hubo un error al procesar tu solicitud.");
    }
  };

  return {
    events,
    jobs,
    groups,
    resources,
    loading,
    addEvent,
    addJob,
    addGroup,
    handleToggleEvent,
    handleToggleJob,
    refreshData: fetchData
  };
}