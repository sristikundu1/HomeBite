import IncidentHistory from '../components/status/IncidentHistory';
import MaintenanceSchedule from '../components/status/MaintenanceSchedule';
import ServiceStatus from '../components/status/ServiceStatus';
import StatusHero from '../components/status/StatusHero';
import SubscribeUpdates from '../components/status/SubscribeUpdates';
import SystemOverview from '../components/status/SystemOverview';

export default function Status() {
  return (
    <main className="relative overflow-x-hidden bg-[var(--bg-page)]">
      <StatusHero />
      <SystemOverview />
      <ServiceStatus />
      <IncidentHistory />
      <MaintenanceSchedule />
      <SubscribeUpdates />
    </main>
  );
}
