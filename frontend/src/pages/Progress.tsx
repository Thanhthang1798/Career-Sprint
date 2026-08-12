import { useMemo } from "react";
import { useAppContext, getLevelInfo } from "../context/AppContext";
import { Card, CardContent } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import type { Skill } from "../types";
import { TrendingUp, Clock, Zap, Trophy, Flame } from "lucide-react";

const skillColors: Record<Skill, string> = {
  "English": "bg-blue-500",
  "System Design": "bg-emerald-500",
  "AI / Agentic AI": "bg-purple-500",
};

export default function Progress() {
  const { state } = useAppContext();
  const levelInfo = getLevelInfo(state.xp, state.levelUnlocked);

  const stats = useMemo(() => {
    let totalTasks = 0;
    let completedTasks = 0;
    let totalMinutes = 0;
    let completedMinutes = 0;

    const skillStats: Record<Skill, { total: number; completed: number }> = {
      "English": { total: 0, completed: 0 },
      "System Design": { total: 0, completed: 0 },
      "AI / Agentic AI": { total: 0, completed: 0 },
    };

    state.days.forEach(day => {
      day.tasks.forEach(task => {
        totalTasks++;
        totalMinutes += task.estimatedMinutes;
        skillStats[task.skill].total++;

        if (task.status === "completed") {
          completedTasks++;
          completedMinutes += task.estimatedMinutes;
          skillStats[task.skill].completed++;
        }
      });
    });

    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const completedHours = Math.round(completedMinutes / 60);

    const skills = Object.entries(skillStats).map(([skill, data]) => ({
      name: skill as Skill,
      progress: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
    }));

    const sortedSkills = [...skills].sort((a, b) => b.progress - a.progress);
    const strongestSkill = sortedSkills[0];
    const weakestSkill = sortedSkills[sortedSkills.length - 1];

    return { totalTasks, completedTasks, overallProgress, completedHours, skillStats, strongestSkill, weakestSkill };
  }, [state.days]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">

      <div className="flex items-center gap-3 border-b border-slate-200 pb-6">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Progress</h1>
          <p className="text-slate-500 text-sm font-medium">Track your overall journey and skill development.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none shadow-md">
          <CardContent className="p-5 flex flex-col gap-2">
            <span className="text-indigo-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Trophy className="w-4 h-4" /> Level</span>
            <span className="text-3xl font-black">{String(levelInfo.level).padStart(2, '0')}</span>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5 flex flex-col gap-2">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500" /> Total XP</span>
            <span className="text-3xl font-black text-slate-800">{state.xp}</span>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5 flex flex-col gap-2">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Flame className="w-4 h-4 text-orange-500" /> Streak</span>
            <span className="text-3xl font-black text-slate-800">{state.streak}</span>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-5 flex flex-col gap-2">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500" /> Time</span>
            <span className="text-3xl font-black text-slate-800">{stats.completedHours}h</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Overall Completion</h3>
            <div className="flex justify-between items-end mb-2">
              <span className="text-4xl font-black text-slate-900">{stats.overallProgress}%</span>
              <span className="text-sm font-bold text-slate-500 mb-1">{stats.completedTasks} / {stats.totalTasks} Tasks</span>
            </div>
            <ProgressBar progress={stats.overallProgress} className="h-3 bg-slate-100" indicatorClassName="bg-indigo-600" />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="bg-emerald-50 border-emerald-100 shadow-sm flex-1">
            <CardContent className="p-5">
              <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Strongest Skill</h3>
              <p className="text-xl font-black text-emerald-900">{stats.strongestSkill.name} <span className="text-emerald-700 ml-1">— {stats.strongestSkill.progress}%</span></p>
            </CardContent>
          </Card>
          <Card className="bg-rose-50 border-rose-100 shadow-sm flex-1">
            <CardContent className="p-5">
              <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">Needs Attention</h3>
              <p className="text-xl font-black text-rose-900">{stats.weakestSkill.name} <span className="text-rose-700 ml-1">— {stats.weakestSkill.progress}%</span></p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="bg-white border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Skill Breakdown</h3>
          <div className="space-y-6">
            {(Object.entries(stats.skillStats) as [Skill, { total: number; completed: number }][]).map(([skill, data]) => {
              const progress = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
              return (
                <div key={skill}>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-slate-800">{skill}</span>
                    <span className="text-slate-500">{progress}%</span>
                  </div>
                  <ProgressBar progress={progress} indicatorClassName={skillColors[skill]} className="bg-slate-100" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
