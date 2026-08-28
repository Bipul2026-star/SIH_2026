import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { ScreenType, FarmerSubmission } from '../types';
import {
  ArrowLeft,
  Shield,
  Activity,
  Send,
  CheckCircle,
  X,
  Users,
  TrendingUp,
} from 'lucide-react';
import { speechService } from '../services/speechService';

interface KvkDashboardScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

const INITIAL_SUBMISSIONS: FarmerSubmission[] = [
  {
    id: 'sub_101',
    farmerName: 'Subhas Chandra Mondal',
    phone: '+91 98321 45012',
    village: 'Rampur',
    block: 'Burdwan-I',
    district: 'Purba Bardhaman',
    crop: 'Rice / Paddy',
    cropKey: 'cropRice',
    issue: 'Rice Blast (Leaf Blight)',
    issueKey: 'diseaseRiceBlast',
    severity: 'high',
    date: '24 Aug 2026',
    timeAgo: '12m ago',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%232e7d32"/><path d="M120 40 Q200 150 220 280 Q250 150 160 40 Z" fill="%234caf50"/><ellipse cx="185" cy="130" rx="35" ry="18" fill="%23795548" stroke="%233e2723" stroke-width="3"/><ellipse cx="185" cy="130" rx="20" ry="8" fill="%23d7ccc8"/><ellipse cx="160" cy="190" rx="25" ry="12" fill="%23795548"/><text x="200" y="270" fill="%23ffffff" font-size="16" text-anchor="middle" font-family="sans-serif" font-weight="bold">🌾 Rice Blast (ধান ব্লাস্ট)</text></svg>',
    confidence: 94,
    status: 'pending',
  },
  {
    id: 'sub_102',
    farmerName: 'Anil Kumar Roy',
    phone: '+91 94340 88219',
    village: 'Sonapur',
    block: 'Krishnanagar',
    district: 'Nadia',
    crop: 'Mustard',
    cropKey: 'cropRice',
    issue: 'Aphid Cluster Attack',
    issueKey: 'pestArmyworm',
    severity: 'medium',
    date: '24 Aug 2026',
    timeAgo: '35m ago',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%231b5e20"/><path d="M100 280 Q180 120 280 40 Q230 180 150 280 Z" fill="%2366bb6a"/><circle cx="170" cy="120" r="18" fill="%231b5e20"/><circle cx="205" cy="150" r="14" fill="%231b5e20"/><ellipse cx="185" cy="140" rx="22" ry="7" fill="%23ffb300" stroke="%23e65100" stroke-width="2"/><text x="200" y="270" fill="%23ffffff" font-size="16" text-anchor="middle" font-family="sans-serif" font-weight="bold">🐛 Aphid Cluster</text></svg>',
    confidence: 88,
    status: 'pending',
  },
  {
    id: 'sub_103',
    farmerName: 'Bidhan Sarkar',
    phone: '+91 97335 11904',
    village: 'Balughat',
    block: 'Kalna-II',
    district: 'Purba Bardhaman',
    crop: 'Tomato',
    cropKey: 'cropTomato',
    issue: 'Early Blight Spread',
    issueKey: 'diseaseTomatoBlight',
    severity: 'high',
    date: '24 Aug 2026',
    timeAgo: '1h ago',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%2333691e"/><path d="M80 150 Q160 50 320 150 Q160 250 80 150 Z" fill="%237cb342"/><circle cx="160" cy="130" r="28" fill="%235d4037"/><circle cx="160" cy="130" r="20" fill="%238d6e63"/><text x="200" y="270" fill="%23ffffff" font-size="16" text-anchor="middle" font-family="sans-serif" font-weight="bold">🍅 Tomato Blight</text></svg>',
    confidence: 82,
    status: 'verified',
  },
  {
    id: 'sub_104',
    farmerName: 'Tapan Debnath',
    phone: '+91 96472 33190',
    village: 'Nutangram',
    block: 'Katwa-I',
    district: 'Purba Bardhaman',
    crop: 'Rice / Paddy',
    cropKey: 'cropRice',
    issue: 'Nitrogen Deficiency',
    issueKey: 'healthyPaddy',
    severity: 'medium',
    date: '24 Aug 2026',
    timeAgo: '2h ago',
    imageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23004d40"/><path d="M120 280 Q180 80 220 20 Q240 100 200 280 Z" fill="%2326a69a"/><text x="200" y="270" fill="%23ffffff" font-size="16" text-anchor="middle" font-family="sans-serif" font-weight="bold">🌱 Nutrient Deficiency</text></svg>',
    confidence: 79,
    status: 'advisory_sent',
  },
];

export const KvkDashboardScreen: React.FC<KvkDashboardScreenProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [submissions, setSubmissions] = useState<FarmerSubmission[]>(INITIAL_SUBMISSIONS);
  const [selectedSub, setSelectedSub] = useState<FarmerSubmission | null>(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTargetBlock, setBroadcastTargetBlock] = useState('Burdwan-I');
  const [broadcastCrop, setBroadcastCrop] = useState('Rice / Paddy');
  const [broadcastText, setBroadcastText] = useState(
    'High humidity and cloudy skies favor Rice Blast in Burdwan-I. Inspect leaf undersides and spray Tricyclazole 75 WP (0.6g/L).'
  );
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleVerify = (subId: string) => {
    speechService.playChime('success');
    setSubmissions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, status: 'verified' } : s))
    );
    if (selectedSub && selectedSub.id === subId) {
      setSelectedSub({ ...selectedSub, status: 'verified' });
    }
  };

  const handleSendAdvisory = (subId: string) => {
    speechService.playChime('success');
    setSubmissions((prev) =>
      prev.map((s) => (s.id === subId ? { ...s, status: 'advisory_sent' } : s))
    );
    if (selectedSub && selectedSub.id === subId) {
      setSelectedSub({ ...selectedSub, status: 'advisory_sent' });
    }
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    speechService.playChime('success');
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setShowBroadcastModal(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F3ECDA] text-[#20261F] flex flex-col justify-between selection:bg-[#52B788] selection:text-[#173C2D]">
      {/* KVK Top Bar */}
      <header className="bg-[#173C2D] text-white border-b border-[#2B6E4F] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                speechService.playChime('click');
                onNavigate('gateway');
              }}
              className="touch-target px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('homeNavBack', '← Home')}</span>
            </button>

            <div>
              <div className="font-heading font-bold text-base sm:text-lg flex items-center gap-2">
                <span>{t('kvkHeaderTitle', 'Crop Rakshak — District Dashboard')}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#E38A1C] text-white text-[10px] font-mono font-bold">
                  {t('officerBadge', 'OFFICER')}
                </span>
              </div>
              <p className="text-xs text-[#BFE0CB] font-medium">
                {t('kvkHeaderSub', 'Krishi Vigyan Kendra, West Bengal Circle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-2xl text-xs">
              <Shield className="w-4 h-4 text-[#52B788]" />
              <div>
                <div className="font-bold text-white leading-tight">{t('kvkOfficerName', 'Dr. R. Sen')}</div>
                <div className="text-[10px] text-[#BFE0CB]">{t('kvkOfficerRole', 'Enquiry & Advisory Officer')}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                speechService.playChime('click');
                onNavigate('home');
              }}
              className="px-3.5 py-2 rounded-xl bg-[#52B788] hover:bg-[#74C69D] text-[#173C2D] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <span>{t('kvkFarmerPortalLink', 'Farmer Portal →')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
        {/* Top Stat Row (3-4 Responsive KPI Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E1D9C4] shadow-sm hover:shadow-agri transition-shadow">
            <div className="flex items-center justify-between text-xs text-[#4C5548] font-medium">
              <span>{t('kvkScansThisWeek', 'Scans This Week')}</span>
              <Activity className="w-4 h-4 text-[#2B6E4F]" />
            </div>
            <div className="font-heading font-extrabold text-2xl sm:text-3xl text-[#173C2D] mt-1.5">
              1,204
            </div>
            <div className="text-[11px] text-[#2B6E4F] font-bold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t('kvkTrendPlus', '+18% from last week')}</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E1D9C4] shadow-sm hover:shadow-agri transition-shadow">
            <div className="flex items-center justify-between text-xs text-[#4C5548] font-medium">
              <span>{t('kvkHighAlertBlocks', 'High Alert Blocks')}</span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#E38A1C] animate-pulse" />
            </div>
            <div className="font-heading font-extrabold text-2xl sm:text-3xl text-[#E38A1C] mt-1.5">
              {t('kvkThreeBlocks', '3 Blocks')}
            </div>
            <div className="text-[11px] text-[#8A5A34] font-medium mt-1">
              {t('kvkBlockNames', 'Burdwan-I, Kalna-II, Nadia')}
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E1D9C4] shadow-sm hover:shadow-agri transition-shadow">
            <div className="flex items-center justify-between text-xs text-[#4C5548] font-medium">
              <span>{t('kvkAdvisoryReadRate', 'Advisory Read Rate')}</span>
              <Users className="w-4 h-4 text-[#2B6E4F]" />
            </div>
            <div className="font-heading font-extrabold text-2xl sm:text-3xl text-[#173C2D] mt-1.5">
              96.4%
            </div>
            <div className="text-[11px] text-[#2B6E4F] font-semibold mt-1">
              {t('kvkViaSms', 'Via SMS & WhatsApp Mitra')}
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E1D9C4] shadow-sm hover:shadow-agri transition-shadow">
            <div className="flex items-center justify-between text-xs text-[#4C5548] font-medium">
              <span>{t('kvkVerifiedSubmissions', 'Verified Submissions')}</span>
              <CheckCircle className="w-4 h-4 text-[#2B6E4F]" />
            </div>
            <div className="font-heading font-extrabold text-2xl sm:text-3xl text-[#173C2D] mt-1.5">
              842 / 910
            </div>
            <div className="text-[11px] text-[#4C5548] font-medium mt-1">
              {t('kvkResolutionRate', '92.5% resolution rate')}
            </div>
          </div>
        </div>

        {/* 2-Column Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 Cols wide on Desktop): Regional Outbreak Heatmap & Risk Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Panel: Regional Outbreak Map */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E1D9C4] shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-heading font-bold text-lg text-[#173C2D]">
                    {t('kvkOutbreakMapTitle', 'Regional Outbreak Map (Risk Heatmap)')}
                  </h3>
                  <p className="text-xs text-[#4C5548]">
                    {t('kvkOutbreakMapSub', 'Aggregated signal from 1,200+ leaf scans plotted across block circles')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(true)}
                  className="px-4 py-2 rounded-2xl bg-[#E38A1C] hover:bg-[#C26F0E] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>{t('kvkBroadcastBtn', 'Broadcast Regional Advisory')}</span>
                </button>
              </div>

              {/* Heatmap Visual Canvas / Representation */}
              <div className="relative h-72 sm:h-80 rounded-2xl bg-[#FBF7ED] border border-[#E1D9C4] overflow-hidden p-4 flex flex-col justify-between">
                {/* SVG Visual Regional Map */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  {/* Subtle Grid Lines */}
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E1D9C4" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Hotspot Circles */}
                  {/* Hotspot 1: Rampur / Burdwan-I (High Risk) */}
                  <circle cx="32%" cy="38%" r="48" fill="rgba(227, 138, 28, 0.28)" />
                  <circle cx="32%" cy="38%" r="24" fill="rgba(220, 38, 38, 0.35)" />
                  <circle cx="32%" cy="38%" r="6" fill="#C0431F" />

                  {/* Hotspot 2: Balughat / Kalna (High Risk) */}
                  <circle cx="68%" cy="62%" r="42" fill="rgba(227, 138, 28, 0.28)" />
                  <circle cx="68%" cy="62%" r="20" fill="rgba(220, 38, 38, 0.35)" />
                  <circle cx="68%" cy="62%" r="6" fill="#C0431F" />

                  {/* Hotspot 3: Sonapur / Nadia (Medium Risk) */}
                  <circle cx="58%" cy="28%" r="36" fill="rgba(227, 138, 28, 0.25)" />
                  <circle cx="58%" cy="28%" r="5" fill="#E38A1C" />

                  {/* Hotspot 4: Nutangram / Katwa (Low Risk / Healthy) */}
                  <circle cx="22%" cy="75%" r="30" fill="rgba(82, 183, 136, 0.25)" />
                  <circle cx="22%" cy="75%" r="5" fill="#2B6E4F" />
                </svg>

                {/* Hotspot Floating Badges */}
                <div className="relative z-10 flex justify-between items-start pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-sm border border-[#E1D9C4] px-3 py-1.5 rounded-xl text-[11px] shadow-sm">
                    <span className="font-bold text-[#C0431F]">🔴 Rampur (Burdwan-I)</span>
                    <span className="text-[#4C5548] block text-[10px]">428 leaf scans · 88% Blight</span>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm border border-[#E1D9C4] px-3 py-1.5 rounded-xl text-[11px] shadow-sm">
                    <span className="font-bold text-[#E38A1C]">🟡 Sonapur (Nadia)</span>
                    <span className="text-[#4C5548] block text-[10px]">215 leaf scans · Aphids</span>
                  </div>
                </div>

                <div className="relative z-10 flex justify-between items-end pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-sm border border-[#E1D9C4] px-3 py-1.5 rounded-xl text-[11px] shadow-sm">
                    <span className="font-bold text-[#2B6E4F]">🟢 Nutangram (Katwa)</span>
                    <span className="text-[#4C5548] block text-[10px]">190 leaf scans · Normal</span>
                  </div>

                  <div className="bg-white/90 backdrop-blur-sm border border-[#E1D9C4] px-3 py-1.5 rounded-xl text-[11px] shadow-sm">
                    <span className="font-bold text-[#C0431F]">🔴 Balughat (Kalna)</span>
                    <span className="text-[#4C5548] block text-[10px]">371 leaf scans · High Blight</span>
                  </div>
                </div>
              </div>

              {/* Block Alert Level Table */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E1D9C4] text-[#4C5548] font-bold">
                      <th className="py-2.5 px-3">{t('kvkThBlock', 'Block / Circle')}</th>
                      <th className="py-2.5 px-3">{t('kvkThIssue', 'Primary Detected Issue')}</th>
                      <th className="py-2.5 px-3">{t('kvkThDensity', 'Scan Density')}</th>
                      <th className="py-2.5 px-3">{t('kvkThRisk', 'Risk Level')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1D9C4]/60">
                    <tr className="hover:bg-[#FBF7ED]">
                      <td className="py-2.5 px-3 font-bold text-[#173C2D]">Burdwan-I (Rampur)</td>
                      <td className="py-2.5 px-3">Rice Blast / Leaf Blight</td>
                      <td className="py-2.5 px-3 font-mono">428 Scans</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FBE1DC] text-[#C0431F] font-bold text-[10px]">
                          {t('highRiskBadge', 'High Risk')}
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#FBF7ED]">
                      <td className="py-2.5 px-3 font-bold text-[#173C2D]">Kalna-II (Balughat)</td>
                      <td className="py-2.5 px-3">Tomato Early Blight</td>
                      <td className="py-2.5 px-3 font-mono">371 Scans</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FBE1DC] text-[#C0431F] font-bold text-[10px]">
                          {t('highRiskBadge', 'High Risk')}
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-[#FBF7ED]">
                      <td className="py-2.5 px-3 font-bold text-[#173C2D]">Krishnanagar (Sonapur)</td>
                      <td className="py-2.5 px-3">Mustard Aphid Cluster</td>
                      <td className="py-2.5 px-3 font-mono">215 Scans</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FBEFDC] text-[#E38A1C] font-bold text-[10px]">
                          {t('medRiskBadge', 'Medium Risk')}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column (1 Col on Desktop): Review Queue */}
          <div className="space-y-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#E1D9C4] shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-bold text-lg text-[#173C2D]">
                  {t('kvkReviewQueueTitle', 'Farmer Reports Needing Review')}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F3ECDA] text-[#173C2D] font-mono font-bold text-xs">
                  {submissions.length} {t('kvkItemsCount', 'items')}
                </span>
              </div>
              <p className="text-xs text-[#4C5548] mb-4">
                {t('kvkReviewQueueSub', 'Verify AI diagnoses and approve targeted advice for field dispatch')}
              </p>

              {/* Review Queue Items */}
              <div className="space-y-3">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSub(sub)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      selectedSub?.id === sub.id
                        ? 'border-[#2B6E4F] bg-[#FBF7ED] shadow-sm'
                        : 'border-[#E1D9C4] bg-white hover:border-[#2B6E4F]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-xs text-[#173C2D] truncate">
                        {sub.village} — {sub.farmerName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          sub.severity === 'high'
                            ? 'bg-[#FBE1DC] text-[#C0431F]'
                            : 'bg-[#FBEFDC] text-[#E38A1C]'
                        }`}
                      >
                        {sub.severity === 'high' ? t('highBadge', 'High') : t('medBadge', 'Medium')}
                      </span>
                    </div>

                    <div className="text-xs text-[#2B6E4F] font-semibold flex items-center justify-between">
                      <span>{sub.issue}</span>
                      <span className="text-[10px] font-mono text-[#4C5548]">{sub.confidence}%</span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#4C5548] mt-2 pt-2 border-t border-[#E1D9C4]/60">
                      <span>{sub.block} · {sub.timeAgo}</span>
                      <span
                        className={`font-bold ${
                          sub.status === 'verified'
                            ? 'text-[#2B6E4F]'
                            : sub.status === 'advisory_sent'
                            ? 'text-[#1D4ED8]'
                            : 'text-[#E38A1C]'
                        }`}
                      >
                        {sub.status === 'verified'
                          ? t('kvkStatusVerified', '✓ Verified')
                          : sub.status === 'advisory_sent'
                          ? t('kvkStatusAdvisorySent', '✓ Advisory Sent')
                          : t('kvkStatusPending', 'Pending Review')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Farmer Submission Inspection Modal */}
        {selectedSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-white border border-[#E1D9C4] rounded-3xl p-6 text-[#20261F] shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#E1D9C4]">
                <div>
                  <h3 className="font-heading font-bold text-lg text-[#173C2D]">
                    {t('kvkInspectionTitle', 'Farmer Submission Inspection')}
                  </h3>
                  <p className="text-xs text-[#4C5548]">
                    {selectedSub.farmerName} ({selectedSub.phone})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="touch-target w-9 h-9 rounded-full bg-[#F3ECDA] hover:bg-[#E1D9C4] text-[#4C5548] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {/* Photo & Diagnosis Info */}
                <div className="flex gap-3">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden bg-stone-900 border border-[#E1D9C4] flex-shrink-0">
                    <img src={selectedSub.imageUrl} alt="Leaf preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-[#173C2D] text-sm">{selectedSub.issue}</div>
                    <div className="text-[#4C5548]">{t('cropLabel', 'Crop:')} <b>{selectedSub.crop}</b></div>
                    <div className="text-[#4C5548]">{t('locationLabel', 'Location:')} <b>{selectedSub.village}, {selectedSub.block}</b></div>
                    <div className="text-[#4C5548]">{t('aiConfidenceLabel', 'AI Confidence:')} <b>{selectedSub.confidence}%</b></div>
                    <div className="pt-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        selectedSub.severity === 'high' ? 'bg-[#FBE1DC] text-[#C0431F]' : 'bg-[#FBEFDC] text-[#E38A1C]'
                      }`}>
                        {t('severityLabel', 'Severity:')} {selectedSub.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="p-3 rounded-2xl bg-[#FBF7ED] border border-[#E1D9C4] text-xs flex items-center justify-between">
                  <span className="text-[#4C5548]">{t('currentStatusLabel', 'Current Status:')}</span>
                  <span className="font-bold text-[#173C2D]">
                    {selectedSub.status === 'verified'
                      ? t('kvkStatusVerified', '✓ Verified by Officer')
                      : selectedSub.status === 'advisory_sent'
                      ? t('kvkStatusAdvisorySent', '✓ Advisory SMS / Push Dispatched')
                      : t('kvkStatusPending', 'Pending Officer Review')}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleVerify(selectedSub.id)}
                    className="flex-1 py-3 rounded-2xl bg-[#52B788] hover:bg-[#2B6E4F] hover:text-white text-[#173C2D] font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{t('kvkVerifyBtn', 'Verify Diagnosis')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendAdvisory(selectedSub.id)}
                    className="flex-1 py-3 rounded-2xl bg-[#2B6E4F] hover:bg-[#173C2D] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t('kvkPushSmsBtn', 'Push Remedy SMS')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Broadcast Regional Advisory Modal */}
        {showBroadcastModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-white border border-[#E1D9C4] rounded-3xl p-6 text-[#20261F] shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#E1D9C4]">
                <div>
                  <h3 className="font-heading font-bold text-lg text-[#173C2D]">
                    {t('kvkBroadcastModalTitle', 'Broadcast Regional Advisory')}
                  </h3>
                  <p className="text-xs text-[#4C5548]">
                    {t('kvkBroadcastModalSub', 'Push SMS & app alerts to all registered farmers in block')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="touch-target w-9 h-9 rounded-full bg-[#F3ECDA] hover:bg-[#E1D9C4] text-[#4C5548] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {broadcastSuccess ? (
                <div className="py-8 text-center space-y-2 animate-in fade-in duration-200">
                  <div className="w-12 h-12 rounded-full bg-[#E4F3EA] text-[#2B6E4F] mx-auto flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-[#173C2D]">{t('kvkBroadcastSuccessTitle', 'Advisory Broadcast Dispatched!')}</h4>
                  <p className="text-xs text-[#4C5548]">
                    {t('kvkBroadcastSuccessDesc', 'Sent to 420 registered farmers in circle.')}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBroadcastSubmit} className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#173C2D] block mb-1">{t('kvkTargetBlockLabel', 'Target Block')}</label>
                      <select
                        value={broadcastTargetBlock}
                        onChange={(e) => setBroadcastTargetBlock(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-[#FBF7ED] border border-[#E1D9C4] text-xs font-medium focus:outline-none focus:border-[#2B6E4F]"
                      >
                        <option value="Burdwan-I">Burdwan-I (High Alert)</option>
                        <option value="Kalna-II">Kalna-II (High Alert)</option>
                        <option value="Krishnanagar">Krishnanagar (Nadia)</option>
                        <option value="Katwa-I">Katwa-I</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#173C2D] block mb-1">{t('kvkTargetCropLabel', 'Target Crop')}</label>
                      <select
                        value={broadcastCrop}
                        onChange={(e) => setBroadcastCrop(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl bg-[#FBF7ED] border border-[#E1D9C4] text-xs font-medium focus:outline-none focus:border-[#2B6E4F]"
                      >
                        <option value="Rice / Paddy">Rice / Paddy</option>
                        <option value="Mustard">Mustard</option>
                        <option value="Tomato">Tomato</option>
                        <option value="All Crops">All Crops</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#173C2D] block mb-1">{t('kvkAdvisoryMsgLabel', 'Advisory Message')}</label>
                    <textarea
                      rows={4}
                      value={broadcastText}
                      onChange={(e) => setBroadcastText(e.target.value)}
                      className="w-full p-3 rounded-2xl bg-[#FBF7ED] border border-[#E1D9C4] text-xs focus:outline-none focus:border-[#2B6E4F]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl bg-[#E38A1C] hover:bg-[#C26F0E] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                      <span>{t('kvkDispatchPushBtn', 'Dispatch Regional Push to Target Block')}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
