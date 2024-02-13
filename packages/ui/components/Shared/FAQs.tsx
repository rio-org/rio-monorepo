import Markdown from 'react-markdown';
import { type FAQ } from '../../lib/typings';
import { useState } from 'react';
import { IconOpenAccordion } from '../Icons/IconOpenAccordion';
import { AnimatePresence, motion } from 'framer-motion';
import { twJoin } from 'tailwind-merge';

export const FAQS = ({ faqs }: { faqs: FAQ[] }) => {
  const [sectionExpanded, setSectionExpanded] = useState<boolean>(false);
  const [expandedQuestions, setExpandedQuestions] = useState<boolean[]>(
    faqs.map(() => false)
  );
  return (
    <motion.div className="space-y-4 w-full">
      <div className="w-full flex items-center justify-between pl-[14px] pr-[18px] py-[10px]">
        <h2 className="font-medium text-base">FAQs</h2>
        <button
          onClick={() => setSectionExpanded((prev) => !prev)}
          className={twJoin(
            'w-6 min-w-6 h-6',
            'opacity-50 hover:opacity-80 focus:opacity-80 active:opacity-100'
          )}
        >
          <IconOpenAccordion
            className="[&>path]:fill-black"
            expanded={sectionExpanded}
          />
        </button>
      </div>

      <AnimatePresence>
        {sectionExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full space-y-4 overflow-hidden"
          >
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="w-full py-2.5 px-4 rounded-xl bg-[var(--color-element-wrapper-bg)]"
              >
                <div className="flex justify-between items-start w-full">
                  <h3 className="text-[14px] font-medium leading-tight py-1.5 max-w-[calc(100%-2rem)]">
                    {faq.q}
                  </h3>
                  <button
                    onClick={() =>
                      setExpandedQuestions((prev) => {
                        const next = [...prev];
                        next[i] = !next[i];
                        return next;
                      })
                    }
                    className={twJoin(
                      'w-6 min-w-6 h-6',
                      'opacity-50 hover:opacity-80 focus:opacity-80 active:opacity-100'
                    )}
                  >
                    <IconOpenAccordion
                      className="[&>path]:fill-black"
                      expanded={sectionExpanded}
                    />
                  </button>
                </div>
                <AnimatePresence>
                  {sectionExpanded && expandedQuestions[i] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{
                        opacity: 1,
                        height: 'auto',
                        marginTop: 10
                      }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="w-full text-sm overflow-hidden"
                    >
                      <Markdown>{faq.a}</Markdown>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
