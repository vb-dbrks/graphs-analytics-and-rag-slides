import { PresentationShell } from '@/presentation/PresentationShell';
import { SlideRenderer } from '@/presentation/SlideRenderer';
import { SlideViewport } from '@/presentation/SlideViewport';
import { NavigationControls } from '@/components/ui/NavigationControls';
import { ProgressIndicator, SlideCounter } from '@/components/ui/ProgressIndicator';
import { PresenterNotesPanel } from '@/components/ui/PresenterNotesPanel';
import { TopBar } from '@/components/ui/TopBar';
import { slides } from '@/presentation/slides/slideConfigs';

export default function App() {
  return (
    <PresentationShell total={slides.length}>
      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <ProgressIndicator />
        <TopBar />
        <SlideViewport>
          <SlideRenderer slides={slides} />
        </SlideViewport>
        <SlideCounter />
        <NavigationControls />
        <PresenterNotesPanel slides={slides} />
      </div>
    </PresentationShell>
  );
}
