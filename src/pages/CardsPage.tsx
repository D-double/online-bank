import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CreditCard, Lock, Star, Trash2, Unlock } from 'lucide-react';
import { CardView, useCardsStore, type Card } from '@/entities/card';
import { ADD_CARD_PARAM, ADD_CARD_PATH, AddCardFlow, AddCardTile } from '@/features/add-card';
import { useBalanceVisibility } from '@/features/balance-toggle';
import { BottomSheet, Button, ButtonLink, ConfirmSheet, EmptyState, PageHeader } from '@/shared/ui';

const CardActions = ({ card, onDelete }: { card: Card; onDelete: () => void }) => {
  const { t } = useTranslation();
  const setMainCard = useCardsStore((state) => state.setMainCard);
  const toggleBlocked = useCardsStore((state) => state.toggleBlocked);

  return (
    <div className="mt-3 grid grid-cols-3 gap-2">
      <Button variant="secondary" size="sm" disabled={card.isMain} onClick={() => setMainCard(card.id)}>
        <Star className="size-4" /> {t('cards.makeMain')}
      </Button>
      <Button variant="secondary" size="sm" onClick={() => toggleBlocked(card.id)}>
        {card.isBlocked ? <Unlock className="size-4" /> : <Lock className="size-4" />}
        {t(card.isBlocked ? 'cards.unblock' : 'cards.block')}
      </Button>
      <Button variant="danger" size="sm" onClick={onDelete}>
        <Trash2 className="size-4" /> {t('common.delete')}
      </Button>
    </div>
  );
};

export const CardsPage = () => {
  const { t } = useTranslation();
  const cards = useCardsStore((state) => state.cards);
  const removeCard = useCardsStore((state) => state.removeCard);
  const hideBalance = useBalanceVisibility((state) => state.hidden);
  const [searchParams, setSearchParams] = useSearchParams();
  const [cardToDelete, setCardToDelete] = useState<Card>();

  const isAddOpen = searchParams.has(ADD_CARD_PARAM);
  const closeAdd = () => setSearchParams({}, { replace: true });

  return (
    <>
      <PageHeader title={t('cards.title')} />

      {cards.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title={t('cards.empty')}
          action={<ButtonLink to={ADD_CARD_PATH}>{t('cards.add')}</ButtonLink>}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {cards.map((card) => (
            <div key={card.id}>
              <CardView card={card} hideBalance={hideBalance} />
              <CardActions card={card} onDelete={() => setCardToDelete(card)} />
            </div>
          ))}
          <AddCardTile />
        </div>
      )}

      <BottomSheet open={isAddOpen} title={t('addCard.title')} onClose={closeAdd}>
        <AddCardFlow onSuccess={closeAdd} />
      </BottomSheet>

      <ConfirmSheet
        open={Boolean(cardToDelete)}
        title={t('cards.deleteTitle')}
        message={t('cards.deleteMessage', { number: cardToDelete?.number.slice(-4) })}
        confirmLabel={t('common.delete')}
        onConfirm={() => cardToDelete && removeCard(cardToDelete.id)}
        onClose={() => setCardToDelete(undefined)}
      />
    </>
  );
};
