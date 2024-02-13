import Markdown from 'react-markdown';
import { type FAQ } from '../../lib/typings';
import { useCallback, useEffect, useState } from 'react';
import { IconOpenAccordion } from '../Icons/IconOpenAccordion';
import { AnimatePresence, motion } from 'framer-motion';
import { twJoin } from 'tailwind-merge';
import { cn } from '../../lib/utilities';
import IconExternal from '../Icons/IconExternal';

const APPEAR_VARIANTS = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 }
};

const buttonHoverCN = twJoin(
  'w-full flex justify-between rounded-xl',
  'transition-colors duration-200',
  'bg-transparent hover:bg-[#00000008] active:bg-[#00000010]'
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
    <motion.div className="space-y-4 w-full px-4">
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
              <div
                key={i}
                className="w-full rounded-xl bg-[var(--color-element-wrapper-bg)]"
              >
                <button
                  onClick={curriedExpandQuestion(i)}
                  className={twJoin('py-2.5 px-4 items-start', buttonHoverCN)}
                >
                  <h3 className="text-[14px] font-medium leading-tight py-1.5 max-w-[calc(100%-2rem)]">
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
                      className="w-full text-sm overflow-hidden px-4"
                    >
                      <Markdown
                        className="py-2.5 space-y-2 font-sans text-sm"
                        components={{
                          h1({ className, ...rest }) {
                            return (
                              <h2
                                className={cn(className, 'font-bold text-2xl')}
                                {...rest}
                              />
                            );
                          },
                          h2({ className, ...rest }) {
                            return (
                              <h3
                                className={cn(className, 'font-bold text-xl')}
                                {...rest}
                              />
                            );
                          },
                          h3({ className, ...rest }) {
                            return (
                              <h4
                                className={cn(className, 'font-bold text-lg')}
                                {...rest}
                              />
                            );
                          },
                          h4({ className, ...rest }) {
                            return (
                              <h4
                                className={cn(
                                  className,
                                  'font-bold text-[inherit]'
                                )}
                                {...rest}
                              />
                            );
                          },
                          h5({ className, ...rest }) {
                            return (
                              <h4
                                className={cn(
                                  className,
                                  'font-bold text-[inherit]'
                                )}
                                {...rest}
                              />
                            );
                          },
                          ul({ children, className, ...rest }) {
                            return (
                              <ul
                                className={cn(
                                  className,
                                  'list-disc list-inside'
                                )}
                                {...rest}
                              >
                                {children}
                              </ul>
                            );
                          },
                          a({ children, className, href, ...rest }) {
                            delete rest.target;
                            delete rest.rel;
                            return (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  className,
                                  'font-semibold hover:underline'
                                )}
                                {...rest}
                              >
                                <span>{children}</span>
                                <IconExternal className="inline mx-1 w-[10px] h-[10px] [&>path]:stroke-2 -translate-y-0.5" />
                              </a>
                            );
                          }
                        }}
                      >
                        {faq.a}
                      </Markdown>
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
          '[&>path]:fill-black',
          'w-6 min-w-6 h-6',
          'opacity-50 group-hover:opacity-80 group-active:opacity-100'
        ),
        className
      )}
    />
  );
}
