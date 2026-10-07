import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  back?: boolean;
}

/** На мобильных — градиентная панель на всю ширину, на десктопе — обычный заголовок. */
export const PageHeader = ({ title, back = false }: PageHeaderProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 -mx-4 -mt-5 mb-5 grid grid-cols-[2.5rem_1fr_2.5rem] items-center gap-2 bg-brand-gradient px-4 pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-3 text-white shadow-lg shadow-brand-500/20 lg:static lg:mx-0 lg:mt-0 lg:flex lg:gap-3 lg:bg-none lg:p-0 lg:text-fg lg:shadow-none">
      {back && (
        <button
          onClick={() => navigate(-1)}
          className="grid size-10 place-items-center rounded-full bg-white/15 transition-colors hover:bg-white/25 lg:bg-surface lg:shadow-sm lg:hover:bg-surface-muted"
          aria-label={t('common.back')}
        >
          <ChevronLeft className="size-5" />
        </button>
      )}
      <h1 className="col-start-2 truncate text-center text-lg font-semibold lg:flex-1 lg:text-left lg:text-2xl lg:font-bold">
        {title}
      </h1>
    </header>
  );
};
