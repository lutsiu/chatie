import { useSidePanelStore } from '../../store/useSidePanelStore';
import EditProfileView from './Settings/EditProfileView';
import SettingsView from './Settings/SettingsView';

export default function SidePanel() {
  const panel = useSidePanelStore(s => s.panel);
  const back  = useSidePanelStore(s => s.back);
  const close = useSidePanelStore(s => s.close);

  if (panel === 'none') return null;

  // This div covers the sidebar column (assumes sidebar is 28rem wide)
  return (
    <div className="absolute left-0 top-0 w-[28rem] h-full bg-zinc-900">
      {panel === 'settings'    && <SettingsView onBack={back} onClose={close} />}
      {panel === 'editProfile' && <EditProfileView onBack={back} />}
    </div>
  );
}
