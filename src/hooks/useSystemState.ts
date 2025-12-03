// src/hooks/useSystemState.ts

import { useState, useEffect } from 'react';
import { Evento, Job, Grupo, Recurso } from '../lib/types';
import { 
  createEventInDB, 
  createJobInDB,
  createGroupInDB, 
  getEventsFromDB, 
  getJobsFromDB,
  getGroupsFromDB, 
  getResourcesFromDB 
} from '../lib/db-service';
import { toast } from 'sonner';

export function useSystemState() {
  const [events, setEvents] = useState<Evento[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [groups, setGroups] = useState<Grupo[]>([]);
  const [resources, setResources] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos al iniciar
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [fetchedEvents, fetchedJobs, fetchedGroups, fetchedResources] = await Promise.all([
          getEventsFromDB(),
          getJobsFromDB(),
          getGroupsFromDB(),
          getResourcesFromDB()
        ]);
        
        setEvents(fetchedEvents);
        setJobs(fetchedJobs);
        setGroups(fetchedGroups);
        setResources(fetchedResources);
        
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Error de conexión con la base de datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- FUNCIÓN CORREGIDA: addEvent ---
  const addEvent = async (newEventData: any) => {
    try {
      // 1. Guardar en base de datos y obtener el objeto creado (con ID)
      const savedEvent = await createEventInDB(newEventData);
      
      // 2. Actualizar estado local (agregarlo al principio de la lista)
      setEvents(prev => [savedEvent as Evento, ...prev]); 
      
      return true;
    } catch (error) {
      console.error(error);
      toast.error("No se pudo guardar el evento");
      return false;
    }
  };

  const addJob = async (newJobData: any) => {
    try {
      const savedJob = await createJobInDB(newJobData);
      setJobs(prev => [savedJob as Job, ...prev]);
      return true;
    } catch (error) {
      toast.error("No se pudo publicar la vacante");
      return false;
    }
  };
  
  const addGroup = async (newGroupData: any) => {
    try {
      const savedGroup = await createGroupInDB(newGroupData);
      setGroups(prev => [savedGroup as Grupo, ...prev]); 
      return true;
    } catch (error) {
      toast.error("No se pudo crear el grupo");
      return false;
    }
  };

  return {
    events,
    jobs,
    groups,
    resources,
    addEvent,
    addJob,
    addGroup,
    loading
  };
}