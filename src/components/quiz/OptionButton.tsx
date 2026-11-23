import { m } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

interface OptionButtonProps {
  optionId: string;
  text: string;
  selected: boolean;
  answered: boolean;
  isCorrect: boolean;
  onClick: () => void;
}

export function OptionButton({
  optionId,
  text,
  selected,
  answered,
  isCorrect,
  onClick,
}: OptionButtonProps) {
  let containerClass = "bg-white border-slate-200 hover:border-slate-900 hover:shadow-neo-sm cursor-pointer";
  let labelClass = "bg-slate-100 text-slate-500 border-slate-200";
  let iconEl: React.ReactNode = null;

  if (answered) {
    if (isCorrect) {
      containerClass = "bg-emerald-50 border-emerald-900 shadow-neo-green cursor-default";
      labelClass = "bg-emerald-600 text-white border-emerald-700";
      iconEl = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
    } else if (selected && !isCorrect) {
      containerClass = "bg-rose-50 border-rose-900 cursor-default";
      labelClass = "bg-rose-600 text-white border-rose-700";
      iconEl = <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />;
    } else {
      containerClass = "bg-white border-slate-100 opacity-50 cursor-default";
    }
  } else if (selected) {
    containerClass = "bg-brand-yellow/10 border-brand-dark shadow-neo-sm cursor-pointer";
    labelClass = "bg-brand-dark text-brand-yellow border-brand-dark";
  }

  return (
    <m.button
      whileHover={!answered ? { y: -1 } : {}}
      whileTap={!answered ? { y: 1 } : {}}
      onClick={!answered ? onClick : undefined}
      role="radio"
      aria-checked={selected}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-150 ${containerClass}`}
    >
      <span
        className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center flex-shrink-0 uppercase border-2 ${labelClass}`}
      >
        {optionId}
      </span>
      <span className="text-sm text-slate-700 leading-relaxed flex-1">{text}</span>
      {iconEl}
    </m.button>
  );
}
