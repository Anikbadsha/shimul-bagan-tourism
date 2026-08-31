import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, folder = 'uploads', label = 'Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { alert('Only images allowed'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return; }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage.from('site-images').upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } else {
      const { data } = supabase.storage.from('site-images').getPublicUrl(path);
      if (data?.publicUrl) onChange(data.publicUrl);
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  return (
    <div>
      <label className="block text-xs text-slate-400 mb-1">{label}</label>
      {value ? (
        <div className="relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
          <img src={value} alt="" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 bg-red-600/90 rounded-lg hover:bg-red-500"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragOver ? 'border-rose-500 bg-rose-500/10' : 'border-slate-700 bg-slate-800 hover:border-slate-600'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-slate-400">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-slate-500" />
              <span className="text-sm text-slate-400">Click or drag to upload</span>
              <span className="text-xs text-slate-600">JPG, PNG, WebP — max 5MB</span>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }}
          />
        </div>
      )}
    </div>
  );
}
