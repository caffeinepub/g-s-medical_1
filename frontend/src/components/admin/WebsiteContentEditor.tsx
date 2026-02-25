import { useState, useEffect } from 'react';
import { useGetSiteContent, useUpdateSiteContent } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { FileEdit, Save, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface ContentField {
  key: string;
  label: string;
  description: string;
  type: 'text' | 'textarea';
  placeholder: string;
  maxLength?: number;
}

const CONTENT_FIELDS: ContentField[] = [
  {
    key: 'hero_headline',
    label: 'Hero Headline',
    description: 'Main headline displayed on the hero banner',
    type: 'text',
    placeholder: 'e.g. Your Health, Our Priority',
    maxLength: 80,
  },
  {
    key: 'hero_subtext',
    label: 'Hero Subtext',
    description: 'Supporting text below the hero headline',
    type: 'textarea',
    placeholder: 'e.g. Delivering quality medicines...',
    maxLength: 200,
  },
  {
    key: 'about_text',
    label: 'About Us Text',
    description: 'Main description in the About Us section',
    type: 'textarea',
    placeholder: 'Describe your store...',
    maxLength: 500,
  },
  {
    key: 'announcement',
    label: 'Announcement Banner',
    description: 'Special announcement or offer to display on the website',
    type: 'text',
    placeholder: 'e.g. Special discount on all vitamins this week!',
    maxLength: 150,
  },
  {
    key: 'store_tagline',
    label: 'Store Tagline',
    description: 'Short tagline for the store',
    type: 'text',
    placeholder: 'e.g. Trusted Healthcare Since Day One',
    maxLength: 60,
  },
  {
    key: 'footer_text',
    label: 'Footer Description',
    description: 'Short description shown in the website footer',
    type: 'textarea',
    placeholder: 'Brief store description for footer...',
    maxLength: 200,
  },
];

function ContentFieldEditor({ field }: { field: ContentField }) {
  const { data: content, isLoading } = useGetSiteContent(field.key);
  const updateContent = useUpdateSiteContent();
  const [value, setValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (content?.value) {
      setValue(content.value);
    }
  }, [content]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateContent.mutateAsync({ key: field.key, value: value.trim() });
      setSaved(true);
      toast.success(`"${field.label}" saved successfully!`);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error(`Failed to save "${field.label}". Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  const charCount = value.length;
  const maxLen = field.maxLength || 500;
  const isOverLimit = charCount > maxLen;

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <Label className="text-emerald-900 font-semibold text-sm">{field.label}</Label>
          <p className="text-xs text-muted-foreground mt-0.5">{field.description}</p>
        </div>
        {isLoading && <Loader2 size={14} className="animate-spin text-emerald-500 mt-1" />}
      </div>

      {field.type === 'textarea' ? (
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className="rounded-xl resize-none border-emerald-200 focus:border-emerald-500 mb-2"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={field.placeholder}
          className="rounded-xl border-emerald-200 focus:border-emerald-500 mb-2"
        />
      )}

      <div className="flex items-center justify-between">
        <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-muted-foreground'}`}>
          {charCount}/{maxLen} characters
        </span>
        <Button
          onClick={handleSave}
          disabled={isSaving || isOverLimit || !value.trim()}
          size="sm"
          className={`rounded-xl text-xs ${saved ? 'bg-emerald-600' : 'bg-emerald-700 hover:bg-emerald-800'} text-white`}
        >
          {isSaving ? (
            <><Loader2 size={12} className="animate-spin mr-1.5" />Saving...</>
          ) : saved ? (
            <><CheckCircle size={12} className="mr-1.5" />Saved!</>
          ) : (
            <><Save size={12} className="mr-1.5" />Save</>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function WebsiteContentEditor() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-emerald-900">Website Content Editor</h2>
          <p className="text-sm text-muted-foreground">Edit and update the text content displayed on your website</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <RefreshCw size={13} className="text-emerald-600" />
          <span className="text-xs text-emerald-700 font-medium">Auto-synced</span>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
        <FileEdit size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-emerald-900">Content Management</p>
          <p className="text-xs text-emerald-700 mt-0.5">
            Changes saved here will be reflected on the public website. Each field is saved individually — click "Save" after editing each section.
          </p>
        </div>
      </div>

      {/* Content fields */}
      <div className="grid gap-4">
        {CONTENT_FIELDS.map((field) => (
          <ContentFieldEditor key={field.key} field={field} />
        ))}
      </div>
    </div>
  );
}
