import React, { useMemo } from "react";
import { useStore } from "../StoreContext";
import { toEasternArabicNumerals } from "../utils";

export const ConsistencyView: React.FC = () => {
    const { state } = useStore();
    const completedSet = new Set(state.completedReflections);
    
    const { monthDays, currentMonthName, completedCount } = useMemo(() => {
        const today = new Date();
        today.setHours(0,0,0,0);

        const getHijriInfo = (d: Date) => {
            const enFormatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', { day: 'numeric', month: 'numeric', year: 'numeric' });
            const arFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { month: 'long' });
            const enParts = enFormatter.formatToParts(d);
            
            const dayText = enParts.find(p => p.type === 'day')?.value || '1';
            const monthText = enParts.find(p => p.type === 'month')?.value || '1';
            const yearText = enParts.find(p => p.type === 'year')?.value || '1';
            
            const day = parseInt(dayText, 10);
            const monthId = `${yearText}-${monthText}`;
            const arMonthName = arFormatter.formatToParts(d).find(p => p.type === 'month')?.value || '';
            
            return { day, monthId, arMonthName };
        };

        const currentInfo = getHijriInfo(today);
        
        // Find start of current Hijri month
        let startOfMonth = new Date(today);
        startOfMonth.setDate(startOfMonth.getDate() - (currentInfo.day - 1));
        
        // Failsafe: if the calculation is off due to calendar differences, step backward/forward
        while(getHijriInfo(startOfMonth).monthId !== currentInfo.monthId) {
             startOfMonth.setDate(startOfMonth.getDate() + 1);
        }
        let testPrev = new Date(startOfMonth);
        testPrev.setDate(testPrev.getDate() - 1);
        while(getHijriInfo(testPrev).monthId === currentInfo.monthId) {
             startOfMonth.setDate(startOfMonth.getDate() - 1);
             testPrev.setDate(testPrev.getDate() - 1);
        }

        const mDays = [];
        let cCount = 0;

        for (let i = 0; i < 30; i++) {
            const d = new Date(startOfMonth);
            d.setDate(d.getDate() + i);
            
            const info = getHijriInfo(d);
            if (info.monthId !== currentInfo.monthId) break; 
            
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            const isCompleted = completedSet.has(dateStr);
            if (isCompleted) cCount++;
            
            mDays.push({
                dateStr,
                hijriDay: info.day,
                isToday: d.getTime() === today.getTime(),
                isCompleted
            });
        }

        return { monthDays: mDays, currentMonthName: currentInfo.arMonthName, completedCount: cCount };
    }, [completedSet]);

    return (
        <div className="p-6 min-h-full overflow-y-auto pb-24 flex flex-col max-w-md mx-auto w-full">
            <div className="text-center mb-8 px-4 mt-6">
                <h3 className="text-2xl font-bold mb-3">سجل المداومة</h3>
                <p className="text-brand-textSecondary dark:text-brand-dark-textSecondary text-sm leading-relaxed max-w-[240px] mx-auto">
                    هذه صفحتُك مع نفسك… لا سِباقَ مع أحد
                </p>
            </div>

            <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center bg-brand-surface dark:bg-brand-dark-surface border border-brand-textPrimary/10 px-6 py-3 rounded-full shadow-sm">
                    <p className="text-[15px] font-medium text-brand-textPrimary dark:text-brand-dark-textPrimary">
                        أتممتَ <span className="font-bold text-brand-primary">{toEasternArabicNumerals(completedCount)}</span> يومًا من {currentMonthName}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-y-4 gap-x-2 bg-brand-background dark:bg-brand-dark-background/50 p-6 rounded-[2rem] border border-brand-textPrimary/5 text-center mt-2" dir="rtl">
                {monthDays.map((dayObj, i) => {
                    return (
                        <div 
                           key={dayObj.dateStr} 
                           className={`aspect-square w-10 h-10 mx-auto rounded-full flex items-center justify-center text-[15px] font-sans transition-all duration-300
                               ${dayObj.isCompleted 
                                 ? 'bg-brand-success text-white shadow-sm font-bold' 
                                 : 'bg-brand-surface dark:bg-brand-dark-surface text-brand-textSecondary border shadow-sm'} 
                               ${dayObj.isToday ? 'ring-2 ring-offset-2 ring-offset-brand-background dark:ring-offset-[#1E1E1E] ring-amber-400' : 'border-brand-textPrimary/5'}`}
                        >
                            {toEasternArabicNumerals(dayObj.hijriDay)}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
