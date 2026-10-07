import { useEffect, useState } from 'react';
import { lookupRecipient } from '@/services/paymentService';
import { CARD_NUMBER_LENGTH } from '@/shared/lib/cardUtils';
import { getErrorKey } from '@/shared/lib/errors';

interface RecipientLookupState {
  name?: string;
  errorKey?: string;
  loading: boolean;
}

/** Ищет владельца карты, как только введены все цифры номера. */
export const useRecipientLookup = (cardDigits: string): RecipientLookupState => {
  const [state, setState] = useState<RecipientLookupState>({ loading: false });
  const isComplete = cardDigits.length === CARD_NUMBER_LENGTH;

  useEffect(() => {
    if (!isComplete) {
      setState({ loading: false });
      return;
    }

    let cancelled = false;
    setState({ loading: true });
    lookupRecipient(cardDigits)
      .then((name) => !cancelled && setState({ name, loading: false }))
      .catch((error: unknown) => !cancelled && setState({ errorKey: getErrorKey(error), loading: false }));

    return () => {
      cancelled = true;
    };
  }, [cardDigits, isComplete]);

  return state;
};
