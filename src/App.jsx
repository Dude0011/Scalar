import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VoiceRecorder } from './components/VoiceRecorder';
import { RecentEntriesFeed } from './components/RecentEntriesFeed';
import { TallyTab } from './components/TallyTab';
import { InventoryTab } from './components/InventoryTab';
import { TrajectoryTab } from './components/TrajectoryTab';
import { HitLReviewCard } from './components/HitLReviewCard';
import { OnboardingModal } from './components/OnboardingModal';
import { catalogStore } from './services/catalogStore';
import { transcribeAudioBlob, executeScalarAgent, executeBaseline } from './services/aiEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState('LOG');
  const [mode, setMode] = useState('AGENT');
  const [ledger, setLedger] = useState([]);
  const [catalogItems, setCatalogItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hitlReview, setHitlReview] = useState(null);
  const [lastRunResult, setLastRunResult] = useState(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    setLedger([...catalogStore.ledgerHistory]);
    setCatalogItems([...catalogStore.items]);

    // Only open onboarding automatically if catalog has zero items
    if (catalogStore.items.length === 0) {
      setIsOnboardingOpen(true);
    }
  }, []);

  const handlePopulateMock = () => {
    catalogStore.populateMockData();
    setLedger([...catalogStore.ledgerHistory]);
    setCatalogItems([...catalogStore.items]);
    setIsOnboardingOpen(false);
  };

  const handleAddCustomItem = ({ name, price, stock, supplier }) => {
    const newItem = catalogStore.createNewItem(name, price, 'USD', stock, 50, supplier);
    setCatalogItems([...catalogStore.items]);
    return newItem;
  };

  const handleEditItem = (id, updates) => {
    catalogStore.editItem(id, updates);
    setCatalogItems([...catalogStore.items]);
  };

  const handleDeleteItem = (id) => {
    catalogStore.deleteItem(id);
    setCatalogItems([...catalogStore.items]);
  };

  const handleResetCatalog = () => {
    if (confirm('Reset store catalog memory and clear sales ledger?')) {
      catalogStore.resetStore();
      setLedger([]);
      setCatalogItems([...catalogStore.items]);
      setLastRunResult(null);
      setHitlReview(null);
      setIsOnboardingOpen(true);
    }
  };

  const handleDeleteEntry = (id) => {
    catalogStore.ledgerHistory = catalogStore.ledgerHistory.filter((i) => i.id !== id);
    catalogStore.saveLedger();
    setLedger([...catalogStore.ledgerHistory]);
  };

  const handleProcessTranscript = async (textInput, audioBlob) => {
    setIsProcessing(true);
    setLastRunResult(null);

    try {
      let transcript = textInput;

      if (audioBlob && !transcript) {
        transcript = await transcribeAudioBlob(audioBlob);
      }

      if (!transcript) {
        alert('Could not transcribe audio. Please try again.');
        setIsProcessing(false);
        return;
      }

      if (mode === 'BASELINE') {
        const result = await executeBaseline(transcript);
        setLastRunResult(result);

        catalogStore.addLedgerEntry({
          name: result.parsed.rawItemName,
          quantity: result.parsed.quantity,
          unitPrice: result.parsed.claimedUnitPrice,
          totalPrice: result.parsed.totalAmount,
          currency: 'USD',
          mode: 'BASELINE',
          status: 'COMMITTED_WITHOUT_MEMORY'
        });

        setLedger([...catalogStore.ledgerHistory]);
        setCatalogItems([...catalogStore.items]);
      } else {
        const result = await executeScalarAgent(transcript, catalogStore);
        setLastRunResult(result);

        if (
          result.decision.status === 'PRICE_DRIFT_FLAGGED' ||
          result.decision.status === 'NEW_ITEM_FLAGGED' ||
          result.decision.status === 'AMBIGUOUS_FLAGGED'
        ) {
          setHitlReview({ transcript, decision: result.decision });
        } else {
          commitAgentEntry(result.decision, 'AUTO_CONFIRMED');
        }
      }
    } catch (err) {
      alert(`Error processing transaction: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const commitAgentEntry = (decisionDetails, commitNote = 'AUTO') => {
    const isNew = decisionDetails.status === 'NEW_ITEM_FLAGGED';

    if (isNew) {
      catalogStore.createNewItem(decisionDetails.finalItemName, decisionDetails.unitPrice, 'USD');
    } else if (decisionDetails.catalogItem) {
      catalogStore.updateItemCatalog(
        decisionDetails.catalogItem.id,
        decisionDetails.unitPrice,
        decisionDetails.finalItemName,
        commitNote
      );
    }

    catalogStore.addLedgerEntry({
      name: decisionDetails.finalItemName,
      quantity: decisionDetails.quantity,
      unitPrice: decisionDetails.unitPrice,
      totalPrice: decisionDetails.quantity * decisionDetails.unitPrice,
      currency: 'USD',
      mode: 'AGENT',
      status: decisionDetails.status,
      isConsolidated: !isNew && Boolean(decisionDetails.catalogItem)
    });

    setLedger([...catalogStore.ledgerHistory]);
    setCatalogItems([...catalogStore.items]);
  };

  const handleResolveHitL = ({ action, item }) => {
    if (action === 'APPROVE' && item) {
      commitAgentEntry(
        {
          finalItemName: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          currency: 'USD',
          catalogItem: item.catalogItem,
          status: item.status
        },
        'USER_HITL_APPROVED'
      );
    }
    setHitlReview(null);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mode={mode}
        setMode={setMode}
        onResetCatalog={handleResetCatalog}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* Main Screen Container */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4">
        
        {/* LOG TAB (Home Screen) */}
        {activeTab === 'LOG' && (
          <>
            <VoiceRecorder
              onProcessTranscript={handleProcessTranscript}
              isProcessing={isProcessing}
              mode={mode}
            />

            <RecentEntriesFeed
              ledger={ledger}
              onDeleteEntry={handleDeleteEntry}
            />
          </>
        )}

        {/* TALLY TAB */}
        {activeTab === 'TALLY' && (
          <TallyTab
            ledger={ledger}
            catalogItems={catalogItems}
          />
        )}

        {/* INVENTORY TAB */}
        {activeTab === 'INVENTORY' && (
          <InventoryTab
            catalogItems={catalogItems}
            onAddItem={handleAddCustomItem}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
            onPopulateMock={handlePopulateMock}
            isProcessing={isProcessing}
            onProcessTranscript={handleProcessTranscript}
          />
        )}

        {/* TRAJECTORY TAB */}
        {activeTab === 'TRAJECTORY' && (
          <TrajectoryTab
            lastRunResult={lastRunResult}
            mode={mode}
          />
        )}
      </main>

      <footer className="py-3 text-center text-[11px] text-zinc-500 border-t border-zinc-900">
        Scalar • Voice-First Stateful Commerce Engine • micro1 Hackathon
      </footer>

      {/* HitL Review Card */}
      <HitLReviewCard
        reviewData={hitlReview}
        onResolveHitL={handleResolveHitL}
      />

      {/* Onboarding & Setup Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onPopulateMock={handlePopulateMock}
        onAddCustomItem={handleAddCustomItem}
        onFinish={() => {
          catalogStore.setOnboardingCompleted(true);
          setIsOnboardingOpen(false);
        }}
        itemCount={catalogItems.length}
      />
    </div>
  );
}
