// --- CÓDIGO CORREGIDO: useSystemState.ts ---

import { useState, useEffect } from 'react';
import { Evento, Job, Grupo, Recurso } from '../lib/types'; // Importa todos los tipos
import { 
  createEventInDB, 
  createJobInDB, 
  getEventsFromDB, 
  getJobsFromDB,
  getGroupsFromDB, // Importa la nueva función
  getResourcesFromDB // Importa la nueva función
} from '../lib/db-service';
import { toast } from 'sonner';

/**
 * Este es el "cerebro" de la demo.
 * Carga todos los datos de Firebase una vez y los mantiene en el estado de React.
 * Proporciona funciones para agregar nuevos datos (eventos, trabajos).
 */
export function useSystemState() {
  const [events, setEvents] = useState<Evento[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [groups, setGroups] = useState<Grupo[]>([]); // Añadido
  const [resources, setResources] = useState<Recurso[]>([]); // Añadido
  const [loading, setLoading] = useState(true);

  // Cargar datos reales desde Firebase al iniciar la app
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Pedimos todos los datos a la vez para eficiencia
        const [
          fetchedEvents, 
          fetchedJobs,
          fetchedGroups,
          fetchedResources
        ] = await Promise.all([
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
  }, []); // El array vacío [] asegura que esto solo se ejecute una vez

  // Función para que la Universidad/Empresa cree un evento
  const addEvent = async (newEventData: any) => {
    try {
      const savedEvent = await createEventInDB(newEventData);
      // Actualiza el estado local para que se vea el cambio al instante
      setEvents(prev => [savedEvent as Evento, ...prev]); 
      return true;
    } catch (error) {
      toast.error("No se pudo guardar el evento");
      return false;
    }
  };

  // Función para que la Empresa cree una vacante
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

  return {
    events,
    jobs,
    groups,     // Retorna los grupos
    resources,  // Retorna los recursos
    addEvent,
    addJob,
    loading
  };
}