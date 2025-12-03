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
      const [e, j, g, r] = await Promise.all([
        db.getEventsFromDB(),
        db.getJobsFromDB(),
        db.getGroupsFromDB(),
        db.getResourcesFromDB(),
      ]);
      setEvents(e); setJobs(j); setGroups(g); setResources(r);
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addEvent = async (data: any) => {
    const res = await db.createEventInDB(data);
    if(res) { setEvents(p => [res as Evento, ...p]); toast.success("Evento creado"); return true; }
    return false;
  };

  const addJob = async (data: any) => {
    const res = await db.createJobInDB(data);
    if(res) { setJobs(p => [res as Job, ...p]); toast.success("Vacante creada"); return true; }
    return false;
  };

  const addGroup = async (data: any) => {
    const res = await db.createGroupInDB(data);
    if(res) { setGroups(p => [res as Grupo, ...p]); toast.success("Grupo creado"); return true; }
    return false;
  };

  const handleToggleEvent = async (eventId: string | number, userId: string, isRegistering: boolean) => {
    const sId = String(eventId);
    if(await db.toggleEventRegistrationInDB(sId, userId, isRegistering)) {
      setEvents(prev => prev.map(e => String(e.id) === sId ? {
        ...e, 
        attendees: isRegistering ? e.attendees + 1 : e.attendees - 1,
        attendeeIds: isRegistering ? [...(e.attendeeIds||[]), userId] : (e.attendeeIds||[]).filter(id => id !== userId)
      } : e));
      toast.success(isRegistering ? "Inscrito" : "Inscripción anulada");
    }
  };

  const handleToggleJob = async (jobId: string | number, userId: string, isApplying: boolean) => {
    const sId = String(jobId);
    if(await db.toggleJobApplicationInDB(sId, userId, isApplying)) {
      setJobs(prev => prev.map(j => String(j.id) === sId ? {
        ...j, 
        applicants: isApplying ? j.applicants + 1 : j.applicants - 1,
        applicantIds: isApplying ? [...(j.applicantIds||[]), userId] : (j.applicantIds||[]).filter(id => id !== userId)
      } : j));
      toast.success(isApplying ? "Postulado" : "Postulación anulada");
    }
  };

  const handleToggleGroup = async (groupId: string | number, userId: string, isJoining: boolean) => {
    const sId = String(groupId);
    if(await db.toggleGroupMembershipInDB(sId, userId, isJoining)) {
      setGroups(prev => prev.map(g => String(g.id) === sId ? {
        ...g, 
        members: isJoining ? g.members + 1 : g.members - 1,
        memberIds: isJoining ? [...(g.memberIds||[]), userId] : (g.memberIds||[]).filter(id => id !== userId)
      } : g));
      toast.success(isJoining ? "Te uniste al grupo" : "Saliste del grupo");
    }
  };

  return { events, jobs, groups, resources, loading, addEvent, addJob, addGroup, handleToggleEvent, handleToggleJob, handleToggleGroup };
}