import { useTranslations } from "next-intl";
import { FiAward, FiUsers, FiTarget, FiBookOpen } from "react-icons/fi";
import { motion, useInView, useReducedMotion, useMotionValue, animate } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useLocale } from "next-intl";
import CarouselInfinitePause from "../ui/CarrouselInfinitePause";

/* ================= COUNTER ================= */
function Counter({ value = 0, prefix = "", suffix = "+", duration = 1.2 }) {
  const locale = useLocale();
  const ref = useRef(null);
  const isIn = useInView(ref, { margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const [out, setOut] = useState("0");

  useEffect(() => {
    if (!isIn) return;
    const controls = animate(mv, value, {
      duration: reduce ? 0.4 : duration,
      ease: reduce ? "linear" : "easeOut",
      onUpdate: (latest) => {
        const num = Math.round(latest);
        setOut(`${prefix}${new Intl.NumberFormat(locale).format(num)}${suffix}`);
      },
    });
    return controls.stop;
  }, [isIn, value, prefix, suffix, duration, reduce, mv, locale]);

  return (
    <span
      ref={ref}
      className="tabular-nums font-bold"
      aria-live="polite"
      aria-atomic="true"
    >
      {out}
    </span>
  );
}

/* ================= MAIN COMPONENT ================= */
export default function StatsCorporate() {
  const t = useTranslations("home");
  const statsRaw = t.raw("stats");

  const stats = [
    { ...statsRaw.yearsInBusiness, icon: FiAward },
    { ...statsRaw.corporatePartners, icon: FiUsers },
    { ...statsRaw.corporateStudents, icon: FiTarget },
    { ...statsRaw.privateStudents, icon: FiBookOpen },
  ];

  return (
    <section className="py-16 lg:py-20 bg-white text-gray-900">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ====== STATS GRID ====== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-gradient-to-br from-[#EE7203] to-[#FF3816] flex items-center justify-center">
                <stat.icon className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                <Counter value={Number(stat.value)} suffix="+" />
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ====== CAROUSEL FIXED CONTAINER ====== */}
        <div className="hidden sm:block mt-16 relative block isolate w-full max-w-6xl mx-auto overflow-hidden">
  <div className="h-[90px] sm:h-[110px] flex items-center justify-center">
    <CarouselInfinitePause />
  </div>
</div>

      </div>
    </section>
  );
}
