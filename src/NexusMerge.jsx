import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Zap, Users, Box, AlertTriangle, CheckCircle, Hammer } from 'lucide-react';

// --- KONSTANTA & DATA ---
const SHAPES = ['SQUARE', 'CIRCLE', 'TRIANGLE'];
const TEAMS = [
    { id: 'A', name: 'Tim Alpha', color: 'bg-blue-100 border-blue-500 text-blue-900' },
    { id: 'B', name: 'Tim Beta', color: 'bg-purple-100 border-purple-500 text-purple-900' },
    { id: 'C', name: 'Tim Gamma', color: 'bg-orange-100 border-orange-500 text-orange-900' }
];

const INITIAL_TIME = 60; // Detik

// Helper untuk mendapatkan bentuk acak
const getRandomShape = () => SHAPES[Math.floor(Math.random() * SHAPES.length)];

const NexusMerge = () => {
    // --- STATE ---
    const [gameState, setGameState] = useState('MENU'); // MENU, PLAYING, GAMEOVER
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
    const [score, setScore] = useState(0);
    const [conflicts, setConflicts] = useState(0);

    // Inventory Tim (Backlog)
    const [teamBacklogs, setTeamBacklogs] = useState({});

    // Zona Integrasi (Linked List Array)
    const [integratedModules, setIntegratedModules] = useState([]);

    // Action Cards (Mana/Points untuk fix)
    const [actionPoints, setActionPoints] = useState(3);

    // Dragging State
    const [draggedItem, setDraggedItem] = useState(null);

    // Notifikasi
    const [message, setMessage] = useState("Siap untuk Sprint Planning?");

    // --- GAME LOOP & TIMER ---
    useEffect(() => {
        let interval;
        if (gameState === 'PLAYING' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && gameState === 'PLAYING') {
            setGameState('GAMEOVER');
            let finalBonus = integratedModules.every(m => !m.hasConflict) ? 50 : 0;
            setMessage(`Waktu Habis! Skor Akhir: ${score + finalBonus}`);
        }
        return () => clearInterval(interval);
    }, [gameState, timeLeft, integratedModules, score]);

    // --- LOGIC ---

    const generateBacklog = () => {
        const backlogs = {};
        TEAMS.forEach(team => {
            backlogs[team.id] = Array.from({ length: 4 }).map((_, i) => ({
                id: `${team.id}-${Date.now()}-${i}`,
                teamId: team.id,
                leftShape: getRandomShape(),
                rightShape: getRandomShape(),
                featureName: `Feat-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${i + 1}`
            }));
        });
        setTeamBacklogs(backlogs);
    };

    const startGame = () => {
        setGameState('PLAYING');
        setTimeLeft(INITIAL_TIME);
        setScore(0);
        setConflicts(0);
        setIntegratedModules([]);
        setActionPoints(5); // Modal awal Action Points
        generateBacklog();
        setMessage("Sprint Dimulai! Gabungkan modul ke Zona Integrasi.");
    };

    // --- DRAG & DROP HANDLERS ---

    const handleDragStart = (e, item, source) => {
        setDraggedItem({ item, source }); // source: 'backlog'
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDropOnIntegration = (e) => {
        e.preventDefault();
        if (!draggedItem) return;

        const { item, source } = draggedItem;

        if (source === 'backlog') {
            // Pindahkan dari backlog ke integrasi

            // 1. Cek Konflik dengan modul terakhir di integrasi SEBELUM update state
            const lastModule = integratedModules[integratedModules.length - 1];
            let hasConflict = false;
            let currentMoveScore = 0;

            if (lastModule) {
                if (lastModule.rightShape !== item.leftShape) {
                    hasConflict = true;
                    setConflicts(prev => prev + 1);
                    setMessage("⚠ KONFLIK TERDETEKSI! Interface tidak cocok.");
                } else if (lastModule.hasConflict) {
                    // Tidak bisa nambah jika modul sebelumnya masih rusak
                    setMessage("⛔ Tidak bisa integrasi! Fix konflik sebelumnya dulu.");
                    setDraggedItem(null);
                    return; // Batal drop
                } else {
                    setMessage("✅ Integrasi Sukses!");
                    currentMoveScore = 10;
                    setScore(prev => prev + 10);
                    // Tambah action point setiap 3 sukses
                    if ((score + 10) % 30 === 0) setActionPoints(prev => prev + 1);
                }
            } else {
                setMessage("Modul pertama terpasang (Base).");
                currentMoveScore = 5;
                setScore(prev => prev + 5);
            }

            // 2. Update Backlog (Hapus Item)
            const newBacklogs = { ...teamBacklogs };
            newBacklogs[item.teamId] = newBacklogs[item.teamId].filter(i => i.id !== item.id);
            setTeamBacklogs(newBacklogs);

            // 3. Tambah ke array integrasi
            const newIntegratedModules = [...integratedModules, { ...item, hasConflict }];
            setIntegratedModules(newIntegratedModules);

            // --- WIN CONDITION CHECK ---
            // Cek apakah semua backlog kosong
            const isAllEmpty = Object.values(newBacklogs).every(items => items.length === 0);

            if (isAllEmpty) {
                setGameState('GAMEOVER');

                // Hitung Bonus Bersih (Clean Run)
                // Kita pakai newIntegratedModules karena state integratedModules belum update di siklus ini
                const isCleanRun = newIntegratedModules.every(m => !m.hasConflict);
                const finalBonus = isCleanRun ? 50 : 0;

                // Total score = Score saat ini + Score langkah ini + Bonus
                // Note: 'score' state belum terupdate di sini, jadi kita hitung manual
                const totalFinalScore = score + currentMoveScore + finalBonus;

                setMessage(`🎉 SEMUA SELESAI! Skor Akhir: ${totalFinalScore}`);
            }
        }

        setDraggedItem(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Wajib biar bisa drop
    };

    // --- ACTION CARDS LOGIC ---

    const fixConflict = (index) => {
        if (actionPoints <= 0) {
            setMessage("❌ Action Points (AP) Habis!");
            return;
        }

        const moduleToFix = integratedModules[index];
        const prevModule = integratedModules[index - 1];

        if (!prevModule) return; // Tidak bisa fix yang pertama (karena dia base)

        // Logika Refactor: Ubah 'Left Shape' modul ini agar sama dengan 'Right Shape' modul sebelumnya
        const newModules = [...integratedModules];
        newModules[index] = {
            ...moduleToFix,
            leftShape: prevModule.rightShape,
            hasConflict: false
        };

        setIntegratedModules(newModules);
        setActionPoints(prev => prev - 1);
        setMessage("🛠 Refactoring Selesai! Konflik teratasi.");
    };

    const rerollModule = (teamId) => {
        if (actionPoints <= 0) {
            setMessage("❌ Action Points (AP) Habis!");
            return;
        }

        // Refresh backlog untuk satu tim
        const newBacklogs = { ...teamBacklogs };
        if(newBacklogs[teamId].length === 0) return;

        newBacklogs[teamId] = newBacklogs[teamId].map(item => ({
            ...item,
            leftShape: getRandomShape(),
            rightShape: getRandomShape()
        }));

        setTeamBacklogs(newBacklogs);
        setActionPoints(prev => prev - 1);
        setMessage("🔄 Sprint Planning Ulang: Item tim di-refresh.");
    }


    // --- RENDER HELPER ---

    const getShapeIcon = (shape) => {
        switch (shape) {
            case 'SQUARE': return <div className="w-3 h-3 bg-gray-800" title="Square Interface"></div>;
            case 'CIRCLE': return <div className="w-3 h-3 bg-gray-800 rounded-full" title="Circle Interface"></div>;
            case 'TRIANGLE': return <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[12px] border-b-gray-800" title="Triangle Interface"></div>;
            default: return null;
        }
    };

    // --- MAIN RENDER ---

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 font-sans select-none">
            <div className="max-w-4xl mx-auto">

                {/* HEADER */}
                <div className="flex flex-col lg:flex-row justify-between items-center mb-4 lg:mb-6 bg-slate-800 p-3 lg:p-4 rounded-lg border border-slate-700 shadow-lg gap-3 lg:gap-0">
                    <div className="text-center lg:text-left">
                        <h1 className="text-xl lg:text-2xl font-bold text-green-400 flex items-center gap-2 justify-center lg:justify-start">
                            <Zap className="fill-green-400" size={20} /> Nexus Merge
                        </h1>
                        <p className="text-slate-400 text-xs lg:text-sm">Role: Nexus Integration Team (NIT)</p>
                    </div>

                    <div className="flex gap-2 lg:gap-6 text-center flex-wrap justify-center">
                        <div className="bg-slate-900 px-3 lg:px-4 py-2 rounded border border-slate-700">
                            <div className="text-xs text-slate-400 uppercase">Waktu</div>
                            <div className={`text-lg lg:text-xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                {timeLeft}s
                            </div>
                        </div>
                        <div className="bg-slate-900 px-3 lg:px-4 py-2 rounded border border-slate-700">
                            <div className="text-xs text-slate-400 uppercase">Score</div>
                            <div className="text-lg lg:text-xl font-mono font-bold text-yellow-400">{score}</div>
                        </div>
                        <div className="bg-slate-900 px-3 lg:px-4 py-2 rounded border border-slate-700">
                            <div className="text-xs text-slate-400 uppercase">Action Cards</div>
                            <div className="text-lg lg:text-xl font-mono font-bold text-blue-400 flex items-center justify-center gap-1">
                                {actionPoints} <span className="text-xs">AP</span>
                            </div>
                        </div>
                    </div>

                    {gameState !== 'PLAYING' && (
                        <button
                            onClick={startGame}
                            className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 lg:px-6 rounded flex items-center gap-2 transition-all text-sm lg:text-base w-full lg:w-auto justify-center"
                        >
                            {gameState === 'GAMEOVER' ? <RotateCcw size={18}/> : <Play size={18}/>}
                            {gameState === 'GAMEOVER' ? 'Main Lagi' : 'Mulai Sprint'}
                        </button>
                    )}
                </div>

                {/* GAME AREA */}
                {gameState === 'PLAYING' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">

                        {/* LEFT: INTEGRATION ZONE (MAIN BOARD) */}
                        <div className="lg:col-span-3 flex flex-col gap-3 lg:gap-4">

                            {/* NOTIFICATION BAR */}
                            <div className="bg-slate-800/50 py-2 px-3 lg:px-4 rounded text-center text-xs lg:text-sm font-medium border border-slate-700 min-h-[40px] flex items-center justify-center">
                                {message}
                            </div>

                            {/* DROP ZONE */}
                            <div
                                className="bg-slate-800 rounded-xl border-2 border-dashed border-slate-600 min-h-[150px] lg:min-h-[200px] p-3 lg:p-4 flex flex-wrap items-center content-start gap-1 relative overflow-x-auto overflow-y-hidden transition-colors duration-200"
                                onDragOver={handleDragOver}
                                onDrop={handleDropOnIntegration}
                                style={{ borderColor: draggedItem ? '#4ade80' : '#475569' }}
                            >
                                <div className="absolute top-2 left-2 text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-wider pointer-events-none">
                                    ZONA INTEGRASI (Drop Disini)
                                </div>

                                {integratedModules.length === 0 && (
                                    <div className="w-full h-full flex items-center justify-center text-slate-600 italic pointer-events-none absolute inset-0">
                                        Tarik modul tim kesini untuk integrasi...
                                    </div>
                                )}

                                {integratedModules.map((mod, idx) => (
                                    <div key={mod.id} className="flex items-center animate-in fade-in zoom-in duration-300">
                                        {/* MODULE CARD */}
                                        <div className={`
                                relative w-20 h-16 lg:w-24 lg:h-20 rounded-lg border-2 flex flex-col items-center justify-center shadow-lg
                                ${mod.hasConflict
                                            ? 'bg-red-900/80 border-red-500'
                                            : 'bg-green-900/40 border-green-500'}
                            `}>
                                            <div className="text-[9px] lg:text-[10px] text-slate-300 mb-1">{mod.featureName}</div>
                                            <div className="flex items-center justify-between w-full px-1 lg:px-2">
                                                {/* Left Connector */}
                                                <div className="bg-slate-200 p-1 rounded-sm shadow-sm">
                                                    {getShapeIcon(mod.leftShape)}
                                                </div>

                                                {/* Center Icon */}
                                                {mod.hasConflict ? (
                                                    <AlertTriangle size={14} className="text-red-500 animate-bounce lg:w-4 lg:h-4" />
                                                ) : (
                                                    <CheckCircle size={14} className="text-green-500 lg:w-4 lg:h-4" />
                                                )}

                                                {/* Right Connector */}
                                                <div className="bg-slate-200 p-1 rounded-sm shadow-sm">
                                                    {getShapeIcon(mod.rightShape)}
                                                </div>
                                            </div>

                                            {/* ACTION BUTTON IF CONFLICT */}
                                            {mod.hasConflict && (
                                                <button
                                                    onClick={() => fixConflict(idx)}
                                                    className="absolute -bottom-2 lg:-bottom-3 bg-blue-500 hover:bg-blue-400 text-white text-[10px] lg:text-xs px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full shadow-md flex items-center gap-1 scale-90 hover:scale-100 transition-transform"
                                                    title="Gunakan 1 AP untuk Refactor"
                                                >
                                                    <Hammer size={8} className="lg:w-[10px] lg:h-[10px]" /> Fix
                                                </button>
                                            )}
                                        </div>

                                        {/* CONNECTOR LINE */}
                                        {idx < integratedModules.length - 1 && (
                                            <div className="w-2 lg:w-4 h-1 bg-slate-600"></div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* TEAM AREAS (SOURCES) */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                                {TEAMS.map(team => (
                                    <div key={team.id} className={`${team.color} bg-opacity-10 border border-opacity-20 rounded-lg p-2 lg:p-3`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold text-xs lg:text-sm opacity-90">{team.name}</h3>
                                            <button
                                                onClick={() => rerollModule(team.id)}
                                                className="text-[9px] lg:text-[10px] bg-black/20 hover:bg-black/40 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded text-current whitespace-nowrap"
                                                title="Reroll (Cost 1 AP)"
                                            >
                                                Reshuffle (1 AP)
                                            </button>
                                        </div>

                                        <div className="space-y-1.5 lg:space-y-2 min-h-[80px] lg:min-h-[100px]">
                                            {teamBacklogs[team.id]?.length === 0 && (
                                                <p className="text-xs opacity-50 text-center py-2 lg:py-4">Done!</p>
                                            )}
                                            {teamBacklogs[team.id]?.map(item => (
                                                <div
                                                    key={item.id}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, item, 'backlog')}
                                                    className="bg-white/90 hover:bg-white text-slate-900 p-1.5 lg:p-2 rounded cursor-grab active:cursor-grabbing shadow-sm flex justify-between items-center group transition-transform hover:-translate-y-1"
                                                >
                                                    <div className="bg-slate-200 p-[2px] rounded">{getShapeIcon(item.leftShape)}</div>
                                                    <span className="text-[10px] lg:text-xs font-mono font-bold">{item.featureName}</span>
                                                    <div className="bg-slate-200 p-[2px] rounded">{getShapeIcon(item.rightShape)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* RIGHT: SIDEBAR / INFO */}
                        <div className="lg:col-span-1 bg-slate-800 rounded-xl p-3 lg:p-4 border border-slate-700 h-fit">
                            <h3 className="text-base lg:text-lg font-bold text-slate-200 mb-3 lg:mb-4 flex items-center gap-2">
                                <Users size={16} className="lg:w-[18px] lg:h-[18px]" /> Nexus Team
                            </h3>

                            <div className="space-y-3 lg:space-y-4 text-xs lg:text-sm text-slate-400">
                                <p className="leading-relaxed">
                                    <strong className="text-green-400">Tugas Anda:</strong> Pastikan modul dari berbagai tim terhubung dengan benar.
                                </p>

                                <div className="bg-slate-900 p-2 lg:p-3 rounded border border-slate-700">
                                    <strong className="text-white block mb-1.5 lg:mb-2 text-xs lg:text-sm">Panduan Integrasi:</strong>
                                    <div className="flex items-center gap-1.5 lg:gap-2 mb-1 text-[11px] lg:text-xs">
                                        <div className="w-4 h-4 bg-slate-200 rounded flex items-center justify-center"><div className="w-2 h-2 bg-gray-800 rounded-full"></div></div>
                                        <span>Lingkaran = API</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 lg:gap-2 mb-1 text-[11px] lg:text-xs">
                                        <div className="w-4 h-4 bg-slate-200 rounded flex items-center justify-center"><div className="w-2 h-2 bg-gray-800"></div></div>
                                        <span>Kotak = Database</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 lg:gap-2 text-[11px] lg:text-xs">
                                        <div className="w-4 h-4 bg-slate-200 rounded flex items-center justify-center"><div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-gray-800"></div></div>
                                        <span>Segitiga = UI</span>
                                    </div>
                                </div>

                                <div className="bg-slate-900 p-2 lg:p-3 rounded border border-slate-700">
                                    <strong className="text-white block mb-1.5 lg:mb-2 text-xs lg:text-sm">Action Cards:</strong>
                                    <ul className="list-disc pl-3 lg:pl-4 space-y-1 text-[11px] lg:text-xs">
                                        <li><span className="text-blue-400">Fix (Refactor)</span>: Mengubah konektor modul yang error agar cocok. (Biaya: 1 AP)</li>
                                        <li><span className="text-blue-400">Reshuffle</span>: Mengacak ulang item tim jika macet. (Biaya: 1 AP)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    /* START / GAME OVER SCREEN */
                    <div className="flex flex-col items-center justify-center min-h-[300px] lg:h-96 bg-slate-800 rounded-xl border border-slate-700 text-center p-4 lg:p-8">
                        {gameState === 'GAMEOVER' ? (
                            <>
                                <h2 className="text-2xl lg:text-4xl font-bold text-white mb-2">Sprint Review</h2>
                                <div className="text-4xl lg:text-6xl font-bold text-yellow-400 mb-4 lg:mb-6">
                                    {/* Parse skor dari pesan atau tampilkan yang ada di state jika belum update */}
                                    {message.includes("Skor Akhir") ? message.split(": ")[1] : score}
                                </div>
                                <p className="text-slate-400 max-w-md mb-6 lg:mb-8 text-sm lg:text-base px-4">
                                    {message.includes("SEMUA SELESAI")
                                        ? "Kerja Bagus! Semua backlog berhasil diintegrasikan. Nexus Integration Team sukses besar!"
                                        : "Waktu habis! Koordinasi antar tim perlu ditingkatkan di Retro berikutnya."}
                                </p>
                                <div className="flex gap-3 lg:gap-4 text-xs lg:text-sm text-slate-500">
                                    <div>Konflik: {conflicts}</div>
                                    <div>Modul Terintegrasi: {integratedModules.length}</div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Box size={48} className="text-green-400 mb-4 lg:mb-6 lg:w-16 lg:h-16" />
                                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 lg:mb-4">Nexus Integration Tim</h2>
                                <p className="text-slate-400 max-w-md mb-6 lg:mb-8 text-sm lg:text-base px-4">
                                    Anda adalah <strong>Nexus Integration Team</strong>.
                                    <br/>
                                    Gabungkan pekerjaan 3 Tim Scrum. Pastikan "Konektor" (Interface) mereka cocok satu sama lain.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 text-left text-xs lg:text-sm text-slate-400 bg-slate-900 p-3 lg:p-4 rounded mb-6 lg:mb-8 w-full max-w-2xl">
                                    <div className="text-center sm:text-left">
                                        <span className="block text-white font-bold mb-1">1. Drag</span>
                                        Tarik modul dari tim
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <span className="block text-white font-bold mb-1">2. Match</span>
                                        Cocokkan bentuk konektor
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <span className="block text-white font-bold mb-1">3. Fix</span>
                                        Gunakan AP untuk refactor
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default NexusMerge;