import { useState } from 'react';
import {
    Building2,
    MapPin,
    Home,
    Layers,
    ShieldCheck,
    BrainCircuit,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Download,
    ClipboardCheck,
    MessageCircle
} from 'lucide-react';

const App = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        // Section 1: Empreendimentos
        '1.1': '', '1.2': '', '1.3': '', '1.4': '',
        // Section 2: Endereço
        '2.1': '', '2.2': '', '2.2_outro': '', '2.3': '', '2.4': '',
        // Section 3: Imóveis
        '3.1': '', '3.2': '', '3.3': '', '3.4': '',
        // Section 4: Estrutura
        '4.1': '', '4.2': '', '4.2_outro': '', '4.3': '', '4.3_limite': '',
        // Section 5: Operação
        '5.1': '', '5.2': '', '5.3': '',
        // Section 6: Negócio
        '6.1': '', '6.2': '',
        // Section 7: Confirmação
        '7.1': '', '7.2': '', '7.2_regra': ''
    });

    const steps = [
        { title: 'Status', icon: <Building2 className="w-5 h-5" /> },
        { title: 'Localização', icon: <MapPin className="w-5 h-5" /> },
        { title: 'Imóveis', icon: <Home className="w-5 h-5" /> },
        { title: 'Estrutura', icon: <Layers className="w-5 h-5" /> },
        { title: 'Operação', icon: <ShieldCheck className="w-5 h-5" /> },
        { title: 'Regras', icon: <BrainCircuit className="w-5 h-5" /> },
        { title: 'Finalizar', icon: <CheckCircle2 className="w-5 h-5" /> },
    ];

    const handleInputChange = (id: string, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const RadioOption = ({ id, label, value }: { id: keyof typeof formData; label: string; value: string }) => (
        <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData[id] === value ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:bg-gray-50'}`}>
            <input
                type="radio"
                name={id}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                checked={formData[id] === value}
                onChange={() => handleInputChange(id, value)}
            />
            <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
        </label>
    );

    const exportData = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "levantamento_tecnico_projeto.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const formatForWhatsApp = () => {
        const r = (id: string) => formData[id as keyof typeof formData] || '—';
        const lines = [
            '📋 *Levantamento Técnico SaaS*',
            '_Módulo: Empreendimentos & Gestão de Ativos_',
            '',
            '*1. Empreendimentos*',
            `1.1 Ativo/inativo: ${r('1.1')}`,
            `1.2 Inativo visível: ${r('1.2')}`,
            `1.3 Pode reativar: ${r('1.3')}`,
            `1.4 Inativo recebe imóveis: ${r('1.4')}`,
            '',
            '*2. Endereço*',
            `2.1 Apenas um endereço: ${r('2.1')}`,
            r('2.1') === 'Não' ? `2.2 Qtd endereços: ${r('2.2')}${r('2.2_outro') ? ` (${r('2.2_outro')})` : ''}` : null,
            `2.3 Endereço alterável: ${r('2.3')}`,
            `2.4 Lat/Long: ${r('2.4')}`,
            '',
            '*3. Imóveis*',
            `3.1 Vinculado a empreendimento: ${r('3.1')}`,
            `3.2 Imóvel sem empreendimento: ${r('3.2')}`,
            `3.3 Transferível entre emp.: ${r('3.3')}`,
            `3.4 Endereço do imóvel: ${r('3.4')}`,
            '',
            '*4. Estrutura*',
            `4.1 Possui subdivisões: ${r('4.1')}`,
            r('4.1') === 'Sim' ? `4.2 Estrutura: ${r('4.2')}${r('4.2_outro') ? ` (${r('4.2_outro')})` : ''}` : null,
            `4.3 Limite de imóveis: ${r('4.3')}${r('4.3') === 'Sim' ? ` → ${r('4.3_limite')}` : ''}`,
            '',
            '*5. Operação*',
            `5.1 Usuários autorizados: ${r('5.1')}`,
            `5.2 Auditoria: ${r('5.2')}`,
            `5.3 Bloquear exclusão: ${r('5.3')}`,
            '',
            '*6. Negócio*',
            `6.1 Ciclo de vida: ${r('6.1')}`,
            `6.2 Imóvel em múlt. emp.: ${r('6.2')}`,
            '',
            '*7. Confirmação*',
            `7.1 Estrutura correta: ${r('7.1')}`,
            `7.2 Regra omitida: ${r('7.2')}`,
            r('7.2') === 'Sim' ? `↳ ${r('7.2_regra')}` : null,
        ];
        return lines.filter(l => l !== null).join('\n');
    };

    const sendWhatsApp = () => {
        const text = formatForWhatsApp();
        const url = `https://wa.me/5586995135880?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-xl font-bold text-gray-800">1. Sobre Empreendimentos</h2>
                        <div className="space-y-4">
                            <p className="text-sm font-semibold text-gray-600">1.1 – Permitir marcar empreendimento como ativo/inativo?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <RadioOption id="1.1" label="Sim" value="Sim" />
                                <RadioOption id="1.1" label="Não" value="Não" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600">1.2 – Inativo deve continuar visível?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <RadioOption id="1.2" label="Sim" value="Sim" />
                                <RadioOption id="1.2" label="Não" value="Não" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600">1.3 – Pode ser reativado?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <RadioOption id="1.3" label="Sim" value="Sim" />
                                <RadioOption id="1.3" label="Não" value="Não" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600">1.4 – Inativo pode receber novos imóveis?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <RadioOption id="1.4" label="Sim" value="Sim" />
                                <RadioOption id="1.4" label="Não" value="Não" />
                            </div>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-xl font-bold text-gray-800">2. Endereço do Empreendimento</h2>
                        <div className="space-y-4">
                            <p className="text-sm font-semibold text-gray-600">2.1 – Possui apenas um endereço?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <RadioOption id="2.1" label="Sim" value="Sim" />
                                <RadioOption id="2.1" label="Não" value="Não" />
                            </div>
                            {formData['2.1'] === 'Não' && (
                                <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                                    <p className="text-xs font-bold text-gray-500 uppercase">2.2 – Quantos endereços ele pode ter?</p>
                                    <div className="space-y-2">
                                        <RadioOption id="2.2" label="1 por bloco/torre" value="1_por_bloco" />
                                        <RadioOption id="2.2" label="Vários sem limite" value="varios" />
                                        <input
                                            type="text"
                                            placeholder="Outro..."
                                            className="w-full p-3 border rounded-lg text-sm"
                                            value={formData['2.2_outro']}
                                            onChange={(e) => handleInputChange('2.2_outro', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                            <p className="text-sm font-semibold text-gray-600">2.3 – Endereço pode ser alterado após cadastro?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <RadioOption id="2.3" label="Sim" value="Sim" />
                                <RadioOption id="2.3" label="Não" value="Não" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600">2.4 – Armazenar localização geográfica (Lat/Long)?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <RadioOption id="2.4" label="Sim" value="Sim" />
                                <RadioOption id="2.4" label="Não" value="Não" />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-xl font-bold text-gray-800">3. Sobre Imóveis</h2>
                        <div className="space-y-4">
                            <p className="text-sm font-semibold text-gray-600">3.1 – Obrigatoriamente vinculado a um empreendimento?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <RadioOption id="3.1" label="Sim" value="Sim" />
                                <RadioOption id="3.1" label="Não" value="Não" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600">3.2 – Um imóvel pode existir sem empreendimento?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <RadioOption id="3.2" label="Sim" value="Sim" />
                                <RadioOption id="3.2" label="Não" value="Não" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600">3.3 – Pode ser transferido entre empreendimentos?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <RadioOption id="3.3" label="Sim" value="Sim" />
                                <RadioOption id="3.3" label="Não" value="Não" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600">3.4 – Endereço do imóvel?</p>
                            <div className="space-y-2">
                                <RadioOption id="3.4" label="Possui endereço próprio" value="proprio" />
                                <RadioOption id="3.4" label="Herda do empreendimento" value="herda" />
                                <RadioOption id="3.4" label="Ambos (Configurável)" value="ambos" />
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-xl font-bold text-gray-800">4. Estrutura do Empreendimento</h2>
                        <div className="space-y-4">
                            <p className="text-sm font-semibold text-gray-600">4.1 – Possui subdivisões (blocos, torres)?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <RadioOption id="4.1" label="Sim" value="Sim" />
                                <RadioOption id="4.1" label="Não" value="Não" />
                            </div>
                            {formData['4.1'] === 'Sim' && (
                                <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                                    <p className="text-xs font-bold text-gray-500 uppercase">4.2 – Qual estrutura é utilizada?</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <RadioOption id="4.2" label="Blocos" value="Blocos" />
                                        <RadioOption id="4.2" label="Torres" value="Torres" />
                                        <RadioOption id="4.2" label="Andares" value="Andares" />
                                        <input
                                            type="text"
                                            placeholder="Outro..."
                                            className="p-3 border rounded-lg text-sm"
                                            value={formData['4.2_outro']}
                                            onChange={(e) => handleInputChange('4.2_outro', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                            <p className="text-sm font-semibold text-gray-600">4.3 – Existe limite de imóveis por empreendimento?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <RadioOption id="4.3" label="Não" value="Não" />
                                <div className="flex flex-col gap-2">
                                    <RadioOption id="4.3" label="Sim" value="Sim" />
                                    {formData['4.3'] === 'Sim' && (
                                        <input
                                            type="number"
                                            placeholder="Qual o limite?"
                                            className="p-3 border border-blue-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={formData['4.3_limite']}
                                            onChange={(e) => handleInputChange('4.3_limite', e.target.value)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-xl font-bold text-gray-800">5. Regras de Operação</h2>
                        <div className="space-y-4">
                            <p className="text-sm font-semibold text-gray-600">5.1 – Apenas usuários autorizados podem cadastrar?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <RadioOption id="5.1" label="Sim" value="Sim" />
                                <RadioOption id="5.1" label="Não" value="Não" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600">5.2 – Deve existir histórico de alterações (Auditoria)?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <RadioOption id="5.2" label="Sim" value="Sim" />
                                <RadioOption id="5.2" label="Não" value="Não" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600">5.3 – Impedir exclusão se houver imóveis vinculados?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <RadioOption id="5.3" label="Sim" value="Sim" />
                                <RadioOption id="5.3" label="Não" value="Não" />
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <h2 className="text-xl font-bold text-gray-800">6. Regras de Negócio</h2>
                        <div className="space-y-4">
                            <p className="text-sm font-semibold text-gray-600">6.1 – Ciclo de Vida:</p>
                            <div className="space-y-2">
                                <RadioOption id="6.1" label="Pode ser excluído permanentemente" value="Excluido" />
                                <RadioOption id="6.1" label="Apenas inativado (Soft Delete)" value="Inativado" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600">6.2 – Imóveis podem estar em múltiplos empreendimentos ao mesmo tempo?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <RadioOption id="6.2" label="Sim" value="Sim" />
                                <RadioOption id="6.2" label="Não" value="Não" />
                            </div>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-2">
                                <ClipboardCheck className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Pronto para Revisão</h2>
                            <p className="text-gray-500">Confirme se as informações representam seu processo atual.</p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm font-semibold text-gray-600">7.1 – Estrutura correta?</p>
                            <div className="grid grid-cols-2 gap-4">
                                <RadioOption id="7.1" label="Sim" value="Sim" />
                                <RadioOption id="7.1" label="Não" value="Não" />
                            </div>
                            <p className="text-sm font-semibold text-gray-600">7.2 – Existe alguma regra omitida?</p>
                            <div className="space-y-3">
                                <RadioOption id="7.2" label="Não" value="Não" />
                                <div className="flex flex-col gap-2">
                                    <RadioOption id="7.2" label="Sim" value="Sim" />
                                    {formData['7.2'] === 'Sim' && (
                                        <textarea
                                            placeholder="Descreva a regra adicional..."
                                            className="w-full p-3 border border-blue-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none h-24"
                                            value={formData['7.2_regra']}
                                            onChange={(e) => handleInputChange('7.2_regra', e.target.value)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t space-y-3">
                            <button
                                onClick={sendWhatsApp}
                                className="w-full flex items-center justify-center gap-2 bg-green-500 text-white p-4 rounded-xl font-bold hover:bg-green-600 transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Enviar pelo WhatsApp
                            </button>
                            <button
                                onClick={exportData}
                                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                            >
                                <Download className="w-5 h-5" />
                                Baixar Relatório de Requisitos
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

                {/* Header */}
                <div className="bg-slate-900 p-8 text-white">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500 rounded-lg">
                            <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Levantamento Técnico SaaS</h1>
                    </div>
                    <p className="text-slate-400 text-sm">
                        Módulo: Empreendimentos & Gestão de Ativos
                    </p>
                </div>

                {/* Stepper */}
                <div className="flex justify-between px-8 py-6 bg-slate-50/50 border-b overflow-x-auto no-scrollbar">
                    {steps.map((step, idx) => (
                        <div
                            key={idx}
                            className={`flex flex-col items-center gap-1 transition-opacity ${currentStep === idx ? 'opacity-100' : 'opacity-30'}`}
                        >
                            <div className={`p-2 rounded-full ${currentStep === idx ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-200 text-slate-500'}`}>
                                {step.icon}
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider">{step.title}</span>
                        </div>
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-slate-100">
                    <div
                        className="h-full bg-blue-500 transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                </div>

                {/* Content */}
                <div className="p-8">
                    {renderStepContent()}
                </div>

                {/* Footer Navigation */}
                <div className="p-8 bg-slate-50 border-t flex items-center justify-between">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all ${currentStep === 0 ? 'text-transparent' : 'text-slate-500 hover:bg-slate-200'}`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Voltar
                    </button>

                    {currentStep < steps.length - 1 && (
                        <button
                            onClick={nextStep}
                            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
                        >
                            Próximo
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-2xl mx-auto mt-8 text-center text-slate-400 text-xs">
                Este formulário gera um arquivo JSON estruturado para mapeamento automático de entidades Django.
            </div>
        </div>
    );
};

export default App;
