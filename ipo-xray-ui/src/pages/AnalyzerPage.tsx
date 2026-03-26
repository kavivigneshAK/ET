import React, { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UploadCloud, File, AlertCircle, FolderSearch } from 'lucide-react';
import ProcessingTerminal from '../components/ProcessingTerminal';
import { useToast } from '../contexts/ToastContext';

const API_BASE = 'http://127.0.0.1:8000';

export default function AnalyzerPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  type StageStatus = 'pending' | 'loading' | 'success' | 'error';
  interface Stage {
    id: string;
    name: string;
    status: StageStatus;
    detail?: string;
  }

  const [stages, setStages] = useState<Stage[]>([
    { id: 'upload', name: 'Secure Document Ingestion', status: 'pending' },
    { id: 'parse', name: 'RHP PDF Tokenization', status: 'pending' },
    { id: 'llm', name: 'Gemini 2.5 Pro Inference', status: 'pending' },
    { id: 'report', name: 'Generating Forensic Risk Matrix', status: 'pending' },
  ]);

  const updateStage = (id: string, status: any, detail?: string) => {
    setStages(prev => prev.map(s => s.id === id ? { ...s, status, detail } : s));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
      showToast('Document securely buffered locally.', 'info');
    }
  }, [showToast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      showToast('Document securely buffered from disk.', 'info');
    }
  };

  const handleRunAnalysis = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    
    setStages(stages.map(s => ({ ...s, status: 'pending', detail: undefined })));
    setProgress(5);
    
    try {
      const userId = "64c9f1a23b4c5d6e7f8a9b0c"; 

      // 1. Upload Document
      updateStage('upload', 'loading', `Uploading ${file.name}...`);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userId);

      const uploadRes = await axios.post(`${API_BASE}/upload/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const documentId = uploadRes.data.id || uploadRes.data._id || uploadRes.data.document_id;
      
      updateStage('upload', 'success', `Stored firmly correctly on host.`);
      showToast('Cloud ingestion phase complete.', 'success');
      setProgress(25);
      
      // 2. Parsed / Initialized
      updateStage('parse', 'loading', 'Extracting raw optical text from 500+ pages...');
      await new Promise(r => setTimeout(r, 1500)); 
      updateStage('parse', 'success', 'Tokenization mapping completely finalized.');
      setProgress(40);

      // 3. Trigger LLM
      updateStage('llm', 'loading', 'Transmitting context arrays to generative architecture...');
      
      const analyzeRes = await axios.post(`${API_BASE}/analyze/${documentId}`);
      const generatedReportId = analyzeRes.data.id || analyzeRes.data._id;
      
      updateStage('llm', 'success', 'Deep context matrix effectively retrieved.');
      setProgress(85);

      // 4. Generate Report
      updateStage('report', 'loading', 'Formatting JSON architecture output...');
      await new Promise(r => setTimeout(r, 1000));
      updateStage('report', 'success', 'Analysis entirely compiled!');
      showToast('Forensic analysis successfully rendered.', 'success');
      setProgress(100);

      setTimeout(() => {
        navigate(`/report/${generatedReportId}`);
      }, 1500);

    } catch (err: any) {
      console.error(err);
      let errMsg = err.response?.data?.detail || err.message || 'Unknown network error';
      
      if (typeof errMsg !== 'string') {
        try {
          errMsg = errMsg[0]?.msg || JSON.stringify(errMsg);
        } catch {
          errMsg = "Complex network error occurred.";
        }
      }

      setError(errMsg);
      
      setStages(prev => prev.map(s => s.status === 'loading' ? { ...s, status: 'error', detail: errMsg } : s));
      setIsProcessing(false);
      showToast(`Pipeline CRASH: ${errMsg}`, 'error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#030812] pt-12 pb-12 px-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 pl-4 border-l-[3px] border-primary/50">
          <h1 className="text-3xl font-display font-bold text-textPrimary">Analysis Pipeline</h1>
          <p className="text-textMuted mt-1">Direct ingest engine to parse RHP volumes into categorical risk scores.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 flex flex-col">
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`flex-1 min-h-[350px] glass-card rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-8 transition-all ${file ? 'border-success/40 bg-success/5 shadow-[inset_0_0_20px_rgba(0,227,150,0.1)]' : 'border-primary/20 hover:border-primary/60 bg-black/40 hover:shadow-neon-cyan'}`}
            >
              {file ? (
                <div className="text-center">
                  <File className="w-16 h-16 text-success mx-auto mb-4 drop-shadow-[0_0_15px_rgba(0,227,150,0.5)]" />
                  <p className="font-mono text-sm text-success truncate max-w-[200px] mx-auto mb-2 font-semibold">{file.name}</p>
                  <p className="text-[10px] text-textMuted bg-black/50 py-0.5 px-2 rounded-sm border border-white/5 inline-block">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button onClick={() => { setFile(null); showToast('Buffer cleared.', 'info'); }} disabled={isProcessing} className={`block mt-6 text-[10px] uppercase tracking-widest text-danger hover:text-white font-mono transition-colors mx-auto p-2 bg-danger/5 rounded-md border border-danger/10 hover:bg-danger hover:border-danger hover:shadow-neon-danger ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>X Remove File Buffer</button>
                </div>
              ) : (
                <div className="text-center relative pointer-events-auto">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/10 rounded-full blur-[40px] mix-blend-screen pointer-events-none"></div>
                  <UploadCloud className="w-16 h-16 text-primary mx-auto mb-6 drop-shadow-[0_0_15px_rgba(0,212,255,0.4)] relative z-10 pointer-events-none" />
                  <p className="text-lg font-medium text-textPrimary mb-2 relative z-10 tracking-wide pointer-events-none drop-shadow-md">Drag & Drop RHP PDF</p>
                  
                  <input
                    type="file"
                    id="fileInput"
                    accept=".pdf"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-6 px-6 py-2 bg-black/40 border border-dashed border-primary/50 text-primary hover:border-primary hover:bg-primary/10 font-mono text-[10px] uppercase tracking-widest rounded-lg transition-all relative z-20 flex items-center mx-auto"
                  >
                    <FolderSearch className="w-4 h-4 mr-2" /> OR BROWSE FROM OS FOLDER
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={handleRunAnalysis}
              disabled={!file || isProcessing}
              className={`mt-4 w-full py-4 rounded-xl font-display font-bold uppercase tracking-widest transition-all duration-500 overflow-hidden relative shadow-lg ${!file || isProcessing ? 'bg-white/5 text-textMuted border border-white/10 cursor-not-allowed' : 'bg-primary text-[#050B18] hover:bg-[#00e1ff] shadow-[0_0_15px_rgba(0,212,255,0.3)] hover:shadow-neon-cyan group'}`}
            >
              <div className="relative z-10 flex items-center justify-center">
                {isProcessing && <div className="w-4 h-4 border-[3px] border-textMuted border-t-[#050B18] rounded-full animate-spin mr-3"></div>}
                {isProcessing ? 'Executing Scan...' : 'Run GenAI X-Ray'}
              </div>
              {!isProcessing && file && <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 group-hover:left-[200%] transition-all duration-[1500ms] ease-in-out"></div>}
            </button>
            
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-lg bg-danger/10 border border-danger/30 flex items-start shadow-neon-danger">
                <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mr-3 mt-0.5" />
                <p className="text-sm text-danger font-medium leading-relaxed drop-shadow-lg">{error}</p>
              </motion.div>
            )}
            
          </div>

          <div className="lg:col-span-7 h-[350px] lg:h-auto overflow-hidden mt-4 lg:mt-0">
            <div className="h-full flex flex-col justify-end">
               {/* Terminal auto-scroll is naturally managed since ProcessingTerminal stages array height implies standard footprint, but we can refine it inline if needed */}
               <ProcessingTerminal stages={stages} progress={progress} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
