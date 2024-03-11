import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { twJoin } from 'tailwind-merge';
import { IconOpenAccordion } from '../Icons/IconOpenAccordion';
import { type FAQ } from '../../lib/typings';
import { cn } from '../../lib/utilities';
import { Markdown } from './Markdown';

const APPEAR_VARIANTS = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 }
};

const buttonHoverCN = twJoin(
  'w-full flex justify-between rounded-t-[4px]',
  'transition-colors duration-200 bg-transparent',
  'hover:bg-foreground hover:bg-opacity-[0.019]',
  'active:bg-foreground active:bg-opacity-[0.031]'
);

export const FAQS = ({ faqs }: { faqs: FAQ[] }) => {
  const [faqsExpanded, setFaqsExpanded] = useState<boolean>(false);
  const [expandedQuestions, setExpandedQuestions] = useState<boolean[]>(
    faqs.map(() => false)
  );

  useEffect(() => {
    if (faqsExpanded) return;
    setExpandedQuestions(faqs.map(() => false));
  }, [faqsExpanded]);

  const toggleFaqs = useCallback(() => {
    setFaqsExpanded((prev) => !prev);
  }, []);

  const curriedExpandQuestion = useCallback(
    (index: number) => () => {
      setExpandedQuestions((prev) => {
        const next = [...prev];
        next[index] = !next[index];
        return next;
      });
    },
    []
  );

  return (
    <motion.div className="space-y-4 w-full">
      <button
        onClick={toggleFaqs}
        className={twJoin(
          'pl-[14px] pr-[18px] py-[10px] items-center',
          buttonHoverCN
        )}
      >
        <h2 className="font-medium text-base">FAQs</h2>
        <FaqsExpandIcon expanded={faqsExpanded} />
      </button>

      <AnimatePresence>
        {faqsExpanded && (
          <motion.div
            {...APPEAR_VARIANTS}
            className="w-full space-y-4 overflow-hidden"
          >
            {faqs.map((faq, i) => (
              <div key={i} className="w-full rounded-[4px] bg-foregroundA1">
                <button
                  onClick={curriedExpandQuestion(i)}
                  className={twJoin('py-2.5 px-4 items-start', buttonHoverCN)}
                >
                  <h3 className="text-base text-foreground/90 text-left font-medium leading-tight py-1.5 max-w-[calc(100%-2rem)]">
                    {faq.q}
                  </h3>
                  <FaqsExpandIcon
                    expanded={expandedQuestions[i]}
                    className="mt-0.5"
                  />
                </button>
                <AnimatePresence>
                  {expandedQuestions[i] && (
                    <motion.div
                      {...APPEAR_VARIANTS}
                      className="w-full text-sm overflow-hidden px-2 text-foreground/90"
                    >
                      {' '}
                      <Markdown children={faq.a} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

function FaqsExpandIcon({
  expanded,
  className
}: {
  expanded: boolean;
  className?: string;
}) {
  return (
    <IconOpenAccordion
      expanded={expanded}
      className={cn(
        twJoin(
          '[&>path]:fill-foreground',
          'w-6 min-w-6 h-6',
          'opacity-50 group-hover:opacity-80 group-active:opacity-100'
        ),
        className
      )}
    />
  );
}
