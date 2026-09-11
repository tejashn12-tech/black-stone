import React, { useState, useMemo } from 'react';
import { INITIAL_EXERCISES, EXERCISE_CATEGORIES, TARGET_MUSCLE_GROUPS, TargetMuscleGroup } from '../../data/exercisesData';
import { Exercise } from '../../types';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import {
  Search,
  Filter,
  Dumbbell,
  Flame,
  Layers,
  Sparkles,
  ChevronRight,
  BookOpen,
  Activity,
  Target,
  Shield,
  Maximize,
  Zap,
  RotateCw,
  Compass,
  TrendingUp,
  Workflow,
  Crosshair,
  Grid,
  ListFilter,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Play,
  Film
} from 'lucide-react';

const MUSCLE_ICONS: Record<string, any> = {
  chest: Shield,
  back: Layers,
  shoulders: Maximize,
  biceps: Zap,
  triceps: Activity,
  forearms: Crosshair,
  quads: Flame,
  hamstrings: Target,
  glutes: Compass,
  calves: TrendingUp,
  legs: Workflow,
  abs: Shield,
  obliques: RotateCw,
  lower_back: Layers,
  full_body: Sparkles,
  upper_body: Activity,
  lower_body: Activity
};

export const ExerciseLibrary: React.FC = () => {
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('all');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  
  // View mode: 'grid' or 'muscle_groups'
  const [viewMode, setViewMode] = useState<'grid' | 'grouped'>('grid');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 24;

  // Filtered exercises
  const filteredExercises = useMemo(() => {
    return INITIAL_EXERCISES.filter(ex => {
      // Muscle filter
      if (selectedMuscle !== 'all' && ex.targetMuscleKey !== selectedMuscle) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && ex.category !== selectedCategory) {
        return false;
      }
      // Difficulty check
      if (difficultyFilter !== 'all' && ex.difficulty !== difficultyFilter) {
        return false;
      }
      // Equipment check
      if (equipmentFilter !== 'all' && ex.equipment !== equipmentFilter) {
        return false;
      }
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = ex.name.toLowerCase().includes(q);
        const matchesId = ex.id.toLowerCase().includes(q);
        const matchesMuscle = (ex.targetMuscle || '').toLowerCase().includes(q) ||
                              ex.targetMuscles.some(m => m.toLowerCase().includes(q));
        const matchesSecondary = ex.secondaryMuscles.some(m => m.toLowerCase().includes(q));
        const matchesEquipment = ex.equipment.toLowerCase().includes(q);
        const matchesCategory = ex.categoryDisplay.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesMuscle && !matchesSecondary && !matchesEquipment && !matchesCategory) {
          return false;
        }
      }
      return true;
    });
  }, [selectedMuscle, selectedCategory, searchQuery, difficultyFilter, equipmentFilter]);

  // Reset page to 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedMuscle, selectedCategory, searchQuery, difficultyFilter, equipmentFilter, viewMode]);

  // Paginated items for grid view
  const totalPages = Math.ceil(filteredExercises.length / itemsPerPage) || 1;
  const paginatedExercises = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredExercises.slice(start, start + itemsPerPage);
  }, [filteredExercises, currentPage, itemsPerPage]);

  // Grouped by target muscle
  const exercisesByMuscle = useMemo(() => {
    const groups: Record<string, { group: TargetMuscleGroup; list: Exercise[] }> = {};
    
    TARGET_MUSCLE_GROUPS.filter(g => g.id !== 'all').forEach(g => {
      groups[g.id] = { group: g, list: [] };
    });

    filteredExercises.forEach(ex => {
      const key = ex.targetMuscleKey || 'chest';
      if (groups[key]) {
        groups[key].list.push(ex);
      } else {
        // Fallback
        if (!groups['other']) {
          groups['other'] = {
            group: { id: 'other', name: ex.targetMuscle || 'Other', count: 0, category: 'Other' },
            list: []
          };
        }
        groups['other'].list.push(ex);
      }
    });

    return Object.values(groups).filter(g => g.list.length > 0);
  }, [filteredExercises]);

  // Get count for a specific muscle group
  const getMuscleCount = (muscleId: string) => {
    if (muscleId === 'all') return INITIAL_EXERCISES.length;
    return INITIAL_EXERCISES.filter(e => e.targetMuscleKey === muscleId).length;
  };

  return (
    <div className="w-full space-y-8" id="bsf-exercise-library-section">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-orange-500 text-black font-mono">
              1,000 EXERCISES &amp; GIF GUIDES
            </span>
            <span className="text-xs text-zinc-400 font-medium">Divided by Target Muscle Biomechanics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight mt-2">
            EXERCISES
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl font-sans-body">
            Explore 1,000 movements with animated GIF guides, divided by primary target muscle groups, execution biomechanics, equipment variations, and coach checkpoints.
          </p>
        </div>

        <div className="flex items-center gap-4 text-right">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <span className="font-display font-black text-3xl text-orange-400 block">{filteredExercises.length}</span>
            <span className="text-[11px] text-zinc-400 font-mono">Filtered Movements</span>
          </div>
        </div>
      </div>

      {/* Primary Navigation: Target Muscle Groups */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-orange-400" /> Filter By Target Muscle Group
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">16 Dedicated Muscle Categories</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedMuscle('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 shrink-0 ${
              selectedMuscle === 'all'
                ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20 font-extrabold'
                : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Muscles</span>
            <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-mono ${selectedMuscle === 'all' ? 'bg-black text-orange-400 font-bold' : 'bg-zinc-800 text-zinc-400'}`}>
              1,000
            </span>
          </button>

          {TARGET_MUSCLE_GROUPS.filter(m => m.id !== 'all').map(muscle => {
            const isSelected = selectedMuscle === muscle.id;
            const Icon = MUSCLE_ICONS[muscle.id] || Target;
            const count = getMuscleCount(muscle.id);

            return (
              <button
                key={muscle.id}
                onClick={() => setSelectedMuscle(muscle.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/20 font-extrabold'
                    : 'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{muscle.name}</span>
                <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-mono ${isSelected ? 'bg-black text-orange-400 font-bold' : 'bg-zinc-800 text-zinc-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Category Pills */}
      <div className="flex items-center justify-between gap-4 flex-wrap pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs text-zinc-500 font-bold mr-1">Category:</span>
          {EXERCISE_CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-zinc-100 text-black font-bold'
                    : 'bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              viewMode === 'grid'
                ? 'bg-orange-500 text-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>

          <button
            onClick={() => setViewMode('grouped')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              viewMode === 'grouped'
                ? 'bg-orange-500 text-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>By Muscle Group</span>
          </button>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search all 1,000 exercises by name, code (e.g., EX-0042), muscle, equipment..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-500 focus:border-orange-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Difficulty Filter */}
        <div className="sm:col-span-3">
          <select
            value={difficultyFilter}
            onChange={e => setDifficultyFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 text-xs focus:border-orange-500 focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Equipment Filter */}
        <div className="sm:col-span-3">
          <select
            value={equipmentFilter}
            onChange={e => setEquipmentFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 text-xs focus:border-orange-500 focus:outline-none"
          >
            <option value="all">All Equipment Types</option>
            <option value="Barbell">Barbell</option>
            <option value="Dumbbell">Dumbbell</option>
            <option value="Cable">Cable Pulleys</option>
            <option value="Bodyweight">Bodyweight</option>
            <option value="Kettlebell">Kettlebell</option>
            <option value="Resistance Band">Resistance Band</option>
          </select>
        </div>
      </div>

      {/* Active Filter summary */}
      {(selectedMuscle !== 'all' || selectedCategory !== 'all' || searchQuery || difficultyFilter !== 'all' || equipmentFilter !== 'all') && (
        <div className="flex items-center justify-between p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-zinc-400 font-semibold">Active Filters:</span>
            {selectedMuscle !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/40 font-mono text-[11px]">
                Muscle: {selectedMuscle}
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[11px]">
                Category: {selectedCategory}
              </span>
            )}
            {difficultyFilter !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[11px]">
                Difficulty: {difficultyFilter}
              </span>
            )}
            {equipmentFilter !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[11px]">
                Equipment: {equipmentFilter}
              </span>
            )}
            {searchQuery && (
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-[11px]">
                Search: "{searchQuery}"
              </span>
            )}
          </div>

          <button
            onClick={() => {
              setSelectedMuscle('all');
              setSelectedCategory('all');
              setSearchQuery('');
              setDifficultyFilter('all');
              setEquipmentFilter('all');
            }}
            className="text-orange-400 hover:text-orange-300 font-bold ml-2 shrink-0"
          >
            Reset All
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {filteredExercises.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/40 border border-dashed border-zinc-800 rounded-3xl p-8">
          <BookOpen className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No exercises match your search criteria</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or reset your target muscle and equipment filters.
          </p>
          <button
            onClick={() => {
              setSelectedMuscle('all');
              setSelectedCategory('all');
              setSearchQuery('');
              setDifficultyFilter('all');
              setEquipmentFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-orange-500 text-black text-xs font-bold rounded-xl hover:bg-orange-400 transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* STANDARD PAGINATED GRID VIEW */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {paginatedExercises.map(exercise => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                onSelect={() => setActiveExercise(exercise)}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl">
              <span className="text-xs text-zinc-400 font-mono">
                Showing <strong className="text-white">{(currentPage - 1) * itemsPerPage + 1}</strong> –{' '}
                <strong className="text-white">
                  {Math.min(currentPage * itemsPerPage, filteredExercises.length)}
                </strong>{' '}
                of <strong className="text-orange-400">{filteredExercises.length}</strong> movements
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-300">
                  Page <strong className="text-orange-400">{currentPage}</strong> / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 transition"
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* GROUPED BY TARGET MUSCLE VIEW */
        <div className="space-y-10">
          {exercisesByMuscle.map(({ group, list }) => {
            const Icon = MUSCLE_ICONS[group.id] || Target;
            return (
              <div key={group.id} className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white font-display uppercase tracking-wide">
                        {group.name}
                      </h2>
                      <span className="text-xs text-zinc-400">
                        {list.length} Targeted Biomechanical Variations
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedMuscle(group.id);
                      setViewMode('grid');
                    }}
                    className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1"
                  >
                    <span>View All In Grid</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {list.slice(0, 8).map(exercise => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      onSelect={() => setActiveExercise(exercise)}
                    />
                  ))}
                </div>

                {list.length > 8 && (
                  <div className="text-center pt-2">
                    <button
                      onClick={() => {
                        setSelectedMuscle(group.id);
                        setViewMode('grid');
                      }}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-bold transition inline-flex items-center gap-2"
                    >
                      <span>Show All {list.length} {group.name} Exercises</span>
                      <ChevronRight className="w-3.5 h-3.5 text-orange-400" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Modal */}
      <ExerciseDetailModal
        exercise={activeExercise}
        onClose={() => setActiveExercise(null)}
      />

    </div>
  );
};

// Reusable Exercise Card Component
interface ExerciseCardProps {
  exercise: Exercise;
  onSelect: () => void;
}

// Resilient GIF Viewer for cards
const ExerciseCardGif: React.FC<{ exercise: Exercise }> = ({ exercise }) => {
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Generate candidate mirror URLs
  const sources = useMemo(() => {
    const list: string[] = [];
    if (exercise.mirrorGifUrl) {
      list.push(exercise.mirrorGifUrl);
      list.push(exercise.mirrorGifUrl.replace('cdn.jsdelivr.net', 'fastly.jsdelivr.net'));
      list.push(exercise.mirrorGifUrl.replace('https://cdn.jsdelivr.net/gh/', 'https://raw.githubusercontent.com/').replace('@main', '/main'));
    }
    if (exercise.imageUrl && exercise.imageUrl !== exercise.mirrorGifUrl) {
      list.push(exercise.imageUrl);
    }
    if (exercise.gifUrl) {
      list.push(exercise.gifUrl);
    }
    return list;
  }, [exercise.mirrorGifUrl, exercise.imageUrl, exercise.gifUrl]);

  const currentUrl = sources[currentSourceIndex] || exercise.gifUrl;

  const handleError = () => {
    if (currentSourceIndex + 1 < sources.length) {
      setCurrentSourceIndex(prev => prev + 1);
    } else {
      setIsError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (!currentUrl || isError) {
    return (
      <div className="w-full h-full p-4 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center relative select-none">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-2">
          <Dumbbell className="w-6 h-6 animate-pulse" />
        </div>
        <span className="text-[11px] font-bold text-zinc-300 text-center font-mono line-clamp-1">
          {exercise.id} • {exercise.targetMuscle}
        </span>
        <div className="flex items-center gap-1 text-[10px] text-zinc-500 mt-1 font-mono">
          <Film className="w-3 h-3 text-orange-400" />
          <span>Biomechanical Form Guide</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-zinc-950 flex items-center justify-center overflow-hidden">
      {/* Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
            <span className="text-[10px] text-zinc-400 font-mono">Loading GIF...</span>
          </div>
        </div>
      )}

      <img
        src={currentUrl}
        alt={exercise.name}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className="group bg-zinc-900/90 border border-zinc-800/90 hover:border-orange-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 flex flex-col justify-between"
    >
      {/* GIF / Animated Visual Representation */}
      <div className="relative h-44 bg-zinc-950 border-b border-zinc-800/80 overflow-hidden flex items-center justify-center">
        <ExerciseCardGif exercise={exercise} />

        {/* Overlay Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none z-20">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-orange-400 border border-orange-500/30 backdrop-blur-sm">
            {exercise.id}
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border backdrop-blur-sm ${
            exercise.difficulty === 'Beginner'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
              : exercise.difficulty === 'Intermediate'
              ? 'bg-orange-950/90 text-orange-300 border-orange-500/40'
              : 'bg-rose-950/90 text-rose-300 border-rose-500/40'
          }`}>
            {exercise.difficulty}
          </span>
        </div>

        {/* Target Muscle Tag bottom overlay */}
        <div className="absolute bottom-2 left-2.5 pointer-events-none z-20">
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-500 text-black font-sans shadow-md">
            {exercise.targetMuscle || exercise.targetMuscles[0]}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1 font-mono">
            <span>{exercise.categoryDisplay}</span>
            <span>{exercise.equipment}</span>
          </div>

          <h3 className="font-bold text-white text-base group-hover:text-orange-400 transition leading-snug line-clamp-2">
            {exercise.name}
          </h3>

          {/* Secondary Synergist Muscles */}
          <div className="mt-2 flex flex-wrap gap-1">
            {exercise.secondaryMuscles.slice(0, 2).map((m, idx) => (
              <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                +{m}
              </span>
            ))}
          </div>
        </div>

        {/* View Detailed Form Guide CTA */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-orange-400 group-hover:text-orange-300">
          <span className="flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 fill-orange-400" />
            <span>Form &amp; GIF Guide</span>
          </span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </div>
      </div>
    </div>
  );
};
